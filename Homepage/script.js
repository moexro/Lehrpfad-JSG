function resetScore() {
  localStorage.setItem("quizScore", 0);
}

const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    	resetScore();
  });