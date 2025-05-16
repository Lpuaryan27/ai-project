// Add an event listener to handle form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    // Get the values of the email and password fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Hardcoded credentials for testing
    const correctEmail = "sheryak543@gmail.com";
    const correctPassword = "12345";

    // Validate the credentials
    if (email === correctEmail && password === correctPassword) {
        alert('Login successful!');
        window.location.href = "assessment.html"; // Redirect to the assessment page
    } else {
        alert('Invalid email or password. Please try again.');
    }
});
