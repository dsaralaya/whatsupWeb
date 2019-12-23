import { Request, Response } from 'express';
import io from '../../server';
import axios from 'axios';
import { appConfig } from '../../config/appConfig';
import ChatHistoryController from '../ChatHistory/chatHistory.controller';
import NodeCache from "node-cache";
import chatHistory from '../ChatHistory/chatHistory.model';
import ImageHistoryController from '../ImageHistory/imageHistory.controller';

import Menu from '../Menu/menu.model';
import User from '../../common/model/user.model';
const myCache = new NodeCache();
const URL = 'http://9916aaaa.ngrok.io';
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
            //first message
            if (!isfirst) {
                // * message show notification
                if (res.req.body.message === '*') {
                    this.checkmenu(res.req.body.message, isfirst['menuId'], res.req.body.sender, res.req.body);
                } else {
                    Menu.findOne({ menuId: "1" }).then((data: any) => {
                        if (data) {
                            var msg = data.text;
                            if (data.menuType.toLowerCase() == 'image') {

                                var reqq = { file: { filename: `menuImages/${data.file}` }, body: { return: true, type: "image", message: msg, recipient: res.req.body.sender } }
                                this.sendMessage(reqq, '');
                            } else {

                                var textreqq = { body: { return: true, type: "text", message: msg, sender: res.req.body.sender } }
                                this.sendMessage(textreqq, '');
                            }
                        }
                    });
                }

            }
            //checking already assigned
            else if (!isfirst['assignedTo']) {
                this.checkmenu(res.req.body.message, isfirst['menuId'], res.req.body.sender, res.req.body);
            }
            //other emit message
            else {
                io.emit('message', res.req.body);
            }
            return res.status(200);
        } else {
            io.emit('message', res.req.body);
        }
    }

    private async checkmenu(option, menuId, sender, res) {
        var menu = await Menu.findOne({ menuId: menuId });

        if (menu) {
            if (menu[`option${option}`]) {
                var selected = menu[`option${option}`];
                //if option is support or sales
                if (selected.toLowerCase() === 'support' || selected.toLowerCase() === 'sales') {
                    //find the leat user value
                    var usr = await User.find().or([{ userRole: 'support' } || { userRole: 'sales' }])
                        .sort("assignedChatCount")
                        .limit(1).exec();
                    //update the count
                    if (usr.length > 0) {
                        await User.findOneAndUpdate({ _id: usr[0]._id }, { $set: { assignedChatCount: usr[0]['assignedChatCount'] + 1 } }).then((doc) => {
                            console.log('user' + doc);
                        });
                        await chatHistory.findOneAndUpdate({ senderId: sender }, { $set: { assignedTo: usr[0]._id } }).then((doc) => {
                            console.log('history' + doc);
                        });
                        io.emit('message', res);
                    }

                } else {
                    var menu=await Menu.findOne({ menuId: selected });
                    if (menu) {
                        var msg = menu['text'];
                        console.log(menu['file'])
                        await chatHistory.findOneAndUpdate({ senderId: sender }, { $set: { menuId: selected } });
                        if (menu['menuType'].toLowerCase() == 'image') {
                            
                            var reqq = { file: { filename: `menuImages/${menu['file']}` }, body: { return: true, type: "image", message: msg, recipient: sender } }
                                await this.sendMessage(reqq, '');
                            } else {

                                var textreqq = { body: { return: true, type: "text", message: msg, sender: sender } }
                               await this.sendMessage(textreqq, '');
                            }
                           

                        }
                   
                }
            }
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
                data: `client_id=${cred.client_id}&secret=${cred.secret}&legend=${request.message}&device_id=${cred.device_id}&recipient=${request.recipient}&type=image&file_url=${URL}/${req.file.filename}`,
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
