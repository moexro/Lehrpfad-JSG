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
	Object.values(listQuiz).forEach((quiz) => {
		const quizKey = quiz.id; // Annahme: Der Quiz-Schlüssel ist der Name des Quiz
		// sichere Auswertung des Unlock-Flags
		const rawUnlock = localStorage.getItem(`quizUnlock_${quizKey}`);
		const unlocked = rawUnlock ? JSON.parse(rawUnlock) : false;
		console.log(unlocked);
		if (unlocked) {
			const qscore = parseInt(
				localStorage.getItem(`quizScore_${quizKey}`) || "0",
				10
			);
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
				window.location.href = url;
			});
			if (container) container.appendChild(btn);
			if (scoreEl) {
				totalPoints += Number.isNaN(qscore) ? 0 : qscore;
			}
		}
	});

	Object.values(listQuiz).forEach((quiz) => {
		const quizKey = quiz.id;
		if (localStorage.getItem(`quizUnlock_${quizKey}`)) {
			totalUnlocks++;
		}
	});

	if (totalUnlocks === 0) {
		container.classList.toggle("hidden");
		const resetB = document.getElementById("resetQuizzes");
		resetB.classList.toggle("hidden");
	}

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
			"Willst du wirklich alle gespeicherten Daten löschen?"
		);
		if (confirmed) {
			localStorage.clear();
			alert("Alle Daten wurden gelöscht!");
			window.location.reload();
		}
	});
}
function unlockButton() {
	const unlockB = document.getElementById("unlockQuizzes");
	unlockB.addEventListener("click", () => {
		window.location.href = "../Quiz Seite/index.html?loadOnlyQuizData=true";
	});
}

function unlockFromLink() {
	const params = new URLSearchParams(window.location.search);

	if (params.get("from") === "quizLoaded") {
		allQuizUnlock();
		window.location.href = "../Homepage/index.html";
	}
}

//DROPDOWN MENÜ

const dropBtn = document.getElementById("dropBtn");
const dropdown = document.getElementById("dropcontent");
const page = document.getElementById("page");
const topbar = document.getElementById("topbar");
const overlay = document.querySelector(".overlay");

// Toggle Dropdown beim Klick
dropBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	dropdown.classList.toggle("open");

	if (dropdown.classList.contains("open")) {
		overlay.style.opacity = "1";
		overlay.style.pointerEvents = "all";
		topbar.style.filter = "brightness(2)";
		dropdown.style.filter = "brightness(2)";
	} else {
		overlay.style.opacity = "0";
		overlay.style.pointerEvents = "none";
		topbar.style.filter = "brightness(1)";
		dropdown.style.filter = "brightness(1)";
	}
});

overlay.addEventListener("click", () => {
	dropdown.classList.remove("open");
	overlay.style.opacity = "0";
	overlay.style.pointerEvents = "none";
	topbar.style.filter = "brightness(1)";
	dropdown.style.filter = "brightness(1)";
});

// Klick außerhalb schließt das Dropdown
document.addEventListener("click", () => {
	dropdown.classList.remove("open");
	overlay.style.opacity = "0";
	overlay.style.pointerEvents = "none";
	topbar.style.filter = "brightness(1)";
	dropdown.style.filter = "brightness(1)";
});

unlockFromLink();
getQuizzes();
resetButton();
unlockButton();
