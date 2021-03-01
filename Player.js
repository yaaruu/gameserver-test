import * as math3d from 'math3d';
class Player {
    constructor(username){
        this.username = username;
        this._id = -1;
        this.udphandler = null;
        this.sockethandler = null;
        this.managerIndex = -1;
        this.isSpawned = false;
        this.position = new math3d.Vector3(0,0,0);
        this.velocity = new math3d.Vector3(0,0,0);
        this.lastFrame = Date.now();
    }

    setSocketHandler(wsConnection){
        this.sockethandler = wsConnection;
        return this;
    }

    setUdpHandler(udpConnection){        
        this.udphandler = udpConnection;
        return this;
    }

    setPlayerId(id){
        this._id = id;
        return this; 
    }

    receiveInput(transformDirection, moveSpeed, vMovement, deltaTime){        
        let adjustedSpeed = this.adjustSpeed(moveSpeed, vMovement);
        let flatMovement = transformDirection.mulScalar(adjustedSpeed * deltaTime);
        // console.log(`${flatMovement}`);        
        this.lastFrame = Date.now();        
        this.velocity = flatMovement;
        this.position = this.position.add(flatMovement);
        // console.log(this.position);
        return this;
    }

    adjustSpeed(speed, vMovement){
        let s = speed;
        if(vMovement < 0){
            s = speed / 1.25;
        }
        return s;
    }

    requestUDPConnect(){
        console.log(`Sending UDP Connect Request for ${this._id}`);
        this.sockethandler._connection.send(JSON.stringify({
            type: 'req_open_udp_conn',
            payload: JSON.stringify({
                username: this.username,
                playerId: this._id
            }),
        }));
    }
}

export default Player;