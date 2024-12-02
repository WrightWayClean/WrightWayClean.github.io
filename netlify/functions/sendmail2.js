require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        // Log raw event.body to check the format of incoming data
        console.log('Raw body:', event.body);

        // Parse incoming JSON body from the form submission
        const { name1, name2, email, phone, textarea, textarea1, message } = JSON.parse(event.body);

        // Log parsed data for debugging
        console.log('Parsed form data:', { name1, name2, email, phone, textarea, textarea1, message });

        // Set up nodemailer transporter with Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Email from environment variable
                pass: process.env.EMAIL_PASS,  // App password from environment variable
            },
        });

        // Define mail options
        const mailOptions = {
            from: email,  // Sender’s email address
            to: 'wrightwaycleanid@gmail.com',  // Replace with your email address
            subject: `Message from ${name1}`,
            text: `
                First name: ${name1}
                Last name: ${name2}
                Email: ${email}
                Phone: ${phone}
                Business name: ${textarea}
                Business location: ${textarea1}

                Message:
                ${message}
            `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error.message);
        console.error('Stack trace:', error.stack);  // Log the stack trace for deeper insight

        // Return failure response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send message', error: error.message }),
        };
    }
};