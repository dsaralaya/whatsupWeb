import Express from "./config/express";
import * as http from 'http';
import { appConfig } from './config/appConfig';
var port = appConfig.get('port');
var smpt = appConfig.get('smpt');

if (!appConfig.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

Express.set('port', port);
const server = http.createServer(Express);
server.listen(port);