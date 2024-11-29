const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    const { name, email, message, phone } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use any SMTP service you prefer
        auth: {
            user: process.env.EMAIL_USER, // Store your email in environment variables
            pass: process.env.EMAIL_PASS, // Store your password in environment variables
        },
    });

    const mailOptions = {
        from: email,
        to: 'wrightwaycleanid@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending email' }),
        };
    }
};
