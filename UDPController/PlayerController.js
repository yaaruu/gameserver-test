import Packet, {ClientPacket, ServerPacket} from "./../Packet.js";
import GameManager from './../GameManager.js';
import * as math3d from 'math3d';
const send = function(server, buffer, port, host, cb){        
    server.send(buffer,port,host,cb);
}

const sendToAll = async function(server,buffer,cb){
    const players = GameManager.getInstance().player;
    players.map((p,i) => {
        const rinfo = p.udphandler;
        try {
            server.send(buffer,rinfo.port,rinfo.address,cb);
        } catch(err){
            console.log(err.message);
        }
        
    });
}
export const PacketManagePlayer = async (packet, rinfo, server) => {
    // let _packet = Buffer.from(packet);
    // let length = _packet.readIntLE(0,4);
    // let packetId = _packet.readIntLE(4,4);
    let _packet = new Packet().make(packet);        
    let length = _packet.readInt(_packet);                
    let packetId = _packet.readInt(_packet);        
    let clientId = _packet.readInt(_packet); 
    if(packetId == ClientPacket.ping) {                                           
        // console.log(`client id: ${clientId}`);
        let newPacket = new Packet(ServerPacket.pong)
            .writeInt(clientId)
            .writeLength().buffer;
        //console.log(newPacket);
        send(server,newPacket,rinfo.port, rinfo.address, null);
    }
    if(packetId == ClientPacket.mapConnection){
        console.log("Request for mapping udp to player");
        let {player,index} = await GameManager.getInstance().getPlayerById(clientId);
        if(player !== null){
            player.setUdpHandler(rinfo);
            GameManager.getInstance().player[index] = player;
            console.log("Mapping success");
            console.log(player.udphandler);
        }
    }
    if(packetId == ClientPacket.playerMoveInput){
        // tfd = transformDirection;
        let tfdX = _packet.readFloat(_packet);
        let tfdY = _packet.readFloat(_packet);
        let tfdZ = _packet.readFloat(_packet);
        let mvSpeed = _packet.readFloat(_packet);
        let vMovement = _packet.readFloat(_packet);
        let deltaTime = _packet.readFloat(_packet);
        let angle = _packet.readFloat(_packet);
        let {player,index} = await GameManager.getInstance().getPlayerById(clientId);
        if(player !== null){
            let transformDirection = new math3d.Vector3(tfdX,tfdY,tfdZ);
            // console.log(`${transformDirection} ${mvSpeed} ${vMovement}`);
            player = player.receiveInput(transformDirection,mvSpeed,vMovement, deltaTime, angle);
            GameManager.getInstance().player[index] = player;
            const newPacket = new Packet(ServerPacket.simPosition)
                .writeInt(clientId)
                .writeFloat(player.velocity.x)
                .writeFloat(player.velocity.y)
                .writeFloat(player.velocity.z)
                .writeFloat(vMovement)
                .writeFloat(angle)
                .writeLength().buffer;
            sendToAll(server,newPacket,null);
        }
        // send server predicted position
        const pPos = player.position;
        const predictPacket = new Packet(ServerPacket.predictPosition)
            .writeInt(clientId)
            .writeFloat(pPos.x)
            .writeFloat(pPos.y)
            .writeFloat(pPos.z)
            .writeLength().buffer;
        send(server,predictPacket,rinfo.port, rinfo.address, null);        
    }
}

