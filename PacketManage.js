import {PacketManagePlayer} from "./UDPController/PlayerController.js"

const PacketManager = {
    handle: function (packet, rinfo, server){        
        PacketManagePlayer(packet,rinfo,server);
    },
}

export default PacketManager;