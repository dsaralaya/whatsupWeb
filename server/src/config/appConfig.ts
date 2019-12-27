import convict from "convict";

export const appConfig = convict({
    siteURL: 'https://wa-chatbotapi.herokuapp.com', //'http://269806ec.ngrok.io',
    PrivateKey: '11',
    secretKey: '323',
    port: {
        doc: 'The port to bind.',
        default: 3000
    },
    smpt: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        userName: '',
        password: '',
        fromName: 'deepak',
        fromEmail: 'd@gmail.com'
    },
    db: {
        url: 'mongodb://51.79.74.14/whatsapp'
    },
    intractiveAPI: {
        client_id: 'cid5de59c223b075',
        secret: 'sec5de59c223b07a4.218354795de59c223b0965.28363623',
        device_id: '5dfcd5f3d2116'
    }

});
