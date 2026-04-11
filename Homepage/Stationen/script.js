let basehref = "";
if (location.hostname.includes("github.io")) {
  basehref = "/Lehrpfad-JSG/";
} else {
  basehref = "/";
}

let listQuiz = {};

fetch(basehref + "data/quizzes.json")
  .then((res) => {
    if (!res.ok) throw new Error("quizzes.json nicht gefunden");
    return res.json();
  })
  .then((data) => {
    listQuiz = data;
    init();
  })
  .catch((err) => {
    console.error("Fehler beim Laden der Quiz-Daten:", err);
  });

function init() {
  document.addEventListener("DOMContentLoaded", () => setup());
  if (document.readyState !== "loading") setup();
}

function setup() {
  unlockFromLink();
  resetButton();

  const quizBtns = document.querySelectorAll(`[id^="quizBtn_"]`);
  quizBtns.forEach((quizBtn) => {
    quizBtn.addEventListener("click", () => {
      resetScore(quizBtn.getAttribute("data-quiz"));
    });
  });
}

function resetScore(q) {
  localStorage.setItem(`quizScore_${q}`, "0");
  console.log(`Punkte für ${q} zurückgesetzt.`);
}

function resetQuizUnlock() {
  Object.values(listQuiz).forEach((quiz) => {
    localStorage.setItem(`quizUnlock_${quiz.id}`, JSON.stringify(false));
  });
}

function allQuizUnlock() {
  Object.values(listQuiz).forEach((quiz) => {
    localStorage.setItem(`quizUnlock_${quiz.id}`, JSON.stringify(true));
  });
}

function resetButton() {
  const resetB = document.getElementById("resetQuizzes");
  if (!resetB) return;
  resetB.addEventListener("click", () => {
    const confirmed = confirm("Willst du wirklich alle gespeicherten Daten löschen?");
    if (confirmed) {
      localStorage.clear();
      alert("Alle Daten wurden gelöscht!");
      window.location.reload();
    }
  });
}

function unlockFromLink() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("from") === "quizunlock") {
    allQuizUnlock();
    window.location.href = "index.html#stations";
  }
}