<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Capture form data
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $phone = htmlspecialchars($_POST['phone']); // If you want to capture phone number too
    $message = htmlspecialchars($_POST['message']);
    $recaptchaResponse = $_POST['g-recaptcha-response'];

    // Verify reCAPTCHA
    $secretKey = '6LfvJFIqAAAAAM3Yc8EiS9sYiEzFav4rzEk_ruaN'; // Use your secret key here
    $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$recaptchaResponse");
    $responseData = json_decode($verifyResponse);

    // Check if reCAPTCHA is valid and required fields are not empty
    if ($responseData->success && $name && $email && $message) {
        // Email details
        $to = "wrightwaycleanid@gmail.com"; // Your receiving email
        $subject = "New Contact Form Submission from $name";
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Prepare email body
        $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";

        // Send the email
        if (mail($to, $subject, $body, $headers)) {
            echo "success"; // Return success if mail is sent
        } else {
            echo "error"; // Return error if mail fails to send
        }
    } else {
        echo "error"; // Return error if reCAPTCHA or required fields are invalid
    }
}
?>


