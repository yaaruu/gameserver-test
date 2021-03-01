import WebSocket from "./WebSocket.js";
import UDPSocket from './UDPSocket.js';

const ws = WebSocket.getInstance();
const udpsocket = UDPSocket.getInstance(47808);

udpsocket.start();
ws.start();