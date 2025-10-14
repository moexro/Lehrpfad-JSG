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
let listQuiz ={};
if (quizData) {
  listQuiz = JSON.parse(quizData);
  console.log(listQuiz);
}

function getQuizzes() {
  Object.values(listQuiz).forEach((quiz) => {
    const quizKey = quiz.name; // Annahme: Der Quiz-Schlüssel ist der Name des Quiz
		const unlocked = JSON.parse(localStorage.getItem(`quizUnlock_${quizKey}`) || false;
		if(unlocked) {
		const qscore = localStorage.getItem(`quizScore_${quizKey}`) || 0;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "get_to-quiz-btn";
    btn.id = `quizBtn_${quizKey}`;
    btn.setAttribute("data-quiz", quizKey);
    btn.textContent = `Start ${quizKey} Punkte: ${qscore}`;
    btn.addEventListener("click", () => {
      // Verwende forward slashes und encodiere den Parameter
      const url = `../Quiz Seite/index.html?quiztype=${encodeURIComponent(
        quizKey
      )}`;
      window.location.href = url;
    });
    document.getElementById("Quiz_button_container").appendChild(btn);
  });
  }
}

function resetQuizUnlock() {
  		Object.values(listQuiz).forEach((quiz) => {
      const quizKey = quiz.name;
      localStorage.setItem(`quizUnlock_${quizKey}`, JSON.stringify(false));
      });
    }
    
function resetButton() {
  const resetB = document.getElementById("resetQuizzes");
  resetB.addEventListener("click", () => {
      // Verwende forward slashes und encodiere den Parameter
      resetQuizUnlock();
    });
	}

document.addEventListener("DOMContentLoaded", () => {
  getQuizzes();
  resetButton();
});