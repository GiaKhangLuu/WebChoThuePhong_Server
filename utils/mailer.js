const nodeMailer = require("nodemailer");
require("dotenv");
const TemplateEmail = require("../models/template.model");

const adminMail = process.env.ADMIN_MAIL;
const adminPass = process.env.ADMIN_PASSWORD;
const mailHost = process.env.EMAIL_HOST;
const mailPort = process.env.EMAIL_PORT;

const sendMail = async (to, subject, htmlContent) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false,
        auth: {
            user: adminMail,
            pass: adminPass
        }
    })
    var key = htmlContent
    const templateEmail = await TemplateEmail.findOne({ "key": key });

    const options = {
        from: adminMail,
        to: to,
        subject: subject,
        html: templateEmail.htmlContent
    }
    return transporter.sendMail(options)

}
module.exports = {
    sendMail: sendMail
}
