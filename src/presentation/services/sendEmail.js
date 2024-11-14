
const nodemailer  = require('nodemailer');

 class EmailService {

    constructor() {
    }

    transporter = nodemailer.createTransport({
        service: process.env.MAILER_SERVICE,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_SECRET_KEY
        }
    });

    async sendEmail(options) {

        console.log("Service: " + process.env.MAILER_SERVICE);
        console.log("Service: " + process.env.MAILER_EMAIL);
        console.log("Service: " + process.env.MAILER_SECRET_KEY);
        const { to, subject, text, from } = options;

        console.log("Por aqui");
        try {
            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                text: text,
                from:  from
            });


            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

module.exports = EmailService;