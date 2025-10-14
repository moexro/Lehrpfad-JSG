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

const quizData = localStorage.getItem("allQuizzes");
let listQuiz = {};
if (quizData) {
  listQuiz = JSON.parse(quizData);
  console.log(listQuiz);
}

function getQuizzes() {
  Object.values(listQuiz).forEach((quiz) => {
    const quizKey = quiz.id; // Annahme: Der Quiz-Schlüssel ist der Name des Quiz
    const unlocked = JSON.parse(
      localStorage.getItem(`quizUnlock_${quizKey}`) || false
    );
    console.log(unlocked);
    if (unlocked) {
      const qscore = localStorage.getItem(`quizScore_${quizKey}`) || 0;
      const quizName = quiz.name || quizKey;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "get_to-quiz-btn";
      btn.id = `quizBtn_${quizKey}`;
      btn.setAttribute("data-quiz", quizKey);
      btn.innerHTML = `${quizName}: <br>${qscore} Punkte`;
      btn.addEventListener("click", () => {
        // Verwende forward slashes und encodiere den Parameter
        const url = `../Quiz Seite/index.html?quiztype=${encodeURIComponent(
          quizKey
        )}`;
        // window.location.href = url;
      });
      document.getElementById("Quiz_button_container").appendChild(btn);
    }
  });
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
    localStorage.clear();
    window.location.reload();
  });
}
function unlockButton() {
  const unlockB = document.getElementById("unlockQuizzes");
	  unlockB.addEventListener("click", () => {
		allQuizUnlock();
    window.location.reload();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getQuizzes();
  resetButton();
  unlockButton();
});
