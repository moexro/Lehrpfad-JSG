function resetScore(q) {
  let points = 0;
  localStorage.setItem(`quizScore_${q}`, String(points));
  console.log(`Punkte für ${q} zurückgesetzt.`);
  console.log(localStorage.getItem(`quizScore_${q}`));
}

const quizBtn = document.getElementById("quizBtn");
if (quizBtn) {
  quizBtn.addEventListener("click", () => {
    resetScore(quizBtn.getAttribute("data-quiz"));
  });
}
