const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Only POST requests are allowed' }),
    };
  }

  const { name, email, phone, message } = JSON.parse(event.body);

  // Validate the input
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields' }),
    };
  }

  // Create a transporter for nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use any email service you'd like
    auth: {
      user: process.env.wrightwaycleanid, // Replace with your email address
      pass: process.env.WrightWayCleanID123, // Replace with your email password or app password
    },
  });

  // Set up email data
  const mailOptions = {
    from: email,
    to: 'wrightwaycleanid@gmail.com', // Your email address
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error }),
    };
  }
};
