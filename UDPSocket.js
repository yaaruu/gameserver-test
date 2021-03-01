import {createSocket} from "dgram";
import PacketManager from "./PacketManage.js";
class PrivateUDPSocket {
    constructor(port) {
        this.port = port;
        this.server = createSocket('udp4');
        console.log("Created udp socket");
    }

    start() {        
        this.server.on('error', (err) => {
            console.log(`${err.stack}`);
            PrivateUDPSocket.server.close();
        });
        
        this.server.on('message', (msg, rinfo) => {
            // console.log(msg);
            PacketManager.handle(msg, rinfo,UDPSocket.getInstance().server);
        });
        
        this.server.on('listening', () => {
            const address = UDPSocket.getInstance().server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });
        
        this.server.bind(this.port); //47808
    }
}

class UDPSocket {
    constructor() {
        throw new Error("use UDPSocket.getInstance()");
    }
    static getInstance(port) {
        if(!this.instance){
            this.instance = new PrivateUDPSocket(port);
        }
        return this.instance;
    }
}

export default UDPSocket;