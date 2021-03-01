import ws from "ws";
import WSUsers from "./WSUsers.js";

class PrivateWebSocket {
    constructor(){
        this.server = null;
        this._connections = [];
        this.maxConnections = 2048;
        this.idPool = [];
    }

    start(){        
        this.server = new ws.Server({port: 8471}, () => {
            console.log("Starting Websocket at Port: 8471");
        });
        this.server.on("listening", () => {
            console.log("Websocket is listening on Port 8471");
        });
        this.server.on("connection", async (socket) => {
            let unusedId = await WebSocket.getInstance().getUnusedID();
            if(!unusedId) {
                socket.send(JSON.stringify({
                    type: 'join_handshake',
                    payload: JSON.stringify({
                        status: false,
                        message: "Server full!"
                    })
                }));
                return;
            } else {
                WebSocket.getInstance()._connections.push(new WSUsers(socket,unusedId).listen());
            }            
        });
        setInterval(() => {
            // console.log(`Connections number: ${WebSocket.getInstance()._connections.length}`);
            WebSocket.getInstance().pingUser();
        },1000);
    }

    pingUser(){
        WebSocket.getInstance()._connections.map((conn, index) => {
            conn.ping();
            let isInactive = conn.checkInactive();            
            if(isInactive){
               WebSocket.getInstance()._connections.splice(index,1);
            }
        });
    }    

    broadcastMsg(eventType, data){
        let wsList = WebSocket.getInstance()._connections;        
        // BroadCastSocket
        wsList.map((ws) => {
            ws._connection.send(JSON.stringify({
                type: eventType,
                payload: JSON.stringify(data),
            }));
        });
    }

    getUnusedID(){
        return new Promise((resolve, reject) => {
            for(let i=1; i<this.maxConnections;i++){
                if(!WebSocket.instance.idPool.includes(i)){
                    resolve(i);
                }
            }
            reject(false);
        });        
    }
}    

class WebSocket {
    constructor() {
        throw new Error("use WebSocket.getInstance()");
    }
    static getInstance(){
        if(!WebSocket.instance) {
            WebSocket.instance = new PrivateWebSocket();
        }
        return WebSocket.instance;
    }    
}
export default WebSocket;