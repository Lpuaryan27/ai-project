// Script to handle the assessment and recommendations

document.getElementById("problem-solving").addEventListener("input", (event) => {
    // Update the displayed value for the problem-solving range
    document.getElementById("problem-solving-value").textContent = event.target.value;
  });
  
  document.getElementById("submitBtn").addEventListener("click", () => {
    // Fetch values from the form
    const workEnvironment = document.getElementById("work-environment").value;
    const problemSolving = document.getElementById("problem-solving").value;
    const dreamJob = document.getElementById("dream-job").value;
  
    // Validate form fields
    if (!workEnvironment || !dreamJob) {
      alert("Please fill out all required fields.");
      return;
    }
  
    // Simulated AI Recommendations
    const recommendations = [
      { career: "Software Developer", confidence: 85 },
      { career: "Data Scientist", confidence: 75 },
      { career: "UI/UX Designer", confidence: 70 }
    ];
  
    // Hide assessment form and show recommendations
    document.getElementById("assessment").classList.add("hidden");
    document.getElementById("recommendations").classList.remove("hidden");
  
    // Display recommendations
    const recommendationsList = document.getElementById("recommendationsList");
    recommendationsList.innerHTML = ""; // Clear previous recommendations
    recommendations.forEach((rec) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${rec.career} (Confidence: ${rec.confidence}%)`;
      recommendationsList.appendChild(listItem);
    });
  });
  function handleForgotPassword(event) {
    event.preventDefault(); // Prevent form submission

    // Get email from form
    const email = document.getElementById('reset-email').value.trim();

    // Validate email
    if (!email.includes('@')) {
        alert("Please enter a valid email address!");
        return;
    }

    // Simulate sending reset link
    console.log("Password reset link sent to:", email);
    alert("A password reset link has been sent to your email.");
}
