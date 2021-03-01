class PrivateBroadcaster {
    constructor() {
        this.ok = true;
    }
}

class Broadcaster {
    constructor() {
        throw new Error("use Broadcaster.getInstance()");
    }

    static getInstance() {
        if(!Broadcaster.instance){
            Broadcaster.instance = new PrivateBroadcaster();
        }
        return Broadcaster.instance;
    }
}

export default Broadcaster;