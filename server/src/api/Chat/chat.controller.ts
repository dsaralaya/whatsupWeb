import { Request, Response } from 'express';
import EventEmitter = require('events');
import io from '../../server';
import axios from 'axios';
import { appConfig } from '../../config/appConfig';
const eventEmitter = new EventEmitter();
export default class ChatController {
    
    public async receive(req: Request, res: Response) {
        console.log('message came');
        eventEmitter.emit('recieve',res.req.body);
        io.emit('message', res.req.body);
        return res.send({ message: 'message came' });
    }

    public async sendMessage(req: Request, res: Response) {
        var request = req.body;
        var cred = appConfig.get('intractiveAPI');
       await axios({
            url: `https://app.interativachat.com.br/api/message/sendText?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&message=${request.message}&recipient=${request.sender}&type=text`,
            method: 'get'
        }).then((resp) => {
            return res.status(200).json(resp.data.messages);
        })
        .catch((error) => {
            console.error(error);
            return error;
        })

    }

    public async getAllMessages(req: Request, res: Response) {
      
        var cred = appConfig.get('intractiveAPI');
        var date = new Date().toISOString().split('T')[0];
        const response = await axios({
            url: `https://app.interativachat.com.br/api/messages?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&start=${date} 00:00:00`,
            method: 'get'
        }).then((resp:any) => {
            return res.status(200).json(resp.data.messages);
        })
            .catch((error) => {
                console.error(error)
            })

    }
}