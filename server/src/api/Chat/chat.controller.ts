import { Request, Response } from 'express';
import io from '../../server';
import axios from 'axios';
import { appConfig } from '../../config/appConfig';
import ChatHistoryController from '../ChatHistory/chatHistory.controller';
import NodeCache from "node-cache";
import chatHistory from '../ChatHistory/chatHistory.model';
import ImageHistoryController from '../ImageHistory/imageHistory.controller';
const myCache = new NodeCache();
const URL = 'http://ca70954a.ngrok.io';
export default class ChatController {

    public async receive(req: Request, res: Response) {
        console.log('message came');
        if (res.req.body.action == "receive") {
            if (myCache.get(res.req.body.message_id)) {
                console.log('duplicate request');
                return res.send({ message: 'duplictae request' });
            }
            console.log('cachet set');
            myCache.set(res.req.body.message_id, 'res.req.body.message_id', 5000);
            var isfirst = await this.savechatHistory(res.req.body.sender);
            if (isfirst) {
                if (isfirst['menuId'] == "1" && !isfirst['assignedTo']) {
                    var reqq = { file: { filename: `${URL}/menu.jpg` }, body: { return: true, type: "image", message: "1", recipient: res.req.body.sender } }
                    await this.sendMessage(reqq, res);
                    console.log('sent image message');
                    var textreqq = { body: { return: true, type: "text", message: "1", sender: res.req.body.sender } }
                    await this.sendMessage(textreqq, res);
                    console.log('sent message');
                }
                else if (isfirst['assignedTo']) {
                    io.emit('message', res.req.body);
                }
                // } else {
                //     io.emit('message', res.req.body);
                //     console.log('message emit');
                // }
            }

            return res.status(200);
        } else {
            io.emit('message', res.req.body);
        }
    }

    private async savechatHistory(req) {
        var chat = new ChatHistoryController();
        return await chat.create(req)
    }


    public async sendMessage(req: Request, res: Response) {
        var request = req.body;
        var cred = appConfig.get('intractiveAPI');
        if (request.type == 'text') {
            await axios({
                url: `https://app.interativachat.com.br/api/message/sendText?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&message=${request.message}&recipient=${request.sender}&type=text`,
                method: 'get'
            }).then((resp) => {
                if (request.return) {
                    return true;
                }
                return res.status(200).json(resp.data.messages);
            })
                .catch((error) => {
                    console.error(error);
                    return error;
                });
        } else {
            await axios({
                url: `https://app.interativachat.com.br/api/message/sendImage`,
                data: `client_id=${cred.client_id}&secret=${cred.secret}&message=${request.message}&device_id=${cred.device_id}&recipient=${request.recipient}&type=image&file_url=${URL}/${req.file.filename}`,
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

            }).then((resp) => {
                var data = resp.data.messages;
                var img = new ImageHistoryController();
                img.create({ message_id: data.message_id, path: req.file.filename });

                if (data.length > 0) {
                    data[0].path = `${URL}/${req.file.filename}`;
                }
                if (request.return) {
                    return true;
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
