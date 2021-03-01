import GameManager from "./../GameManager.js";
import Player from "./../Player.js";
export const PlayerJoinController = async (data, socketConnection) => {    
    const gm = GameManager.getInstance();
    const ep = JSON.parse(data);    
    switch(ep.type){
        case 'req_join_game':            
            let payload = JSON.parse(ep.payload); // {username}
            console.log(payload);
            
            let player = new Player(payload.username);
            player.setSocketHandler(socketConnection);
            gm.playerRequestJoin(player);            
            break;

        case 'player_spawned':
            break;
        
        case 'get_player_list':
            let {playerId} = JSON.parse(ep.payload);
            let playerList = await gm.getListPlayer(playerId);
            let p = await gm.getPlayerById(playerId);                        
            p.player.sockethandler._connection.send(JSON.stringify({
                type: "got_player_list",
                payload: JSON.stringify(playerList)
            }));            
            break;
        default:
            break;
    }    
}

