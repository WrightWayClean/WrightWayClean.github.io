const nodemailer = require('nodemailer');
const fetch = require('node-fetch'); // This is to verify the reCAPTCHA

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Only POST requests are allowed' }),
    };
  }

  const { name, email, phone, message, recaptchaResponse } = JSON.parse(event.body);

  // Validate the input
  if (!name || !email || !message || !recaptchaResponse) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields or reCAPTCHA response' }),
    };
  }

  // Verify the reCAPTCHA response
  const secretKey = process.env.6LfvJFIqAAAAAM3Yc8EiS9sYiEzFav4rzEk_ruaN; // Use an environment variable for security
  const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  try {
    const recaptchaVerificationResponse = await fetch(recaptchaVerificationUrl, {
      method: 'POST',
    });
    const recaptchaVerificationResult = await recaptchaVerificationResponse.json();

    if (!recaptchaVerificationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'reCAPTCHA verification failed' }),
      };
    }

    // Create a transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use any email service you'd like
      auth: {
        user: process.env.wrightwaycleanid@gmail.com, // Your email address from environment variables
        pass: process.env.WrightWayCleanID123, // Your email password or app password from environment variables
      },
    });

    // Set up email data
    const mailOptions = {
      from: email,
      to: 'wrightwaycleanid@gmail.com', // Your email address
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error occurred:', error); // Log error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email or reCAPTCHA verification failed', error }),
    };
  }
};
