import WebSocket from "./WebSocket.js";
class PrivateGameManager {
    constructor() {
        this.player = [];
        this.idPool = [];
        this.maxConnections = 512;
    }

    async playerRequestJoin(player){        
        let unusedId = await GameManager.getInstance().getUnusedID();
        let p = player.setPlayerId(unusedId);
        GameManager.getInstance().idPool.push(unusedId);
        GameManager.getInstance().player.push(p);
        p.requestUDPConnect();
        let data = {};
        data.playerId = p._id;
        data.username = p.username;
        data.position = {
            x: p.position.x,
            y: p.position.y,
            z: p.position.z
        };
        setTimeout(() => {
            WebSocket.getInstance().broadcastMsg("on_player_connected",data);
        },250);
        
    }

    getUnusedID(){
        return new Promise((resolve, reject) => {
            for(let i=1; i<this.maxConnections;i++){
                if(!GameManager.instance.idPool.includes(i)){
                    resolve(i);
                }
            }
            reject(false);
        });        
    }

    getPlayerById(id){
        return new Promise(async (resolve, reject) => {
            await GameManager.getInstance().player.map((p,i) => {
                if(p._id === id){
                    resolve({
                        player: p,
                        index:i});
                }
            });
            resolve(null);
        });
    }

    async getListPlayer(playerId){ // playerId ( playe yg melakukan request. Tidak di ikut sertakan dalam list)
        return new Promise((resolve, reject) => {
            let lists = [];
            const players = GameManager.getInstance().player;
            players.map((p, i) => {
                if(p._id !== playerId){
                    let data = {};
                    data.playerId = p._id;
                    data.username = p.username;
                    data.position = {
                        x: p.position.x,
                        y: p.position.y,
                        z: p.position.z
                    };
                    lists.push(data);
                }                
            });
            resolve(lists);
        });
        
    }
}

class GameManager {
    constructor() {
        throw new Error("use GameManager.getInstance()");
    }

    static getInstance() {
        if(!GameManager.instance){
            GameManager.instance = new PrivateGameManager();
        }
        return GameManager.instance;
    }
}

export default GameManager;