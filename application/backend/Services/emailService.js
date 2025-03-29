const nodemailer = require('nodemailer');

// Setup transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Gmail. Use your actual email service
    auth: {
        user: 'csc848verify@gmail.com', // Change to your email
        pass: 'tupw rbco igwg zxou',
    },
});

// Function to send OTP email
const sendOtpEmail = (firstName, toEmail, otp) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'csc848verify@gmail.com', // Your email address
            to: toEmail,
            subject: 'Welcome to EduBridge! Here\'s your OTP.',
            text: `Hello ${firstName}, and welcome to EduBridge! 🎓\n\nWe're thrilled to have you join our platform where you can delve into a myriad of topics related to your studies. Your access code is ${otp}.\n\nEnjoy your journey with us, and we wish you the best of luck in your educational endeavors!`,

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error); // Rejects the promise in case of an error
            } else {
                console.log('Email sent:', info.response);
                resolve(info); // Resolves the promise on successful email sending
            }
        });
    });
};

module.exports = {
    sendOtpEmail,
};


