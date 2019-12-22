import { Request, Response } from 'express';
var fs = require('fs');


export default class UploadImagesController {

    public async upload(req: Request, res: Response) {
        return res.status(200).json(req.file.filename);
    }

    public async delete(req: Request, res: Response) {
        var path = req.body.imagePath;
        if(req.body.deleteFolder) {
            if( fs.existsSync(path) ) {
                fs.readdirSync(path).forEach(function(file,index){
                  var curPath = path + "/" + file;
                    fs.unlinkSync(curPath);
                });
                fs.rmdirSync(path);
                res.send({status:"success",message:"Delete Success"});
              }
        } else {
            fs.unlink(req.body.imagePath,function(err){
                if(err) return res.send({status:"failure",message:"Delete Failed"});
                res.send({status:"success",message:"Delete Success"});
           });
        } 
    }
}