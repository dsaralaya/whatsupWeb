import multer from "multer";
import path from "path";
var fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.body.menuId) {
            var dir = require('path').join(__dirname, '../uploads/menuImages');
        } else {
            var dir = require('path').join(__dirname, '../uploads/chatImages');
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir , {recursive: true});
        }
        cb(null, dir);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let uploadImage = multer({ storage: storage });
export default uploadImage;