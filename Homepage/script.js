function resetScore() {
  localStorage.setItem("quizScore", "0");
}

const quizBtn = document.getElementById("quizBtn");
if (quizBtn) {
  quizBtn.addEventListener("click", () => {
    	resetScore();
  });
}