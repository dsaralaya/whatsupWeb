import { Request, Response } from 'express';
import io from '../../server';
import axios from 'axios';
import { appConfig } from '../../config/appConfig';
import ChatHistoryController from '../ChatHistory/chatHistory.controller';
import NodeCache from "node-cache";
var moment = require('moment');
import chatHistory from '../ChatHistory/chatHistory.model';
import ImageHistoryController from '../ImageHistory/imageHistory.controller';

import Menu from '../Menu/menu.model';
import User from '../../common/model/user.model';
const myCache = new NodeCache();
const URL = appConfig.get('siteURL');
export default class ChatController {

    public async receive(req: Request, res: Response) {
        console.log('message came');
        if (res.req.body.action == "receive") {
            if (myCache.get(res.req.body.message_id)) {
                console.log('duplicate request');
                return res.send({ message: 'duplictae request' });
            }
            console.log('cachet set');
            myCache.set(res.req.body.message_id, 'res.req.body.message_id', 2000);

            if (res.req.body.message === '*') {
                await this.savechatHistory(res.req.body.sender);
                this.checkmenu(res.req.body.message, "1", res.req.body.sender, res.req.body, true, io);
            } else {
            var isfirst = await this.savechatHistory(res.req.body.sender);
            //first message
            if (!isfirst) {
                // * message show notification
               
                    Menu.findOne({ menuId: "1" }).then((data: any) => {
                        if (data) {
                            var msg = data.text;
                            if (data.menuType.toLowerCase() == 'image') {

                                var file = data['file'].split(',');
                                file.forEach(element => {
                                    var reqq = { file: { filename: `${element}` }, body: { return: true, type: "image", message: msg, recipient: res.req.body.sender } }
                                    this.sendMessage(reqq, '');
                                });
                            } else {

                                var textreqq = { body: { return: true, type: "text", message: msg, sender: res.req.body.sender } }
                                this.sendMessage(textreqq, '');
                            }
                        }
                    });
                

            }
            //checking already assigned
            else if (!isfirst['assignedTo']) {
                this.checkmenu(res.req.body.message, isfirst['menuId'], res.req.body.sender, res.req.body, false, io);
            }
            //other emit message
            else {
                io.emit('message', res.req.body);
            }
          }
           
        } else {
            io.emit('message', res.req.body);
        }
    }

    private async checkmenu(option, menuId, sender, res, redirect, socket) {
        var menu = await Menu.findOne({ menuId: menuId });

        if ((menu && menu['endBotReply'] !== 'yes') || redirect) {
            if (menu[`option${option}`] || redirect) {
                var selected = menu[`option${option}`];
                //if option is support or sales
                if (redirect || selected.toLowerCase() === 'support' || selected.toLowerCase() === 'sales') {
                    //find the leat user value
                    var usr = await User.find({$or:[{ userRole: 'Support' } , { userRole: 'Sales' }],$and:[{ status: 'Active' }]})
                    .sort({ assignedChatCount: 1 }).collation({ locale: "en_US", numericOrdering: true }).limit(1)
                    //update the count
                    if (usr.length > 0) {
                        await User.findOneAndUpdate({ _id: usr[0]._id }, { $set: { assignedChatCount: usr[0]['assignedChatCount'] + 1 } });
                        await chatHistory.findOneAndUpdate({ senderId: sender }, { $set: { assignedTo: usr[0]._id } });
                        // res.message = 'HI';
                        socket.emit('switch', { user_id: usr[0]._id, msg: res });
                    }

                } else {
                    var menu = await Menu.findOne({ menuId: selected });
                    if (menu) {
                        var msg = menu['text'];
                        var currentTimeStamp = moment().unix();
                        console.log(menu['file']);
                        await chatHistory.findOneAndUpdate({ senderId: sender }, { $set: { menuId: selected, lastUpdated: currentTimeStamp } });
                        if (menu['menuType'].toLowerCase() == 'image') {
                            var file = menu['file'].split(',');
                             file.forEach(element => {
                                var reqq = { file: { filename: `menuImages/${element}` }, body: { return: true, type: "image", message: msg, recipient: sender } }
                                 this.sendMessage(reqq, '');
                            });
                           
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
                url: encodeURI(`https://app.interativachat.com.br/api/message/sendText?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&message=${request.message}&recipient=${request.sender}&type=text`),
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
            var path = request.return ? 'menuImages' : 'chatImages';
            if (req.file.filename !== "") {
                const imgdata = await axios({
                    url: `https://app.interativachat.com.br/api/message/sendImage`,
                    data: `client_id=${cred.client_id}&secret=${cred.secret}&legend=${request.message}&device_id=${cred.device_id}&recipient=${request.recipient}&type=image&file_url=${URL}/${path}/${req.file.filename}`,
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

                }).then((resp) => {
                    var data = resp.data.messages;
                    if (data.length > 0) {
                        data[0].path = `${URL}/${path}/${req.file.filename}`;
                    }
                    return data[0];

                })
                    .catch((error) => {
                        console.error(error);
                        return error;
                    });
                var img = new ImageHistoryController();
                await img.create({ message_id: imgdata.message_id, path: path + '/' + req.file.filename });
                if (request.return) {
                    return true;
                }
                return res.status(200).json(imgdata);
            }
        }
    }

    public async getAllMessages(req: Request, res: Response) {
        var cred = appConfig.get('intractiveAPI');
        var date = new Date().toISOString().split('T')[0];
        const response = await axios({
            url: `https://app.interativachat.com.br/api/messages?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&limit=10&sdr_rcv=${req.params.id}&page=0`,
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
            url: `https://app.interativachat.com.br/api/messages?client_id=${cred.client_id}&secret=${cred.secret}&device_id=${cred.device_id}&sdr_rcv=${req.body.sdr_rcv}&page=${req.body.page}&limit=10`,
            method: 'get'
        }).then((resp: any) => {
            return res.status(200).json(resp.data.messages);
        })
            .catch((error) => {
                console.error(error)
            });
    }

    public async transfer(req: Request, res: Response){
        var history = await chatHistory.findOne({ senderId: req.body.sender });
        await chatHistory.findByIdAndRemove(history._id);
        var user = await User.findOne({ _id: history['assignedTo'] })
        await User.findOneAndUpdate({ _id: user._id }, { $set: { assignedChatCount: user['assignedChatCount'] - 1 } });
        var usr = await User.find({  $and: [{ userRole: req.body.role },{ status: 'Active' }] })
            .sort({ assignedChatCount: 1 }).collation({ locale: "en_US", numericOrdering: true }).limit(1)
        //update the count
        if (usr.length > 0) {
            await User.findOneAndUpdate({ _id: usr[0]._id }, { $set: { assignedChatCount: usr[0]['assignedChatCount'] + 1 } });
            await chatHistory.findOneAndUpdate({ senderId: req.body.sender }, { $set: { assignedTo: usr[0]._id } });
            io.emit('switch', { user_id: usr[0]._id, msg: req.body.msg });
        }
        
        res.send({ status: "success", statusCode: "200" });
    }

}
