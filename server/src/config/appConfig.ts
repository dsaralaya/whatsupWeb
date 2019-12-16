import convict from "convict";

export const appConfig = convict({
    secretKey: '122',
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
        database: 'online_test',
        username: 'root',
        password: 'sa123',
        port: '3306'
    }
});
