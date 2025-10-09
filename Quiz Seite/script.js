// Einfaches Quiz-Skript

const questions = [
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

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

let current = 0;
let answered = false;

function getScore() {
  return parseInt(localStorage.getItem("quizScore") || "0", 10);
}

function setScore(v) {
  localStorage.setItem("quizScore", String(v));
  scoreEl.textContent = `Punkte: ${v}`;
}

function renderQuestion() {
  answered = false;
  nextBtn.disabled = true;
  const q = questions[current];
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
  const q = questions[current];
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
    // richtiger Antwort: +1 Punkt
    const newScore = getScore() + 1;
    setScore(newScore);
  }

  // Nächste Frage aktivieren
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  current += 1;
  if (current >= questions.length) {
    // Quiz Ende
    questionEl.textContent = "Quiz beendet. Gut gemacht!";
    answersEl.innerHTML = "";
    nextBtn.disabled = true;
    return;
  }
  renderQuestion();
});

// initialisierung
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
