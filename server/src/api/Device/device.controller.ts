import { Request, Response } from 'express';
import axios from 'axios';
import { appConfig } from '../../config/appConfig';

export default class DeviceController {

    public async status(req: Request, res: Response) {
    var cred = appConfig.get("intractiveAPI");
    const response = await axios({
        url: 'https://app.interativachat.com.br/api/device/get?client_id=' + `${cred['client_id']}` + '&secret='  + `${cred['secret']}` + '&device_id='  + `${cred['device_id']}`,
        method: "get"
    })
        .then((resp: any) => {
        return res.status(200).json(resp.data);
        })
        .catch(error => {
        console.error(error);
        });
    }
}
