// ============================================================
// KONFIGURATION & BASEPFAD
// ============================================================

const basehref = location.hostname.includes("github.io")
  ? "/Lehrpfad-JSG/"
  : "/";

// ============================================================
// GLOBALER ZUSTAND
// ============================================================

let allQuiz = null;
let currentQuiz;
let currentQuestion = 0;
let currentQuizQuestions = [];
let quizMode = "leicht";
let answered = false;
let selectedAnswers = [];
let attemptedMultipleChoice = false;

let questionEl, answersEl, scoreEl, nextBtn, homeBtn;

// ============================================================
// INITIALISIERUNG
// ============================================================

function checkOnlyUnlock() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("loadOnlyQuizData") === "true") {
    window.location.href = basehref + "Homepage/index.html?from=quizunlock";
  }
}

checkOnlyUnlock();

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

function initQuiz() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
}

async function setup() {
  quizMode = await ensureQuizMode();
  questionEl = document.getElementById("question");
  answersEl = document.getElementById("answers");
  scoreEl = document.getElementById("score");
  nextBtn = document.getElementById("nextBtn");
  homeBtn = document.getElementById("homeBtn");

  nextBtn.addEventListener("click", onNextQuestion);
  homeBtn.addEventListener("click", onHome);

  getQuizID();
  renderQuestion();
}

// ============================================================
// NAVIGATION
// ============================================================

function onNextQuestion() {
  const questions = currentQuizQuestions;
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    quizEnde("normal");
  } else {
    renderQuestion();
  }
}

function onHome() {
  const target = homeBtn.getAttribute("data-home");
  if (!target || target === "#") return;
  localStorage.setItem(`quizDone_${currentQuiz}`, JSON.stringify(true));
  window.location.href = basehref + target;
}

// ============================================================
// QUIZ-ID & SCORE
// ============================================================

function getQuizID() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("quiztype");

  if (q && allQuiz[q]) {
    currentQuiz = q;
    localStorage.setItem(`quizUnlock_${currentQuiz}`, JSON.stringify(true));
    currentQuizQuestions = getModeQuestions(allQuiz[currentQuiz]);

    if (
      JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`) || "false") !==
      true
    ) {
      localStorage.setItem(`quizScore_${currentQuiz}`, "0");
    }

    // Wenn Quiz schon abgeschlossen, direkt zum Ende
    if (
      JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`) || "false") ===
      true
    ) {
      quizEnde("normal");
      return;
    }
  } else {
    currentQuiz = "null";
    currentQuizQuestions = [];
  }
}

function getScore() {
  return parseInt(localStorage.getItem(`quizScore_${currentQuiz}`) || "0", 10);
}

function getModeQuestions(quiz) {
  if (!quiz) {
    return [];
  }

  const modeKey = quizMode === "leicht" ? "leichtQuestions" : "schwerQuestions";
  if (Array.isArray(quiz[modeKey]) && quiz[modeKey].length > 0) {
    return quiz[modeKey].slice();
  }

  return [];
}

// ============================================================
// MODUS-AUSWAHL (Modal, kein prompt/confirm)
// ============================================================

function ensureQuizMode() {
  return new Promise((resolve) => {
    const stored = localStorage.getItem("quizMode");
    if (stored === "leicht" || stored === "schwer") {
      resolve(stored);
      return;
    }

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,.6);
      display:flex; align-items:center; justify-content:center; z-index:9999;
    `;

    overlay.innerHTML = `
      <div style="background:#fff; border-radius:12px; padding:2rem; text-align:center; max-width:320px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,.25);">
        <h2 style="margin:0 0 .5rem; font-size:1.3rem;">Quizmodus wählen</h2>
        <p style="margin:0 0 1.5rem; color:#555; font-size:.95rem;">Welchen Schwierigkeitsgrad möchtest du?</p>
        <div style="display:flex; gap:1rem; justify-content:center;">
          <button id="modeLeicht" style="flex:1; padding:.75rem; border-radius:8px; border:2px solid #4caf50; background:#4caf50; color:#fff; font-size:1rem; cursor:pointer; font-weight:600;">
            🟢 Leicht
          </button>
          <button id="modeSchwer" style="flex:1; padding:.75rem; border-radius:8px; border:2px solid #f44336; background:#f44336; color:#fff; font-size:1rem; cursor:pointer; font-weight:600;">
            🔴 Schwer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#modeLeicht").addEventListener("click", () => {
      localStorage.setItem("quizMode", "leicht");
      overlay.remove();
      resolve("leicht");
    });

    overlay.querySelector("#modeSchwer").addEventListener("click", () => {
      localStorage.setItem("quizMode", "schwer");
      overlay.remove();
      resolve("schwer");
    });
  });
}

function setScore(value) {
  localStorage.setItem(`quizScore_${currentQuiz}`, String(value));
  scoreEl.textContent = `Punkte: ${getScore()}`;
}

// ============================================================
// FRAGE RENDERN
// ============================================================

function renderQuestion() {
  selectedAnswers = [];
  attemptedMultipleChoice = false;

  const titleEl = document.getElementById("quizTitle");

  // Quiz existiert nicht
  if (!currentQuiz || !allQuiz[currentQuiz]) {
    titleEl.textContent = "Dieses Quiz existiert nicht";
    questionEl.textContent = "";
    answersEl.innerHTML = "";
    setUIState({ nextVisible: false, scoreVisible: false, homeVisible: false });
    return;
  }

  // Quiz bereits abgeschlossen
  if (JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`) || "false")) {
    titleEl.textContent = allQuiz[currentQuiz].name || "Unbekannt";
    questionEl.textContent = "Dieses Quiz hast du schon abgeschlossen.";
    answersEl.innerHTML = "";
    scoreEl.classList.remove("hidden");
    scoreEl.textContent = `Punkte: ${getScore()}`;
    setUIState({ nextVisible: false, scoreVisible: true, homeVisible: true });
    return;
  }

  const quiz = allQuiz[currentQuiz];
  const questions = currentQuizQuestions;

  // Alle Fragen beantwortet
  if (currentQuestion >= questions.length) {
    titleEl.textContent = "Quiz abgeschlossen";
    questionEl.textContent = "Du hast alle Fragen beantwortet.";
    answersEl.innerHTML = "";
    scoreEl.textContent = `Punkte: ${getScore()}`;
    setUIState({ nextVisible: false, scoreVisible: true, homeVisible: true });
    return;
  }

  const q = questions[currentQuestion];

  if (!q) {
    questionEl.textContent = "Frage nicht gefunden.";
    answersEl.innerHTML = "";
    return;
  }

  answered = false;
  titleEl.textContent = quiz.name || "Unbekannt";
  questionEl.innerHTML = q.question;

  setNextBtn({ enabled: false });
  setUIState({ nextVisible: true, scoreVisible: true, homeVisible: false });

  // BUGFIX: war quiz.questions.length (existiert nicht), jetzt currentQuizQuestions.length
  if (currentQuestion === currentQuizQuestions.length - 1) {
    nextBtn.textContent = "Quiz abschließen";
  }

  if (q.type === "multipleChoice") renderMultipleChoice(q);
  else if (q.type === "DragAndDrop") renderDragAndDrop(q);
  else if (q.type === "ordering") renderOrdering(q);
}

// Hilfsfunktionen für UI-Zustand
function setUIState({ nextVisible, scoreVisible, homeVisible }) {
  nextBtn.classList.toggle("hidden", !nextVisible);
  scoreEl.classList.toggle("hidden", !scoreVisible);
  if (homeBtn) homeBtn.classList.toggle("hidden", !homeVisible);
}

function setNextBtn({ enabled }) {
  nextBtn.disabled = !enabled;
  nextBtn.style.opacity = enabled ? "1" : "0.5";
  nextBtn.style.cursor = enabled ? "pointer" : "not-allowed";
}

// ============================================================
// MULTIPLE CHOICE
// ============================================================

function renderMultipleChoice(q) {
  selectedAnswers = [];
  attemptedMultipleChoice = false;
  answersEl.innerHTML = "";

  const container = document.createElement("div");
  container.className = "mc-container";

  const answerButtonsDiv = document.createElement("div");
  answerButtonsDiv.className = "mc-answers";

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn mc-option";
    btn.innerHTML = ans;
    btn.dataset.index = i;
    btn.addEventListener("click", () => onSelectMultipleChoice(i, btn));
    answerButtonsDiv.appendChild(btn);
  });

  const submitBtn = document.createElement("button");
  submitBtn.className = "answer-btn mc-submit";
  submitBtn.textContent = "Antworten abgeben";
  submitBtn.addEventListener("click", () => onSubmitMultipleChoice(q));

  container.appendChild(answerButtonsDiv);
  container.appendChild(submitBtn);
  answersEl.appendChild(container);
}

function onSelectMultipleChoice(index, btnElement) {
  const pos = selectedAnswers.indexOf(index);
  if (pos !== -1) {
    selectedAnswers.splice(pos, 1);
    btnElement.classList.remove("selected");
  } else {
    selectedAnswers.push(index);
    btnElement.classList.add("selected");
  }
}

function onSubmitMultipleChoice(q) {
  if (selectedAnswers.length === 0) {
    alert("Bitte wähle mindestens eine Antwort aus!");
    return;
  }

  const buttons = Array.from(document.querySelectorAll(".mc-option"));
  const submitBtn = document.querySelector(".mc-submit");
  const correctIndices = Array.isArray(q.correctIndex)
    ? q.correctIndex
    : [q.correctIndex];

  const isCorrect =
    selectedAnswers.length === correctIndices.length &&
    selectedAnswers.every((i) => correctIndices.includes(i));

  if (isCorrect) {
    buttons.forEach((b) => b.classList.add("correct"));

    setTimeout(() => {
      buttons.forEach((b, i) => {
        b.disabled = true;
        b.classList.remove("selected");
        b.classList.toggle("correct", correctIndices.includes(i));
      });

      if (!attemptedMultipleChoice) setScore(getScore() + 3);

      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";

      setNextBtn({ enabled: true });
      answered = true;
    }, 800);
  } else {
    attemptedMultipleChoice = true;
    buttons.forEach((b) => b.classList.add("wrong"));

    setTimeout(() => {
      buttons.forEach((b) => b.classList.remove("wrong", "selected"));
      selectedAnswers = [];
      submitBtn.focus();
    }, 800);
  }
}

// ============================================================
// DRAG & DROP
// ============================================================

function renderDragAndDrop(q) {
  answersEl.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "dragdrop-wrapper";

  const dragContainer = document.createElement("div");
  dragContainer.className = "drag-container";

  const dropContainer = document.createElement("div");
  dropContainer.className = "drop-container";

  shuffleArray([...q.items]).forEach((item) => {
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
      span.innerHTML = item.text;
      el.appendChild(span);
    }

    dragContainer.appendChild(el);
  });

  shuffleArray([...q.drops]).forEach((drop) => {
    const slot = document.createElement("div");
    slot.className = "drop-slot";
    slot.dataset.id = drop.label;

    const label = document.createElement("span");
    label.innerHTML = drop.label;
    slot.appendChild(label);

    dropContainer.appendChild(slot);
  });

  wrapper.appendChild(dragContainer);
  wrapper.appendChild(dropContainer);
  answersEl.appendChild(wrapper);

  initDragAndDrop(wrapper, dragContainer, dropContainer, q);
}

function initDragAndDrop(wrapper, dragContainer, dropContainer, q) {
  let draggedItem = null;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function moveAt(x, y) {
    draggedItem.style.left = x - offsetX + "px";
    draggedItem.style.top = y - offsetY + "px";
  }

  function resetItem(item) {
    item.style.cssText = "";
    dragContainer.appendChild(item);
  }

  function checkAllLocked() {
    const total = q.items.length;
    const locked = wrapper.querySelectorAll(".drag-item.locked").length;
    if (locked === total) setNextBtn({ enabled: true });
  }

  wrapper.querySelectorAll(".drag-item").forEach((item) => {
    item.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (item.classList.contains("locked")) return;

      isDragging = true;
      draggedItem = item;

      const rect = item.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      Object.assign(item.style, {
        width: rect.width + "px",
        height: rect.height + "px",
        position: "absolute",
        zIndex: "1000",
        pointerEvents: "none",
        transition: "none",
      });

      document.body.appendChild(item);
      moveAt(e.pageX, e.pageY);
    });
  });

  document.addEventListener("pointermove", (e) => {
    if (!isDragging || !draggedItem) return;
    moveAt(e.pageX, e.pageY);

    dropContainer
      .querySelectorAll(".drop-slot")
      .forEach((s) => s.classList.remove("hover"));
    const hovering = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".drop-slot");
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

    if (drop && item.dataset.correct === drop.dataset.id) {
      drop.classList.add("correct");
      item.classList.add("locked");
      Object.assign(item.style, {
        position: "static",
        pointerEvents: "none",
        width: "",
        height: "",
      });
      drop.appendChild(item);
      setScore(getScore() + 1);
    } else {
      if (drop) {
        drop.classList.add("wrong");
        setTimeout(() => drop.classList.remove("wrong"), 800);
      }
      resetItem(item);
    }

    checkAllLocked();
  });
}

// ============================================================
// ORDERING
// ============================================================

let attemptedOrdering = false;

function renderOrdering(q) {
  attemptedOrdering = false;
  answersEl.innerHTML = "";

  const container = document.createElement("div");
  container.className = "ordering-container";

  const list = document.createElement("ul");
  list.className = "ordering-list";

  q.items
    .map((item, index) => ({ item, index }))
    .sort(() => Math.random() - 0.5)
    .forEach(({ item, index }) => {
      const li = document.createElement("ul");
      li.className = "ordering-item";
      li.textContent = item;
      li.dataset.originalIndex = index;
      list.appendChild(li);
    });

  const submitBtn = document.createElement("button");
  submitBtn.className = "answer-btn ordering-submit";
  submitBtn.textContent = "Reihenfolge überprüfen";
  submitBtn.addEventListener("click", () => onSubmitOrdering(q, list));

  container.appendChild(list);
  container.appendChild(submitBtn);
  answersEl.appendChild(container);

  initOrderingDrag(list);
}

function initOrderingDrag(list) {
  let draggedItem = null;
  let placeholder = document.createElement("li");
  placeholder.className = "ordering-placeholder";

  let offsetY = 0;
  let activePointerId = null;

  function moveAt(y) {
    draggedItem.style.top = y - offsetY + "px";
  }

  list.querySelectorAll(".ordering-item").forEach((item) => {
    item.addEventListener("pointerdown", (e) => {
      e.preventDefault();

      draggedItem = item;
      activePointerId = e.pointerId;

      item.setPointerCapture(e.pointerId);

      const rect = item.getBoundingClientRect();
      offsetY = e.clientY - rect.top;
      placeholder.style.height = rect.height + "px";

      item.classList.add("dragging");

      Object.assign(item.style, {
        width: rect.width + "px",
        position: "absolute",
        zIndex: "1000",
        pointerEvents: "none",
      });

      list.insertBefore(placeholder, item.nextSibling);
      document.body.appendChild(item);

      moveAt(e.pageY);
    });
  });

  document.addEventListener("pointermove", (e) => {
    if (!draggedItem || e.pointerId !== activePointerId) return;
    e.preventDefault();
    moveAt(e.pageY);

    const items = Array.from(
      list.querySelectorAll(".ordering-item:not(.dragging)"),
    );

    let placed = false;
    for (let el of items) {
      const rect = el.getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        list.insertBefore(placeholder, el);
        placed = true;
        break;
      }
    }

    if (!placed) list.appendChild(placeholder);
  });

  document.addEventListener("pointerup", (e) => {
    if (!draggedItem || e.pointerId !== activePointerId) return;
    e.preventDefault();
    draggedItem.classList.remove("dragging");

    Object.assign(draggedItem.style, {
      position: "static",
      top: "",
      width: "",
      zIndex: "",
      pointerEvents: "",
    });

    list.insertBefore(draggedItem, placeholder);
    placeholder.remove();

    draggedItem = null;
    activePointerId = null;
  });
}

function onSubmitOrdering(q, list) {
  const items = list.querySelectorAll(".ordering-item");

  const userOrder = Array.from(items).map((item) =>
    parseInt(item.dataset.originalIndex),
  );

  const correctOrder = q.correctOrder
    ? q.correctOrder.map((correctItem) => q.items.indexOf(correctItem))
    : Array.from({ length: q.items.length }, (_, i) => i);

  const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

  if (isCorrect) {
    items.forEach((item) => item.classList.add("correct"));

    setTimeout(() => {
      items.forEach((item) => {
        item.classList.remove("correct");
        item.style.pointerEvents = "none";
      });

      if (!attemptedOrdering) {
        setScore(getScore() + 5);
      }

      setNextBtn({ enabled: true });
      answered = true;
    }, 800);
  } else {
    attemptedOrdering = true;

    items.forEach((item) => item.classList.add("wrong"));

    setTimeout(() => {
      items.forEach((item) => item.classList.remove("wrong"));
    }, 800);
  }
}

// ============================================================
// QUIZ ENDE
// ============================================================

function quizEnde(type) {
  answersEl.innerHTML = "";
  setNextBtn({ enabled: false });
  setUIState({ nextVisible: false, scoreVisible: true, homeVisible: true });
  localStorage.setItem(`quizDone_${currentQuiz}`, JSON.stringify(true));

  questionEl.textContent = `Du hast das Quiz beendet und ${getScore()} Punkte erreicht.`;
}

// ============================================================
// HILFSFUNKTIONEN
// ============================================================

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}