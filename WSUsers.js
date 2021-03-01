import {PlayerJoinController} from "./SocketController/PlayerJoinController.js";

class WSUsers {
    constructor(connection, id){
        this._id = id;
        this._connection = connection;
        this._lastPong = Date.now();
        this._pongDiff = 0;
    }
    listen() {
        this._connection.on('message', (data) => {
            const ep = JSON.parse(data);
            if(ep.type === "pong"){                                
                this._lastPong = Date.now();                                
            }
            PlayerJoinController(data, this);
        });
        return this;
    }

    ping() {
        // console.log("Pinging user");
        this._connection.send(JSON.stringify({
            type: 'ping',
            payload: '',
        }));
        let diff = Date.now() - this._lastPong;        
        this._pongDiff = diff;
    }

    checkInactive(){        
        if(this._pongDiff > 3000){
            return true;
        } else {
            return false;
        }
    }
}

export default WSUsers;