const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Use the correct SMTP settings for Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use port 465 for secure connections
    secure: true, // Secure connection (SSL)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"HRMS System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}, Message ID: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
