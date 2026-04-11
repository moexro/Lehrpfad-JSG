// --- Basepfad ---
let basehref = "";
if (location.hostname.includes("github.io")) {
  basehref = "/Lehrpfad-JSG/";
} else {
  basehref = "/";
}

function onlyUnlock() {
  const parms = new URLSearchParams(window.location.search);
  const loadOnly = parms.get("loadOnlyQuizData");
  console.log(loadOnly);
  if (loadOnly == "true") {
    window.location.href =
      basehref + "Homepage/index.html?from=quizunlock";
    return;
  }
}

onlyUnlock();

// --- Globale Zustandsvariablen ---
let allQuiz = null;
let currentQuiz;
let currentQuestion = 0;
let answered = false;

let questionEl;
let answersEl;
let scoreEl;
let nextBtn;
let homeBtn;

// --- Quiz-Daten laden, dann initialisieren ---
fetch(basehref + "data/quizzes.json")
  .then((res) => {
    if (!res.ok) throw new Error("quizzes.json nicht gefunden");
    return res.json();
  })
  .then((data) => {
    allQuiz = data;
    initQuiz();
  })
  .catch((err) => {
    console.error("Fehler beim Laden der Quiz-Daten:", err);
    const title = document.getElementById("quizTitle");
    if (title) title.textContent = "Quiz konnte nicht geladen werden.";
  });

// --- DOM-Initialisierung (wird nach fetch aufgerufen) ---
function initQuiz() {
  document.addEventListener("DOMContentLoaded", () => setup());
  if (document.readyState !== "loading") setup();
}

function setup() {
  questionEl = document.getElementById("question");
  answersEl = document.getElementById("answers");
  scoreEl = document.getElementById("score");
  nextBtn = document.getElementById("nextBtn");
  homeBtn = document.getElementById("homeBtn");

  nextBtn.addEventListener("click", () => {
    const type = allQuiz[currentQuiz].questions[currentQuestion].type;
    const length = allQuiz[currentQuiz].questions.length;

    currentQuestion++;

    if (type === "locator" && currentQuestion >= length) {
      quizEnde("locator");
      return;
    }
    if (type !== "locator" && currentQuestion >= length) {
      quizEnde("normal");
      return;
    }
    renderQuestion();
  });

  homeBtn.addEventListener("click", () => {
    const target = homeBtn.getAttribute("data-home") || "#";
    if (target === "#") return;
    localStorage.setItem(`quizDone_${currentQuiz}`, JSON.stringify(true));
    window.location.href = basehref + target;
  });

  getQuizID();
  renderQuestion();
}

// --- Quiz initialisieren ---
function getQuizID() {
  const parms = new URLSearchParams(window.location.search);
  const q = parms.get("quiztype");

  if (q && allQuiz[q]) {
    currentQuiz = q;
    localStorage.setItem(`quizUnlock_${currentQuiz}`, JSON.stringify(true));
    localStorage.setItem(`quizVisited_${currentQuiz}`, JSON.stringify(true));
    if (JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`)) !== true) {
      localStorage.setItem(`quizScore_${currentQuiz}`, "0");
    }
  } else {
    currentQuiz = "null";
  }
}

function getScore() {
  return parseInt(localStorage.getItem(`quizScore_${currentQuiz}`) || "0", 10);
}

function setScore(v) {
  localStorage.setItem(`quizScore_${currentQuiz}`, String(v));
  scoreEl.textContent = `Punkte: ${getScore()}`;
}

function setCorrectLocation() {
  localStorage.setItem(`located_${currentQuiz}`, true);
}

// --- Frage rendern ---
function renderQuestion() {
  if (allQuiz[currentQuiz].questions.length <= currentQuestion) {
    document.getElementById("quizTitle").textContent = "Quiz abgeschlossen";
    questionEl.textContent = "Du hast alle Fragen beantwortet.";
    answersEl.innerHTML = "";
    nextBtn.classList.toggle("hidden");
    scoreEl.classList.remove("hidden");
    scoreEl.textContent = `Punkte: ${getScore()}`;
    if (homeBtn) homeBtn.classList.toggle("hidden");
    return;
  }
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
    return;
  }

  const quiz = allQuiz[currentQuiz];
  const q = quiz.questions[currentQuestion];

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

  if (q.type === "multipleChoice") {
    renderMultipleChoice(q);
  } else if (q.type === "DragAndDrop") {
    renderDragAndDrop(q);
  } else if (q.type === "locator") {
    renderLocator(q);
  }
}

// --- Multiple Choice ---
function renderMultipleChoice(q) {
  answersEl.innerHTML = "";
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = ans;
    btn.addEventListener("click", () => onAnswerMultipleChoice(i));
    answersEl.appendChild(btn);
  });
}

function onAnswerMultipleChoice(index) {
  if (answered) return;
  answered = true;

  const q = allQuiz[currentQuiz].questions[currentQuestion];
  const buttons = Array.from(document.querySelectorAll(".answer-btn"));
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.correctIndex) b.classList.add("correct");
    else if (i === index) b.classList.add("wrong");
  });

  if (index === q.correctIndex) {
    setScore(getScore() + 3);
  }

  nextBtn.disabled = false;
  nextBtn.style.opacity = "1";
  nextBtn.style.cursor = "pointer";
}

// --- Drag & Drop ---
function renderDragAndDrop(q) {
  answersEl.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "dragdrop-wrapper";

  const shuffledItems = shuffleArray([...q.items]);
  const shuffledDrops = shuffleArray([...q.drops]);

  const dragContainer = document.createElement("div");
  dragContainer.className = "drag-container";

  shuffledItems.forEach((item) => {
    const el = document.createElement("div");
    el.className = "drag-item";
    el.dataset.correct = item.correctDrop;

    if (item.img) {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.text || "";
      img.className = "drag-img";
      el.appendChild(img);
    } else if (item.text) {
      const span = document.createElement("span");
      span.textContent = item.text;
      el.appendChild(span);
    }

    dragContainer.appendChild(el);
  });

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

  let draggedItem = null;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  wrapper.querySelectorAll(".drag-item").forEach((item) => {
    item.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (item.classList.contains("locked")) return;

      isDragging = true;
      draggedItem = item;
      const rect = item.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      item.style.width = rect.width + "px";
      item.style.height = rect.height + "px";
      item.style.position = "absolute";
      item.style.zIndex = "1000";
      item.style.pointerEvents = "none";
      item.style.transition = "none";

      document.body.appendChild(item);
      moveAt(e.pageX, e.pageY);
    });
  });

  document.addEventListener("pointermove", (e) => {
    if (!isDragging || !draggedItem) return;
    moveAt(e.pageX, e.pageY);

    const hovering = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".drop-slot");
    dropContainer.querySelectorAll(".drop-slot").forEach((item) => {
      item.classList.remove("hover");
    });
    if (hovering) hovering.classList.add("hover");
  });

  document.addEventListener("pointerup", (e) => {
    if (!isDragging || !draggedItem) return;
    isDragging = false;
    const item = draggedItem;
    draggedItem = null;

    const drop = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".drop-slot");

    if (drop) {
      const correct = item.dataset.correct;
      const dropId = drop.dataset.id;

      if (correct === dropId) {
        drop.classList.add("correct");
        item.classList.add("locked");
        item.style.position = "static";
        item.style.pointerEvents = "none";
        item.style.width = "";
        item.style.height = "";
        drop.appendChild(item);
        setScore(getScore() + 1);
      } else {
        drop.classList.add("wrong");
        setTimeout(() => drop.classList.remove("wrong"), 800);
        resetItem(item);
      }
    } else {
      resetItem(item);
    }

    checkAllLocked();
  });

  function moveAt(x, y) {
    draggedItem.style.left = x - offsetX + "px";
    draggedItem.style.top = y - offsetY + "px";
  }

  function resetItem(item) {
    item.style.position = "static";
    item.style.zIndex = "";
    item.style.pointerEvents = "";
    item.style.width = "";
    item.style.height = "";
    item.style.transition = "";
    dragContainer.appendChild(item);
  }

  function checkAllLocked() {
    const totalItems = q.items.length;
    const lockedItems = wrapper.querySelectorAll(".drag-item.locked").length;
    if (lockedItems === totalItems) {
      nextBtn.disabled = false;
      nextBtn.style.opacity = "1";
      nextBtn.style.cursor = "pointer";
    }
  }
}

// --- Distanzberechnung ---
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// --- Locator Quiz ---
function renderLocator(q) {
  const targetlat = q.lat;
  const targetlon = q.lon;

  const mapsbtn = document.createElement("button");
  const checkbtn = document.createElement("button");

  mapsbtn.className = "answer-btn";
  mapsbtn.textContent = "Hier kommst du zum Google-Maps Link";
  answersEl.appendChild(mapsbtn);
  mapsbtn.addEventListener("click", () => {
    const mapsUrl = `https://www.google.com/maps?q=${targetlat},${targetlon}`;
    window.open(mapsUrl, "_blank");
  });

  checkbtn.className = "answer-btn";
  checkbtn.textContent =
    "Hier kannst du nachschauen, ob du an der richtigen Position gelandet bist.";
  answersEl.appendChild(checkbtn);
  checkbtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const target = { lat: targetlat, lon: targetlon };
        const radius = 10;

        console.log(`${lat} + ${lon}`);
        console.log(target);

        if (distance(lat, lon, target.lat, target.lon) <= radius) {
          alert("Du hast den richtigen Ort gefunden");
          setCorrectLocation();

          nextBtn.disabled = false;
          nextBtn.style.opacity = "1";
          nextBtn.style.cursor = "pointer";
        } else {
          alert("Das ist noch nicht der richtige Ort!");
        }
      },
      () => {
        alert("Standortzugriff verweigert oder nicht verfügbar");
      },
    );
  });
}

// --- Quiz Ende ---
function quizEnde(type) {
  answersEl.innerHTML = "";
  nextBtn.disabled = true;
  nextBtn.classList.toggle("hidden");
  scoreEl.classList.toggle("hidden");
  homeBtn.classList.toggle("hidden");
  if (type === "normal") {
    questionEl.textContent =
      "Du hast das Quiz beendet und " + getScore() + " Punkte erreicht.";
  } else if (type === "locator") {
    questionEl.textContent = "Du hast den gesuchten Ort gefunden. Gut gemacht!";
  }
}

// --- Hilfsfunktionen ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
