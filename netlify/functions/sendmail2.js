exports.handler = async (event, context) => {
    console.log('Function triggered successfully');
    
    try {
        // Log raw event.body
        console.log('Raw body:', event.body);

        // Parse and validate incoming data
        const data = JSON.parse(event.body);
        console.log('Parsed data:', data);

        const { name1, name2, email, phone, businessName, businessCity, message } = data;

        // Check for missing fields
        if (!name1 || !name2 || !email || !phone || !businessName || !businessCity || !message) {
            throw new Error('One or more required fields are missing or empty');
        }

        // Set up transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Define mail options
        const mailOptions = {
            from: email,
            to: 'wrightwaycleanid@gmail.com',
            subject: `Message from ${name1}`,
            text: `
                First name: ${name1}
                Last name: ${name2}
                Email: ${email}
                Phone: ${phone}
                Business name: ${businessName}
                Business location: ${businessCity}

                Message:
                ${message}
            `,
        };

        console.log('Sending email with mailOptions:', mailOptions);

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully' }),
        };
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Stack trace:', error.stack);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send message', error: error.message }),
        };
    }
};
