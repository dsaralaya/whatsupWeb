import convict from "convict";

export const appConfig = convict({
    PrivateKey: '122',
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
        url: 'mongodb://localhost/whatsapp'
    }
});
