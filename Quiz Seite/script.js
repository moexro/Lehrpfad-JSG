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

// Fragen zu den Maschinen

const questionsQ3 = [
  {
    question:
      "Ohne welche Maschine kann ein Bauer keine seiner Aufgaben erledigen?",
    answers: ["Pflug", "Traktor", "Rübenmaus", "Güllefass"],
    correctIndex: 1,
    type: "multipleChoice",
  },

  {
    question: "Feldbearbeitung: Halte & ziehe die Maschinen zu den richtigen Begriffen",
    type: "DragAndDrop",
    items: [
      {
        text: "Pflug",
        correctDrop: "Pflug",
        img: "images/MaschinenQuiz/Drehpflug.jpg",
      },
      {
        text: "Grubber",
        correctDrop: "Grubber",
        img: "images/MaschinenQuiz/Grubber.jpg",
      },
      {
        text: "Kreiselegge",
        correctDrop: "Kreiselegge",
        img: "images/MaschinenQuiz/Kreiselegge.jpg",
      },
      {
        text: "Walze",
        correctDrop: "Walze",
        img: "images/MaschinenQuiz/Walze.jpg",
      },
    ],
    drops: [
      { label: "Pflug" },
      { label: "Grubber" },
      { label: "Kreiselegge" },
      { label: "Walze" },
    ],
  },

  {
    question:
      "Ausbringen auf den Acker: Halte & ziehe die Maschinen zu den richtigen Begriffen",
    type: "DragAndDrop",
    items: [
      {
        text: "Miststreuer",
        correctDrop: "Miststreuer",
        img: "images/MaschinenQuiz/Miststreuer.jpg",
      },
      {
        text: "Güllefass",
        correctDrop: "Güllefass",
        img: "images/MaschinenQuiz/Guellefass.jpg",
      },
      {
        text: "Sämaschine",
        correctDrop: "Sämaschine",
        img: "images/MaschinenQuiz/Saemaschine.jpg",
      },
      {
        text: "Pflanzenschutzspritze",
        correctDrop: "Pflanzenschutzspritze",
        img: "images/MaschinenQuiz/Planzenschutzspritze.jpg",
      },
      {
        text: "Düngerstreuer",
        correctDrop: "Düngerstreuer",
        img: "images/MaschinenQuiz/Duengerstreuer.jpg",
      },
    ],
    drops: [
      { label: "Miststreuer" },
      { label: "Güllefass" },
      { label: "Sämaschine" },
      { label: "Pflanzenschutzspritze" },
      { label: "Düngerstreuer" },
    ],
  },

  {
    question:
      "Heu und Graß: Halte & ziehe die Maschinen zu den richtigen Begriffen",
    type: "DragAndDrop",
    items: [
      {
        text: "Frontmähwerk",
        correctDrop: "Frontmähwerk",
        img: "images/MaschinenQuiz/Maehwerk.jpg",
      },
      {
        text: "Heckmähwerk",
        correctDrop: "Heckmähwerk",
        img: "images/MaschinenQuiz/Heckmaehwerk.jpg",
      },
      {
        text: "Heuwender",
        correctDrop: "Heuwender",
        img: "images/MaschinenQuiz/Heuwender.jpg",
      },
      {
        text: "Schwader",
        correctDrop: "Schwader",
        img: "images/MaschinenQuiz/Schwader.jpg",
      },
      {
        text: "Ladewagen",
        correctDrop: "Ladewagen",
        img: "images/MaschinenQuiz/Ladewagen.jpg",
      },
      {
        text: "Ballenpresse",
        correctDrop: "Ballenpresse",
        img: "images/MaschinenQuiz/Ballenpresse.jpg",
      },
    ],
    drops: [
      { label: "Frontmähwerk" },
      { label: "Heckmähwerk" },
      { label: "Heuwender" },
      { label: "Schwader" },
      { label: "Ladewagen" },
      { label: "Ballenpresse" },
    ],
  },

  {
    question: "Ernte: Halte & ziehe die Maschinen zu den richtigen Begriffen",
    type: "DragAndDrop",
    items: [
      {
        text: "Feldhäcksler",
        correctDrop: "Feldhäcksler",
        img: "images/MaschinenQuiz/Feldhaecksler.jpg",
      },
      {
        text: "Mähdrescher",
        correctDrop: "Mähdrescher",
        img: "images/MaschinenQuiz/Maehdrescher.jpg",
      },
      {
        text: "Rübenroder",
        correctDrop: "Rübenroder",
        img: "images/MaschinenQuiz/Ruebenroder.jpg",
      },
      {
        text: "Rübenmaus",
        correctDrop: "Rübenmaus",
        img: "images/MaschinenQuiz/Ruebenmaus.jpg",
      },
    ],
    drops: [
      { label: "Feldhäcksler" },
      { label: "Mähdrescher" },
      { label: "Rübenroder" },
      { label: "Rübenmaus" },
    ],
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

  const wrapper = document.createElement("div");
  wrapper.className = "dragdrop-wrapper";

  // --- Quelle: Drag Items (oben) ---
  const dragContainer = document.createElement("div");
  dragContainer.className = "drag-container";

  const shuffledItems = shuffleArray([...q.items]);
  const shuffledDrops = shuffleArray([...q.drops]);

  shuffledItems.forEach((item) => {
    const el = document.createElement("div");
    el.className = "drag-item";
    el.dataset.correct = item.correctDrop;

    // 🔹 Wenn Bild vorhanden → nur Bild anzeigen
    if (item.img) {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.text || "";
      img.className = "drag-img";
      el.appendChild(img);
    } 
    // 🔹 Wenn kein Bild vorhanden → nur Text anzeigen
    else if (item.text) {
      const label = document.createElement("span");
      label.textContent = item.text;
      el.appendChild(label);
    }

    dragContainer.appendChild(el);
  });

  // --- Ziel: Drop-Zonen (unten) ---
  const dropContainer = document.createElement("div");
  dropContainer.className = "drop-container";

  shuffledDrops.forEach((drop) => {
    const slot = document.createElement("div");
    slot.className = "drop-slot";
    slot.dataset.id = drop.label;

    const label = document.createElement("span");
    label.textContent = drop.label;
    slot.appendChild(label);

    dropContainer.appendChild(slot);
  });

  wrapper.appendChild(dragContainer);
  wrapper.appendChild(dropContainer);
  answersEl.appendChild(wrapper);

  // --- SortableJS Setup ---
  new Sortable(dragContainer, {
    group: {
      name: "shared",
      pull: true,  // echtes Verschieben
      put: false,  // keine Items hinein
    },
    sort: false,
    animation: 150,
    forceFallback: true, // Touch-Unterstützung für Android/iOS
  fallbackTolerance: 5,   // Touchbewegung ab 5px startet Drag
  fallbackOnBody: true,   // stabileres Verhalten auf Android
  touchStartThreshold: 3,
  });

  dropContainer.querySelectorAll(".drop-slot").forEach((slot) => {
    new Sortable(slot, {
      group: "shared",
      animation: 150,
      onAdd: (evt) => {
        const item = evt.item;
        const correct = item.dataset.correct;
        const dropId = slot.dataset.id;

        // ✅ Richtige Zuordnung
        if (correct === dropId) {
          slot.classList.add("correct");
          item.classList.add("locked");
          item.draggable = false;
          item.style.pointerEvents = "none"; // fixiert
          item.style.opacity = "1";

          const newScore = getScore() + 1;
          setScore(newScore);
        } 
        // ❌ Falsche Zuordnung → zurück
        else {
          slot.classList.add("wrong");
          setTimeout(() => slot.classList.remove("wrong"), 800);
          setTimeout(() => dragContainer.appendChild(item), 300);
        }

        // Prüfen, ob alle Items korrekt platziert
        const totalItems = q.items.length;
        const lockedItems = document.querySelectorAll(".drag-item.locked").length;

        if (lockedItems === totalItems) {
          nextBtn.disabled = false;
          nextBtn.style.opacity = "1";
          nextBtn.style.cursor = "pointer";
        }
      },
    });
  });
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
      const newScore = getScore() + 3;
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

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      const target = homeBtn.getAttribute("data-home") || "#";
      if (target === "#") return; // Default-Placeholder; nichts tun
      localStorage.setItem(`quizDone_${currentQuiz}`, JSON.stringify(true));
      window.location.href = target;
    });
  }
}
