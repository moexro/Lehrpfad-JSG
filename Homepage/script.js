function resetScore() {
	v = 0;
  localStorage.setItem("quizScore", String(v));
}

const quizBtn = document.getElementById("quizBtn");
if (quizBtn) {
  quizBtn.addEventListener("click", () => {
    	resetScore();
  });