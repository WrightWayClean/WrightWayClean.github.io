require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        console.log('Raw body:', event.body);

        // Parse the incoming JSON body
        const data = JSON.parse(event.body);

        let mailOptions;

        // Check which form is being submitted by checking the presence of certain fields
        if (data.address) {
            // Contact form
            const { name, email, phone, address } = data;

            mailOptions = {
                from: email,
                to: 'wrightwaycleanid@gmail.com',
                subject: `Contact Form Submission from ${name}`,
                text: `
                    Name: ${name}
                    Email: ${email}
                    Phone: ${phone}
                    Address: ${address}
                `,
            };
        } else if (data.businessName) {
            // Quote form
            const { firstName, lastName, email, phone, businessName, businessCity, message } = data;

            mailOptions = {
                from: email,
                to: 'wrightwaycleanid@gmail.com',
                subject: `Quote Request from ${firstName} ${lastName}`,
                text: `
                    First Name: ${firstName}
                    Last Name: ${lastName}
                    Email: ${email}
                    Phone: ${phone}
                    Business Name: ${businessName}
                    Business City: ${businessCity}

                    Message:
                    ${message}
                `,
            };
        } else {
            throw new Error('Unknown form submission.');
        }

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
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
