fetch("https://api64.ipify.org?format=json")
.then(response => response.json())
.then(data => {
    let allowedIPs = ["160.2.132.79"]; // Add all approved IPs
    if (!allowedIPs.includes(data.ip)) {
        window.location.replace("/404.html"); // Redirect unauthorized users to the fake 404 page
    }
})
.catch(error => console.error("Error fetching IP:", error));
