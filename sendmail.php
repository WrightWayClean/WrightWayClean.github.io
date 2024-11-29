<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars($_POST['message']);
    $recaptchaResponse = $_POST['g-recaptcha-response'];

    // Verify reCAPTCHA
    $secretKey = '6LfvJFIqAAAAAM3Yc8EiS9sYiEzFav4rzEk_ruaN';
    $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$recaptchaResponse");
    $responseData = json_decode($verifyResponse);

    if ($responseData->success && $name && $email && $message) {
        $to = "wrightwaycleanid@gmail.com";
        $subject = "New Contact Form Submission";
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

        if (mail($to, $subject, $body, $headers)) {
            echo "success";
        } else {
            echo "error";
        }
    } else {
        echo "error";
    }
}
?>

