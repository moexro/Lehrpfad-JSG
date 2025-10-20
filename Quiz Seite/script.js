const questionsQ1 = [
  {
    question: "Welche Pflanze wird in Deutschland am häufigsten angebaut?",
    answers: ["Weizen", "Mais", "Gerste", "Raps"],
    correctIndex: 0,
    type: "multipleChoice",
  },
  {
    question: "Was versteht man unter Fruchtfolge?",
    answers: [
      "Die Reihenfolge der Ernte innerhalb eines Tages",
      "Der Wechsel verschiedener Pflanzenarten auf einem Feld über mehrere Jahre",
      "Das Sortieren der Ernte nach Größe",
      "Die Reihenfolge der Düngung",
    ],
    correctIndex: 1,
    type: "multipleChoice",
  },
  {
    question:
      "Welche Maschine wird hauptsächlich zur Bodenbearbeitung vor der Aussaat eingesetzt?",
    answers: ["Mähdrescher", "Pflug", "Ballenpresse", "Güllefass"],
    correctIndex: 1,
    type: "multipleChoice",
  },
];

const questionsQ2 = [
  {
    question: "Welche Nutztiere liefern sowohl Milch als auch Fleisch?",
    answers: ["Schafe", "Schweine", "Hühner", "Pferde"],
    correctIndex: 0,
    type: "multipleChoice",
  },
  {
    question: "Was ist ein wichtiger Vorteil des ökologischen Landbaus?",
    answers: [
      "Höhere Erträge",
      "Schnellere Erntezeiten",
      "Verzicht auf synthetische Pflanzenschutzmittel",
      "Niedrige Produktionskosten",
    ],
    correctIndex: 2,
    type: "multipleChoice",
  },
  {
    question:
      "Wie nennt man die Haltung von Tieren auf dem gleichen Hof, auf dem auch ihre Futtermittel erzeugt werden?",
    answers: [
      "Intensivhaltung",
      "Kreislaufwirtschaft",
      "Stallfütterung",
      "Selbstversorgungshaltung",
    ],
    correctIndex: 1,
    type: "multipleChoice",
  },
];

const questionsQ3 = [
  {
    question: "Welche Maschine wird zum Ernten von Getreide eingesetzt?",
    answers: ["Mähdrescher", "Pflug", "Sämaschine", "Güllefass"],
    correctIndex: 0,
    type: "multipleChoice",
  },
  {
    question: "Ordne die Bilder den richtigen Begriffen zu:",
    type: "DragAndDrop",
    items: [
      { text: "Mähwerk", correctDrop: "Mähwerk" },
      { text: "Gerste", correctDrop: "Mähwerk" },
      { text: "Kuh", correctDrop: "Tier" },
      { text: "Traktor", correctDrop: "Maschine" },
    ],
    drops: [{ label: "Mähwerk" }, { label: "Tier" }, { label: "Maschine" }],
  },
  {
    question: "Wofür wird eine Ballenpresse verwendet?",
    answers: [
      "Zum Formen von Heu- oder Strohballen",
      "Zum Pflügen des Bodens",
      "Zum Düngen von Feldern",
      "Zum Säen von Getreide",
    ],
    correctIndex: 0,
    type: "multipleChoice",
  },
  {
    question: "Welche Maschine bringt Saatgut gleichmäßig auf dem Feld aus?",
    answers: ["Sämaschine", "Miststreuer", "Mähdrescher", "Schlepper"],
    correctIndex: 0,
    type: "multipleChoice",
  },
];

const questionsQ4 = [
  {
    question: "Was ist ein Ziel der nachhaltigen Landwirtschaft?",
    answers: [
      "Maximaler kurzfristiger Gewinn",
      "Erhaltung der Bodenfruchtbarkeit",
      "Einsatz möglichst vieler Chemikalien",
      "Monokulturen auf großen Flächen",
    ],
    correctIndex: 1,
    type: "multipleChoice",
  },
  {
    question: "Welche Methode hilft, den Boden zu schützen?",
    answers: [
      "Erosionsschutz durch Begrünung",
      "Tiefpflügen jedes Jahr",
      "Dauerhafte Brachlegung",
      "Intensive Düngung",
    ],
    correctIndex: 0,
    type: "multipleChoice",
  },
  {
    question: "Was bedeutet der Begriff 'Biodiversität'?",
    answers: [
      "Die Vielfalt von Tier- und Pflanzenarten",
      "Die Menge des angebauten Getreides",
      "Die Reinheit des Grundwassers",
      "Die Anzahl der Maschinen auf einem Hof",
    ],
    correctIndex: 0,
    type: "multipleChoice",
  },
];

const questionsQ5 = [
    {
      question: "Ordne die Bilder den richtigen Begriffen zu:",
      type: "DragAndDrop",
      items: [
        { text: "Weizen", correctDrop: "Getreide" },
        { text: "Gerste", correctDrop: "Getreide" },
        { text: "Kuh", correctDrop: "Tier" },
        { text: "Traktor", correctDrop: "Maschine" },
      ],
      drops: [{ label: "Getreide" }, { label: "Tier" }, { label: "Maschine" }],
    },
];



//Liste mit Namen und Fragen aller auf der Seite aufrufbaren Quizze

let allQuiz = {
  Q1: {
    questions: questionsQ1,
    name: "Über den Ackerbau",
    id: "Q1",
  },
  Q2: {
    questions: questionsQ2,
    name: "Über die Tierhaltung",
    id: "Q2",
  },
  Q3: {
    questions: questionsQ3,
    name: "Landwirtschaftliche Maschinen",
    id: "Q3",
  },
  Q4: {
    questions: questionsQ4,
    name: "Nachhaltige Landwirtschaft",
    id: "Q4",
  },
  Q5: {
    questions: questionsQ5,
    name: "Zuordnungsspiel",
    id: "Q5",
  },
};

localStorage.setItem("allQuizzes", JSON.stringify(allQuiz));

// --- Prüfen, ob nur Daten geladen werden sollen ---
const loadOnlyParm = new URLSearchParams(window.location.search);
const loadOnly = loadOnlyParm.get("loadOnlyQuizData") === "true";

if (loadOnly) {
  // nur Daten laden, Quiz nicht starten
  setTimeout(() => {
    window.location.href = "../Homepage/index.html?from=quizLoaded";
  }, 500);
} else {
  let currentQuiz;

  function getQuizID() {
    const parms = new URLSearchParams(window.location.search);
    const q = parms.get("quiztype");

    if (q && allQuiz[q]) {
      currentQuiz = q;
      localStorage.setItem(`quizUnlock_${currentQuiz}`, JSON.stringify(true));
      console.log(`Quiz ${currentQuiz} freigeschaltet.`);
      if (
        JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`)) !== true
      ) {
        localStorage.setItem(`quizScore_${currentQuiz}`, "0");
      }
    } else {
      currentQuiz = "null"; // Fallback
    }

    console.log(`Aktuelles Quiz: ${currentQuiz}`);
  }

  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const scoreEl = document.getElementById("score");
  const nextBtn = document.getElementById("nextBtn");
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.classList.toggle("hidden");

  let currentQuestion = 0;
  let answered = false;

  function getScore() {
    return parseInt(
      localStorage.getItem(`quizScore_${currentQuiz}`) || "0",
      10
    );
  }

  function setScore(v) {
    localStorage.setItem(`quizScore_${currentQuiz}`, String(v));
    console.log(`Punkte für ${currentQuiz} gesetzt auf ${v}.`);
    scoreEl.textContent = `Punkte: ${getScore()}`;
    console.log(getScore());
  }

  // --- Rendering ---
  function renderQuestion() {
    // Validierung: existierendes Quiz ?
    if (!currentQuiz || !allQuiz[currentQuiz]) {
      document.getElementById("quizTitle").textContent =
        "Dieses Quiz existiert nicht";
      questionEl.textContent = "";
      answersEl.innerHTML = "";
      nextBtn.classList.toggle("hidden");
      scoreEl.classList.toggle("hidden");
      if (homeBtn) homeBtn.classList.toggle("hidden");
      return;
    }

    // Wenn Quiz bereits als "done" markiert:
    if (
      JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`) || "false") ===
      true
    ) {
      document.getElementById("quizTitle").textContent =
        allQuiz[currentQuiz].name || "Unbekannt";
      questionEl.textContent = "Dieses Quiz hast du schon abgeschlossen.";
      answersEl.innerHTML = "";
      nextBtn.classList.toggle("hidden");
      scoreEl.classList.remove("hidden");
      scoreEl.textContent = `Punktzahl: ${getScore()}`;
      if (homeBtn) homeBtn.classList.toggle("hidden");
      return;
    }

    const quiz = allQuiz[currentQuiz];
    const q = quiz.questions[currentQuestion];
    const quizType = q.type;

    if (!q) {
      questionEl.textContent = "Frage nicht gefunden.";
      answersEl.innerHTML = "";
      return;
    }

    answered = false;

    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";

    nextBtn.classList.remove("hidden");
    scoreEl.classList.remove("hidden");
    if (homeBtn) homeBtn.classList.add("hidden");

    document.getElementById("quizTitle").textContent = quiz.name || "Unbekannt";
    questionEl.textContent = q.question;

    if (currentQuestion === allQuiz[currentQuiz].questions.length - 1) {
      nextBtn.innerHTML = "Quiz abschließen";
    }

    if (quizType === "multipleChoice") {
      renderMultipleChoice(q);
    } else {
      if (quizType === "DragAndDrop") {
        renderDragAndDrop(q);
      }
    }
  }

  function renderMultipleChoice(q) {
    // Normales Rendering einer Frage

    answersEl.innerHTML = "";

    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = ans;
      btn.addEventListener("click", () => onAnswerMultipleChoice(i));
      answersEl.appendChild(btn);
    });
  }

  function renderDragAndDrop(q) {
    answersEl.innerHTML = "";

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "dragdrop-wrapper";

    // --- Drag Items (oben) ---
    const dragContainer = document.createElement("div");
    dragContainer.className = "drag-container";

    q.items.forEach((item) => {
      const el = document.createElement("div");
      el.className = "drag-item";
      el.draggable = true;
      el.dataset.correct = item.correctDrop;

      // Falls ein Bild vorhanden ist, verwende es
      if (item.img) {
        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.text || "";
        el.appendChild(img);
      }

      // Optional: Text darunter
      if (item.text) {
        const label = document.createElement("span");
        label.textContent = item.text;
        el.appendChild(label);
      }

      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.correctDrop);
        el.classList.add("dragging");
      });
      el.addEventListener("dragend", () => el.classList.remove("dragging"));

      dragContainer.appendChild(el);
    });

    // --- Drop Targets (unten) ---
    const dropContainer = document.createElement("div");
    dropContainer.className = "drop-container";

    q.drops.forEach((drop) => {
      const slot = document.createElement("div");
      slot.className = "drop-slot";
      slot.dataset.id = drop.label;

      const label = document.createElement("span");
      label.textContent = drop.label;
      slot.appendChild(label);

      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        slot.classList.add("hover");
      });
      slot.addEventListener("dragleave", () => slot.classList.remove("hover"));
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("hover");

        const correctDrop = e.dataTransfer.getData("text/plain");
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        if (slot.dataset.id !== correctDrop) {
          slot.classList.add("wrong");
          setTimeout(() => slot.classList.remove("wrong"), 800);
          dragging.dataset.failed = "true";
        } else {
          slot.classList.add("correct");
          slot.appendChild(dragging);
          dragging.draggable = false;
          dragging.classList.add("locked");
          
          if (dragging.dataset.failed !== "false") {
      			const newScore = getScore() + 1;
      			setScore(newScore);
          }

          // Check, ob alle fertig sind
          const allSlots = document.querySelectorAll(".drop-slot");
          const done = Array.from(allSlots).every((s) =>
            s.querySelector(".drag-item.locked")
          );
          if (done) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = "1";
            nextBtn.style.cursor = "pointer";
            if (currentQuestion > allQuiz[currentQuiz].questions.length) {
              nextBtn.innerHTML = "Quiz abschließen";
            }
          }
        }
      });

      dropContainer.appendChild(slot);
    });

    wrapper.appendChild(dragContainer);
    wrapper.appendChild(dropContainer);
    answersEl.appendChild(wrapper);
  }

  function onAnswerMultipleChoice(index, btn) {
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
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }

  nextBtn.addEventListener("click", () => {
    currentQuestion += 1;
    quizEnde();
    renderQuestion();
  });

  function quizEnde() {
    if (currentQuestion >= allQuiz[currentQuiz].questions.length) {
      // Quiz Ende
      questionEl.textContent =
        "Quiz beendet. Gut gemacht! Du hast " +
        getScore() +
        " Punkte erreicht.";
      answersEl.innerHTML = "";
      nextBtn.disabled = true;
      nextBtn.classList.toggle("hidden");
      scoreEl.classList.toggle("hidden");
      homeBtn.classList.toggle("hidden");
      return;
    }
  }

  // initialisierung
  getQuizID();
  renderQuestion();

  // Home button: öffnet die in data-home angegebene URL in neuem Tab

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      const target = homeBtn.getAttribute("data-home") || "#";
      if (target === "#") return; // Default-Placeholder; nichts tun
      localStorage.setItem(`quizDone_${currentQuiz}`, JSON.stringify(true));
      window.location.href = target;
    });
  }
}
