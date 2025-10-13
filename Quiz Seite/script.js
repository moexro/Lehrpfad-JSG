const questionsQ1 = [
  {
    question: "Welche Pflanze wird in Deutschland am häufigsten angebaut?",
    answers: ["Weizen", "Mais", "Gerste", "Raps"],
    correctIndex: 0,
  },
  {
    question: "Was versteht man unter "Fruchtfolge"?",
    answers: ["Die Reihenfolge der Ernte innerhalb eines Tages", "Der Wechsel verschiedener Pflanzenarten auf einem Feld über mehrere Jahre", "Das Sortieren der Ernte nach Größe", "Die Reihenfolge der Düngung"],
    correctIndex: 1,
  },
  {
    question: "Welche Maschine wird hauptsächlich zur Bodenbearbeitung vor der Aussaat eingesetzt?",
    answers: ["Mähdrescher", "Pflug", "Ballenpresse", "Güllefass"],
    correctIndex: 1,
  },
];


const questionsQ2 = [
  {
    question: "Welche Nutztiere liefern sowohl Milch als auch Fleisch?",
    answers: ["Schafe", "Schweine", "Hühner", "Pferde"],
    correctIndex: 0,
  },
  {
    question: "Was ist ein wichtiger Vorteil des ökologischen Landbaus?",
    answers: ["Höhere Erträge", "Schnellere Erntezeiten", "Verzicht auf synthetische Pflanzenschutzmittel", "Niedrige Produktionskosten"],
    correctIndex: 2,
  },
  {
    question: "Wie nennt man die Haltung von Tieren auf dem gleichen Hof, auf dem auch ihre Futtermittel erzeugt werden?",
    answers: ["Intensivhaltung", "Kreislaufwirtschat", "Stallfütterung", "Selbstversorgungshaltung"],
    correctIndex: 1,
  },
];


let allQuiz = {
  Q1: {
    questions: questionsQ1,
    name: "Q1",
  },
  Q2: {
    questions: questionsQ2,
    name: "Q2",
  },
};

localStorage.setItem("allQuizzes", JSON.stringify(allQuiz));

let currentQuiz;

function getQuizID() {
  const parms = new URLSearchParams(window.location.search);
  const q = parms.get("quiztype");

  if (q && allQuiz[q]) {
    currentQuiz = q;
  } else {
    currentQuiz = "Q1"; // Fallback
  }
  
  console.log(`Aktuelles Quiz: ${currentQuiz}`);
  localStorage.setItem(`quizScore_${currentQuiz}`, 0);
}

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let currentQuestion = 0;
let answered = false;

function getScore() {
  return parseInt(localStorage.getItem(`quizScore_${currentQuiz}`) || "0", 10);
}

function setScore(v) {
  localStorage.setItem(`quizScore_${currentQuiz}`, String(v));
  console.log(`Punkte für ${currentQuiz} gesetzt auf ${v}.`);
  scoreEl.textContent = `Punkte: ${getScore()}`;
}



function renderQuestion() {
  answered = false;
  nextBtn.disabled = true;
  const q = allQuiz[currentQuiz].questions[currentQuestion];
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
  const q = allQuiz[currentQuiz].questions[currentQuestion];
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
  if (currentQuestion >= allQuiz[currentQuiz].questions.length) {
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
