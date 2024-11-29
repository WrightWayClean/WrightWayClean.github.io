$(document).ready(function () {
    $("form").on("submit", function (e) {
        e.preventDefault(); // Prevent the form from submitting immediately
        
        console.log("Form submitted"); // Check if this logs when you click the submit button

        // Collect form data
        var name = $("input[name='name']").val();
        var email = $("input[name='email']").val();
        var message = $("textarea[name='message']").val();
        var recaptchaResponse = $("input[name='g-recaptcha-response']").val();  // Corrected here

        // Basic validation check
        if (name && email && message && recaptchaResponse) {
            // Send the form data via AJAX
            $.ajax({
                url: "sendmail.php",
                type: "POST",
                data: {
                    name: name,
                    email: email,
                    message: message,
                    "g-recaptcha-response": recaptchaResponse  // Send the response correctly
                },
                success: function (response) {
                    console.log("Form submission response:", response);
                    if (response === "success") {
                        alert("Thank you for your message!"); // Show success message
                        $("form")[0].reset(); // Clear the form on success
                    } else {
                        alert("Error sending message. Please try again later.");
                    }
                },
                error: function () {
                    console.log("Error in AJAX request");
                    alert("There was an issue with the submission.");
                }
            });
        } else {
            console.log("Validation failed.");
            alert("Please fill in all fields and complete the reCAPTCHA.");
        }
    });
});



