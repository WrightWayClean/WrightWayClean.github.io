require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        console.log('Raw body:', event.body);

        // Parse incoming JSON body
        const { name, email, phone, message, 'bot-field': botField } = JSON.parse(event.body);

        // ✅ Check honeypot field: if filled, assume it's spam
        if (botField) {
            console.warn('Spam detected: bot-field is filled.');
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Spam detected. Submission rejected.' }),
            };
        }

        console.log('Parsed form data:', { name, email, phone, message });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: email,
            to: 'EXAMPLE@YOUREMAILHERE.COM', // TODO: Replace with your email address
            subject: `Message from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}

                Message:
                ${message}
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error.message);
        console.error('Stack trace:', error.stack);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send message', error: error.message }),
        };
    }
};
