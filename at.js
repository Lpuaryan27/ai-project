const questionText = document.getElementById('question-text');
const userResponse = document.getElementById('user-response');
const submitButton = document.getElementById('submit-response');
const feedbackArea = document.getElementById('feedback-area');
const feedbackText = document.getElementById('feedback-text');
const startButton = document.getElementById('start-interview');
const questionArea = document.getElementById('question-area');

let questions = []; // Array to hold interview questions
let currentQuestionIndex = -1;

async function fetchQuestions() {
    // Replace with your backend endpoint to fetch questions
    const response = await fetch('/api/questions'); // Example backend endpoint
    questions = await response.json();
}

function displayQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        questionText.textContent = questions[currentQuestionIndex].question;
        userResponse.value = "";
        feedbackArea.classList.add('hidden');
    } else {
        questionText.textContent = "Interview complete!";
        userResponse.disabled = true;
        submitButton.disabled = true;
        startButton.disabled = true;
    }
}

async function submitAnswer() {
    const answer = userResponse.value;
    const currentQuestion = questions[currentQuestionIndex];

    // Replace with your backend endpoint to send answer and get feedback
    const response = await fetch('/api/feedback', { // Example backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: currentQuestion.question,
            answer: answer,
        }),
    });
    const feedback = await response.json();

    feedbackText.textContent = feedback.feedback;
    feedbackArea.classList.remove('hidden');
    displayQuestion();
}

startButton.addEventListener('click', async () => {
    await fetchQuestions();
    startButton.classList.add('hidden');
    displayQuestion();
});

submitButton.addEventListener('click', submitAnswer);

userResponse.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitAnswer();
        event.preventDefault();
    }
});