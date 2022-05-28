const nodeMailer = require('nodemailer');
const myMail = 'favian80@ethereal.email';
/**
 * 
 *  user: 'emile.greenholt63@ethereal.email',
        pass: 'RDQSHxZBDUpKZnNsqg'
*/
let mailConfig;
mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'favian80@ethereal.email',
        pass: 'FykexwYjyZD42wdQVT'
    }
};
module.exports = nodeMailer.createTransport(mailConfig);
