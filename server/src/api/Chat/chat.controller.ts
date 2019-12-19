import { Request, Response } from 'express';
import io from '../../server';
import axios from 'axios';
import { appConfig } from '../../config/appConfig';
import ChatHistoryController from '../ChatHistory/chatHistory.controller';


export default class ChatController {

    public  receive(req: Request, res: Response) {
        console.log('message came');
        if (res.req.body.action == "receive"){
            var isexist = this.savechatHistory(res.req.body.sender);
            if (!isexist){
                var reqq = { message: "1", sender: res.req.body.sender}
                 this.sendMessage(reqq, res);
            } else {
                io.emit('message', res.req.body);
            }
        } else {
            io.emit('message', res.req.body);
        }
       
       
        return res.send({ message: 'message came' });
    }

    private   savechatHistory(req){
        var chat = new ChatHistoryController();
        return  chat.create(req)
    }


    public async sendMessage(req: Request, res: Response) {
        var request = req.body;
        var cred = appConfig.get('intractiveAPI');
        if (request.type == 'text') {
            await axios({
                url: `https://app.interativachat.com.br/api/message/sendText?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&message=${request.message}&recipient=${request.sender}&type=text`,
                method: 'get'
            }).then((resp) => {
                return res.status(200).json(resp.data.messages);
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
        } else {
            await axios({
                url: `https://app.interativachat.com.br/api/message/sendImage`,
                data: `client_id=${cred.client_id}&secret=${cred.secret}&message=${request.message}&device_id=${cred.device_id}&recipient=${request.recipient}&type=image&file_url=http://f410fa69.ngrok.io/${req.file.filename}`,
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

            }).then((resp) => {
                var data=resp.data.messages;
                if(data.length>0){
                    data[0].path = `http://f410fa69.ngrok.io/${req.file.filename}`;
                }
                return res.status(200).json(data);
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
        }
    }

    public async getAllMessages(req: Request, res: Response) {
        var cred = appConfig.get('intractiveAPI');
        var date = new Date().toISOString().split('T')[0];
        const response = await axios({
            url: `https://app.interativachat.com.br/api/messages?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}`,
            method: 'get'
        }).then((resp: any) => {
            return res.status(200).json(resp.data.messages);
        })
        .catch((error) => {
            console.error(error)
        });

    }
public async loadMore(req: Request, res: Response) {
    var cred = appConfig.get('intractiveAPI');
    var date = new Date().toISOString().split('T')[0];
    const response = await axios({
        url: `https://app.interativachat.com.br/api/messages?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&sdr_rcv=${req.body.sdr_rcv}&page=${req.body.page}`,
        method: 'get'
    }).then((resp: any) => {
        return res.status(200).json(resp.data.messages);
    })
        .catch((error) => {
            console.error(error)
        });
}

}
