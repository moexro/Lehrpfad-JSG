const questionsQ1 = [
  {
    question: "Was ist die Hauptstadt von Deutschland?",
    answers: ["Berlin", "München", "Hamburg", "Köln"],
    correctIndex: 0,
  },
  {
    question: "Welche Programmiersprache läuft im Browser?",
    answers: ["Python", "C#", "JavaScript", "Java"],
    correctIndex: 2,
  },
  {
    question: "2 + 2 = ?",
    answers: ["3", "4", "22", "5"],
    correctIndex: 1,
  },
];

let nameQ1 = "Q1";
let pointsQ1 = 0;

const questionsQ2 = [
  {
    question: "Was ist die Hauptstadt von Deutschland?",
    answers: ["Bayern", "München", "Hamburg", "Köln"],
    correctIndex: 0,
  },
  {
    question: "Welche Programmiersprache läuft im Browser?",
    answers: ["Python", "C#", "JavaScript", "Java"],
    correctIndex: 2,
  },
  {
    question: "2 + 2 = ?",
    answers: ["3", "4", "22", "5"],
    correctIndex: 1,
  },
];

let nameQ2 = "Q2";
let pointsQ2 = 0;

const allQuiz = {
  Q1: {
    questions: questionsQ1,
    points: pointsQ1,
    name: nameQ1,
  },
  Q2: {
    questions: questionsQ2,
    points: pointsQ2,
    name: nameQ2,
  },
};

localStorage.setItem("allQuizzes", JSON.stringify(allQuiz));

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let currentQuestion = 0;
let currentQuiz;
let answered = false;

function getScore() {
  const q = allQuiz[${currentQuiz}].points;
  return parseInt(localStorage.getItem(`quizScore_${q}`) || "0", 10);
}

function setScore(v) {
  const q = allQuiz[${currentQuiz}].points;
  console.log(q);
  localStorage.setItem(`quizScore_${q}`, String(v));
  console.log(`Punkte für ${q} gesetzt auf ${v}.`);
  scoreEl.textContent = `Punkte: ${getScore()}`;
}

function getQuizID() {
  const parms = new URLSearchParams(window.location.search);
  const q = parms.get("quiztype");

  if (q && allQuiz[q]) {
    currentQuiz = q;
  }
  console.log(`Aktuelles Quiz: ${currentQuiz}`);
  
  const qs = allQuiz[${currentQuiz}].points;
  qs = 0;
  consolre.log(${qs})
}

function renderQuestion() {
  answered = false;
  nextBtn.disabled = true;
  const q = allQuiz[${currentQuiz].questions[currentQuestion];
  questionEl.textContent = `${q.question}`;
  answersEl.innerHTML = "";
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = ans;
    btn.addEventListener("click", () => onAnswer(i, btn));
    answersEl.appendChild(btn);
  });
}

function onAnswer(index, btn) {
  if (answered) return;
  answered = true;
  const q = allQuiz[${currentQuiz].questions[currentQuestion];
  const buttons = Array.from(document.querySelectorAll(".answer-btn"));
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.correctIndex) {
      b.classList.add("correct");
    } else if (i === index) {
      b.classList.add("wrong");
    }
  });

  if (index === q.correctIndex) {
    const newScore = getScore() + 1;
    setScore(newScore);
  }

  // Nächste Frage aktivieren
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  currentQuestion += 1;
  if (currentQuestion >= allQuiz[${currentQuiz].questions.length) {
    // Quiz Ende
    questionEl.textContent = "Quiz beendet. Gut gemacht!";
    answersEl.innerHTML = "";
    nextBtn.disabled = true;
    return;
  }
  renderQuestion();
});

// initialisierung
getQuizID();

setScore(getScore());
renderQuestion();

// Home button: öffnet die in data-home angegebene URL in neuem Tab
const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    const target = homeBtn.getAttribute("data-home") || "#";
    if (target === "#") return; // Default-Placeholder; nichts tun
    window.location.href = target;
  });
}
