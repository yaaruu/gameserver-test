export const ServerPacket = {
    pong: 1,
    simPosition: 2,
    predictPosition: 3,
}
export const ClientPacket = {
    ping: 1,
    mapConnection: 2,
    playerMoveInput: 3,
    playePosition: 4
}

class Packet {
    constructor (_packetId = -1) {
        this.readPos = 0;
        if(_packetId  !== -1) {
            this.buffer = Buffer.alloc(4);
            this.buffer.writeInt8(_packetId,0);            
        }        
    }

    writeInt(number){
        if (isInt(number)){
            let newInt = Buffer.alloc(4); // make signed integer 4 bytes;
            newInt.writeInt8(number,0);
            let byteLength = this.buffer.byteLength;
            this.buffer = Buffer.concat([this.buffer,newInt],byteLength+4);
            return this;
        } else {
            throw new Exception("writeInt parameter should be an int8");
        }
    }
    writeFloat(number){
        if(!isNaN(parseFloat(number))){
            let value = parseFloat(number);
            let newFloat = Buffer.alloc(4);
            newFloat.writeFloatLE(value,0);
            let byteLength = this.buffer.byteLength;
            this.buffer = Buffer.concat([this.buffer,newFloat], byteLength+4);
            return this;
        } else {
            throw new Exception("writeInt parameter should be a float");
        }
    }

    writeLength(){
        let newBuffer = Buffer.alloc(4);
        let byteLength = this.buffer.byteLength;
        newBuffer.writeInt8(byteLength,0);
        this.buffer = Buffer.concat([newBuffer,this.buffer],byteLength+4);
        return this;
    }

    make(_packet){
        this.buffer = Buffer.from(_packet);
        return this;
    }

    readInt(newPacket, resetPointer = false){
        let int = this.buffer.readIntLE(this.readPos,4);
        if(!resetPointer){
            newPacket.readPos = newPacket.readPos + 4;
        } else {
            newPacket.readPos = 0;
        }        
        return int;
    }
    readFloat(newPacket, resetPointer = false){
        let float = this.buffer.readFloatLE(this.readPos,4);
        if(!resetPointer){
            newPacket.readPos = newPacket.readPos + 4;
        } else {
            newPacket.readPos = 0;
        }        
        return float;
    }
}

function isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

export default Packet;