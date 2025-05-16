<script>
  // Feedback Form Submission
  document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const feedbackText = document.getElementById('feedbackText').value.trim();
    const rating = document.getElementById('rating').value;

    if (!feedbackText) {
      alert('Please provide your feedback.');
      return;
    }

    // Optionally, you can send this data to a backend
    console.log('Feedback:', feedbackText, 'Rating:', rating);

    // Redirect to the Thank You page
    window.location.href = 'thank-you.html'; // Redirect to thank-you page
  });
</script>
