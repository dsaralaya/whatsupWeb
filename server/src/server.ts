import Express from "./config/express";
import * as http from 'http';
import socketIO from 'socket.io';
import { appConfig } from './config/appConfig';
var cron = require('node-cron');
var moment = require('moment');
import ChatHistoryController from "./api/ChatHistory/chatHistory.controller";
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

// Cron Tasks
cron.schedule('*/5 * * * *', () => {
    var older_than = moment().subtract(45, 'minutes').unix();
    var chatHistory = new ChatHistoryController();
    chatHistory.deleteMultipleRecords({ lastUpdated: { $lte: older_than } });
    //console.log('running a task every minute');
});
export default io;