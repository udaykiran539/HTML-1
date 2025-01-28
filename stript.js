let Questions = [];
let currQuestion = 0;
let score = 0;

// DOM elements
const ques = document.getElementById("ques");
const opt = document.getElementById("opt");
const scoreDiv = document.getElementById("score");

// Fetch questions from API
async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    if (!response.ok) throw new Error("Failed to fetch questions.");
    const data = await response.json();
    Questions = data.results;
    loadQues();
  } catch (error) {
    ques.innerHTML = `<h5 style="color: red">${error.message}</h5>`;
  }
}

// Load current question
function loadQues() {
  if (Questions.length === 0) {
    ques.innerHTML = `<h5>Loading Questions...</h5>`;
    return;
  }

  const current = Questions[currQuestion];
  const correctAnswer = current.correct_answer;
  const incorrectAnswers = current.incorrect_answers;
  const options = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

  // Display question
  ques.innerText = current.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  opt.innerHTML = "";

  // Display options
  options.forEach((option) => {
    option = option.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    const div = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.type = "radio";
    input.name = "answer";
    input.value = option;
    label.textContent = option;

    div.appendChild(input);
    div.appendChild(label);
    opt.appendChild(div);
  });
}

// Check selected answer
function checkAns() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const selectedAns = selected.value;
  if (selectedAns === Questions[currQuestion].correct_answer) {
    score++;
  }

  nextQuestion();
}

// Load next question or display score
function nextQuestion() {
  if (currQuestion < Questions.length - 1) {
    currQuestion++;
    loadQues();
  } else {
    endQuiz();
  }
}

// Display final score
function endQuiz() {
  ques.remove();
  opt.remove();
  document.getElementById("btn").remove();

  scoreDiv.innerHTML = `<h3>You scored ${score} out of ${Questions.length}</h3>`;
  Questions.forEach((q, index) => {
    scoreDiv.innerHTML += `<p>${index + 1}. ${q.correct_answer}</p>`;
  });
}

// Initialize the quiz
fetchQuestions();