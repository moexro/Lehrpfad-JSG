let basehref = "";
if (location.hostname.includes("github.io")) {
  basehref = "/Lehrpfad-JSG/"; // GitHub Pages Root
} else {
  basehref = "/";
}

function resetScore(q) {
  let points = 0;
  localStorage.setItem(`quizScore_${q}`, String(points));
  console.log(`Punkte für ${q} zurückgesetzt.`);
  console.log(localStorage.getItem(`quizScore_${q}`));
}

const quizBtns = document.querySelectorAll(`[id^="quizBtn_"]`);
if (quizBtns) {
  quizBtns.forEach((quizBtn) => {
    quizBtn.addEventListener("click", () => {
      resetScore(quizBtn.getAttribute("data-quiz"));
    });
  });
}

const scoreEl = document.createElement("div");
let totalPoints = 0;
let totalUnlocks = 0;

const quizData = localStorage.getItem("allQuizzes");
let listQuiz = {};
if (quizData) {
  listQuiz = JSON.parse(quizData);
  console.log(listQuiz);
}


function resetQuizUnlock() {
  Object.values(listQuiz).forEach((quiz) => {
    const quizKey = quiz.id;
    localStorage.setItem(`quizUnlock_${quizKey}`, JSON.stringify(false));
  });
}

function allQuizUnlock() {
  Object.values(listQuiz).forEach((quiz) => {
    const quizKey = quiz.id;
    localStorage.setItem(`quizUnlock_${quizKey}`, JSON.stringify(true));
  });
}

function resetButton() {
  const resetB = document.getElementById("resetQuizzes");
  resetB.addEventListener("click", () => {
    const confirmed = confirm(
      "Willst du wirklich alle gespeicherten Daten löschen?",
    );
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
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  unlockFromLink();
  resetButton();
});

