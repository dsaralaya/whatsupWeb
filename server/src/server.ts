import Express from "./config/express";
import * as http from 'http';
import * as config from './config/appConfig';

var port = config.appConfig.get('port');
var smpt = config.appConfig.get('smpt');
Express.set('port', port);
const server = http.createServer(Express);
server.listen(port);