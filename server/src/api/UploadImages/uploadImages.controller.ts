import { Request, Response } from 'express';
var fs = require('fs');


export default class UploadImagesController {

    public async upload(req: Request, res: Response) {
        return res.status(200).json(req.file.filename);
    }

    public async delete(req: Request) {
        var path = require('path').join(__dirname, '../../uploads/menuImages/'+ req);
        if(req.body) {
            if( fs.existsSync(path) ) {
                fs.readdirSync(path).forEach(function(file,index){
                  var curPath = path + "/" + file;
                    fs.unlinkSync(curPath);
                });
                fs.rmdirSync(path);
              }
        } else {
            var fileNames = req.split(',');
            fileNames.forEach(element => {
                path = require('path').join(__dirname, '../../uploads/menuImages/'+ element);
                fs.unlink(path,function(err){
                    if(err) return err;
              }); 
            });
        } 
    }
}