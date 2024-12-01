require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        // Parse incoming JSON body from the form submission
        const { name, email, phone, message } = JSON.parse(event.body);

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
            to: 'recipient@example.com',  // Replace with your email address
            subject: `Message from ${name}`,
            text: `Phone: ${phone}\n\nMessage: ${message}`,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully' }),
        };
        catch (error) {
            console.error('Error sending email:', error.message);
            console.error('Stack trace:', error.stack);  // Log the stack trace for deeper insight
        
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to send message', error: error.message }), // Include the error message in the response
            };
        }
};

