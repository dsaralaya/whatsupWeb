import Express from "./config/express";
import * as http from 'http';
import socketIO from 'socket.io';
import { appConfig } from './config/appConfig';
import ChatController from "./api/Chat/chat.controller";
var port = appConfig.get('port');
var smpt = appConfig.get('smpt');

if (!appConfig.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

Express.set('port', port);
const server = http.createServer(Express);

let io = socketIO(server);
io.on('connect', (socket: any) => {
    console.log('Connected client on port 3000');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
io.attach(server);
server.listen(process.env.PORT || port);
export default io;