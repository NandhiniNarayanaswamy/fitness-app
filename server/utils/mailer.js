const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = async function sendMail(to, subject, text) {
    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    });
};
