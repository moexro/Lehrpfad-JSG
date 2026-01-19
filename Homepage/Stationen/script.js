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

function getQuizzes() {
	const container = document.getElementById("Quiz_button_container");
	const containerScore = document.getElementById("Quiz_score_container");

	//falls keine Quizes freigeschalten sind
	Object.values(listQuiz).forEach((quiz) => {
		const quizKey = quiz.id;
		if (localStorage.getItem(`quizUnlock_${quizKey}`)) {
			totalUnlocks++;
		}
	});

	if (totalUnlocks === 0) {
		container.textContent = "Du hast noch kein Quiz freigeschaltet!";

		const resetB = document.getElementById("resetQuizzes");
		resetB.classList.add("forcehidden");
		return;
	}

	Object.values(listQuiz).forEach((quiz) => {
		const quizKey = quiz.id; // Annahme: Der Quiz-Schlüssel ist der Name des Quiz
		// sichere Auswertung des Unlock-Flags
		const rawUnlock = localStorage.getItem(`quizUnlock_${quizKey}`);
		const unlocked = rawUnlock ? JSON.parse(rawUnlock) : false;
		console.log(unlocked);
		if (unlocked) {
			const qscore = parseInt(
				localStorage.getItem(`quizScore_${quizKey}`) || "0",
				10,
			);
			const located = JSON.parse(localStorage.getItem(`located_${quizKey}`));
			const quizName = quiz.name || quizKey;
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "get_to-quiz-btn";
			btn.id = `quizBtn_${quizKey}`;
			btn.setAttribute("data-quiz", quizKey);

			if (quiz.type === "locator") {
				let status;
				if (located) {
					status = "Du hast den richtigen Ort gefunden!";
				} else {
					status = "Diesen Ort musst du noch finden!";
				}
				btn.innerHTML = `${quizName}: <br> ${status}`;
			} else {
				btn.innerHTML = `${quizName}: <br>${qscore} Punkte`;
			}

			btn.addEventListener("click", () => {
				// Verwende forward slashes und encodiere den Parameter
				const url =
					basehref +
					`QuizSeite/index.html?quiztype=${encodeURIComponent(quizKey)}`;
				window.location.href = url;
			});
			if (container) container.appendChild(btn);
			if (scoreEl) {
				totalPoints += Number.isNaN(qscore) ? 0 : qscore;
			}
		}
	});

	if (scoreEl && totalPoints > 0) {
		scoreEl.className = "points";
		scoreEl.textContent = `Gesamtpunkte: ${totalPoints}`;
		containerScore.appendChild(scoreEl);
	}
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

unlockFromLink();
getQuizzes();
resetButton();

//Scanner
