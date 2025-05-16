function handleLogin(event) {
    event.preventDefault(); // Stop the form from refreshing the page
  
    // Get email and password values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Simple simulation for testing
    if (email === "user@example.com" && password === "12345") {
      alert("Login successful! (Simulated)");
      window.location.href = "dashboard.html"; // Redirect to a placeholder page
    } else {
      alert("Invalid email or password. (Simulated)");
    }
  }
  