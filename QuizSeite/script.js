// --- Quiz-Daten ---

const questionsQ1 = [
	{
		question: "Welche Pflanze wird in Deutschland am häufigsten angebaut?",
		answers: ["Weizen", "Mais", "Gerste", "Raps"],
		correctIndex: 0,
		type: "multipleChoice",
	},
	{
		question: "Was versteht man unter Fruchtfolge?",
		answers: [
			"Die Reihenfolge der Ernte innerhalb eines Tages",
			"Der Wechsel verschiedener Pflanzenarten auf einem Feld über mehrere Jahre",
			"Das Sortieren der Ernte nach Größe",
			"Die Reihenfolge der Düngung",
		],
		correctIndex: 1,
		type: "multipleChoice",
	},
	{
		question:
			"Welche Maschine wird hauptsächlich zur Bodenbearbeitung vor der Aussaat eingesetzt?",
		answers: ["Mähdrescher", "Pflug", "Ballenpresse", "Güllefass"],
		correctIndex: 1,
		type: "multipleChoice",
	},
];

const questionsQ2 = [
	{
		question: "Welche Nutztiere liefern sowohl Milch als auch Fleisch?",
		answers: ["Schafe", "Schweine", "Hühner", "Pferde"],
		correctIndex: 0,
		type: "multipleChoice",
	},
	{
		question: "Was ist ein wichtiger Vorteil des ökologischen Landbaus?",
		answers: [
			"Höhere Erträge",
			"Schnellere Erntezeiten",
			"Verzicht auf synthetische Pflanzenschutzmittel",
			"Niedrige Produktionskosten",
		],
		correctIndex: 2,
		type: "multipleChoice",
	},
	{
		question:
			"Wie nennt man die Haltung von Tieren auf dem gleichen Hof, auf dem auch ihre Futtermittel erzeugt werden?",
		answers: [
			"Intensivhaltung",
			"Kreislaufwirtschaft",
			"Stallfütterung",
			"Selbstversorgungshaltung",
		],
		correctIndex: 1,
		type: "multipleChoice",
	},
];

// Fragen zu den Maschinen

const questionsQ3 = [
	{
		question:
			"Ohne welche Maschine kann ein Bauer keine seiner Aufgaben erledigen?",
		answers: ["Pflug", "Traktor", "Rübenmaus", "Güllefass"],
		correctIndex: 1,
		type: "multipleChoice",
	},

	{
		question:
			"Feldbearbeitung: Halte & ziehe die Maschinen zu den richtigen Begriffen",
		type: "DragAndDrop",
		items: [
			{
				text: "Pflug",
				correctDrop: "Pflug",
				img: "images/MaschinenQuiz/Drehpflug.jpg",
			},
			{
				text: "Grubber",
				correctDrop: "Grubber",
				img: "images/MaschinenQuiz/Grubber.jpg",
			},
			{
				text: "Kreiselegge",
				correctDrop: "Kreiselegge",
				img: "images/MaschinenQuiz/Kreiselegge.jpg",
			},
			{
				text: "Walze",
				correctDrop: "Walze",
				img: "images/MaschinenQuiz/Walze.jpg",
			},
		],
		drops: [
			{ label: "Pflug" },
			{ label: "Grubber" },
			{ label: "Kreiselegge" },
			{ label: "Walze" },
		],
	},

	{
		question:
			"Ausbringen auf den Acker: Halte & ziehe die Maschinen zu den richtigen Begriffen",
		type: "DragAndDrop",
		items: [
			{
				text: "Miststreuer",
				correctDrop: "Miststreuer",
				img: "images/MaschinenQuiz/Miststreuer.jpg",
			},
			{
				text: "Güllefass",
				correctDrop: "Güllefass",
				img: "images/MaschinenQuiz/Guellefass.jpg",
			},
			{
				text: "Sämaschine",
				correctDrop: "Sämaschine",
				img: "images/MaschinenQuiz/Saemaschine.jpg",
			},
			{
				text: "Pflanzenschutzspritze",
				correctDrop: "Pflanzenschutzspritze",
				img: "images/MaschinenQuiz/Planzenschutzspritze.jpg",
			},
			{
				text: "Düngerstreuer",
				correctDrop: "Düngerstreuer",
				img: "images/MaschinenQuiz/Duengerstreuer.jpg",
			},
		],
		drops: [
			{ label: "Miststreuer" },
			{ label: "Güllefass" },
			{ label: "Sämaschine" },
			{ label: "Pflanzenschutzspritze" },
			{ label: "Düngerstreuer" },
		],
	},

	{
		question:
			"Heu und Graß: Halte & ziehe die Maschinen zu den richtigen Begriffen",
		type: "DragAndDrop",
		items: [
			{
				text: "Frontmähwerk",
				correctDrop: "Frontmähwerk",
				img: "images/MaschinenQuiz/Maehwerk.jpg",
			},
			{
				text: "Heckmähwerk",
				correctDrop: "Heckmähwerk",
				img: "images/MaschinenQuiz/Heckmaehwerk.jpg",
			},
			{
				text: "Heuwender",
				correctDrop: "Heuwender",
				img: "images/MaschinenQuiz/Heuwender.jpg",
			},
			{
				text: "Schwader",
				correctDrop: "Schwader",
				img: "images/MaschinenQuiz/Schwader.jpg",
			},
			{
				text: "Ladewagen",
				correctDrop: "Ladewagen",
				img: "images/MaschinenQuiz/Ladewagen.jpg",
			},
			{
				text: "Ballenpresse",
				correctDrop: "Ballenpresse",
				img: "images/MaschinenQuiz/Ballenpresse.jpg",
			},
		],
		drops: [
			{ label: "Frontmähwerk" },
			{ label: "Heckmähwerk" },
			{ label: "Heuwender" },
			{ label: "Schwader" },
			{ label: "Ladewagen" },
			{ label: "Ballenpresse" },
		],
	},
	{
		question: "Ernte: Halte & ziehe die Maschinen zu den richtigen Begriffen",
		type: "DragAndDrop",
		items: [
			{
				text: "Feldhäcksler",
				correctDrop: "Feldhäcksler",
				img: "images/MaschinenQuiz/Feldhaecksler.jpg",
			},
			{
				text: "Mähdrescher",
				correctDrop: "Mähdrescher",
				img: "images/MaschinenQuiz/Maehdrescher.jpg",
			},
			{
				text: "Rübenroder",
				correctDrop: "Rübenroder",
				img: "images/MaschinenQuiz/Ruebenroder.jpg",
			},
			{
				text: "Rübenmaus",
				correctDrop: "Rübenmaus",
				img: "images/MaschinenQuiz/Ruebenmaus.jpg",
			},
		],
		drops: [
			{ label: "Feldhäcksler" },
			{ label: "Mähdrescher" },
			{ label: "Rübenroder" },
			{ label: "Rübenmaus" },
		],
	},
];

const questionsQ4 = [
	{
		question: "Was ist ein Ziel der nachhaltigen Landwirtschaft?",
		answers: [
			"Maximaler kurzfristiger Gewinn",
			"Erhaltung der Bodenfruchtbarkeit",
			"Einsatz möglichst vieler Chemikalien",
			"Monokulturen auf großen Flächen",
		],
		correctIndex: 1,
		type: "multipleChoice",
	},
	{
		question: "Welche Methode hilft, den Boden zu schützen?",
		answers: [
			"Erosionsschutz durch Begrünung",
			"Tiefpflügen jedes Jahr",
			"Dauerhafte Brachlegung",
			"Intensive Düngung",
		],
		correctIndex: 0,
		type: "multipleChoice",
	},
	{
		question: "Was bedeutet der Begriff 'Biodiversität'?",
		answers: [
			"Die Vielfalt von Tier- und Pflanzenarten",
			"Die Menge des angebauten Getreides",
			"Die Reinheit des Grundwassers",
			"Die Anzahl der Maschinen auf einem Hof",
		],
		correctIndex: 0,
		type: "multipleChoice",
	},
];

const questionsQ5 = [
	{
		question: "Ordne die Bilder den richtigen Begriffen zu:",
		type: "DragAndDrop",
		items: [
			{ text: "Weizen", correctDrop: "Getreide" },
			{ text: "Gerste", correctDrop: "Getreide" },
			{ text: "Kuh", correctDrop: "Tier" },
			{ text: "Traktor", correctDrop: "Maschine" },
		],
		drops: [{ label: "Getreide" }, { label: "Tier" }, { label: "Maschine" }],
	},
];

const questionsQ6 = [
	{
		question: "Bewege dich dorthin!",
		type: "locator",
		lon: "9.8041856",
		lat: "50.1415936",
	},
];

//Liste mit Namen und Fragen aller auf der Seite aufrufbaren Quizze

let allQuiz = {
	Q1: {
		questions: questionsQ1,
		name: "Über den Ackerbau",
		id: "Q1",
	},
	Q2: {
		questions: questionsQ2,
		name: "Über die Tierhaltung",
		id: "Q2",
	},
	Q3: {
		questions: questionsQ3,
		name: "Landwirtschaftliche Maschinen",
		id: "Q3",
	},
	Q4: {
		questions: questionsQ4,
		name: "Nachhaltige Landwirtschaft",
		id: "Q4",
	},
	Q5: {
		questions: questionsQ5,
		name: "Zuordnungsspiel",
		id: "Q5",
	},
	Q6: {
		questions: questionsQ6,
		name: "Standortsuche",
		type: "locator",
		id: "Q6",
	},
};

localStorage.setItem("allQuizzes", JSON.stringify(allQuiz));

// --- unlock --- //
let basehref = "";
if (location.hostname.includes("github.io")) {
	basehref = "/Lehrpfad-JSG/"; // GitHub Pages Root
} else {
	basehref = "/";
}

document.documentElement.style.setProperty(
  "--quiz-bg",
  `url("${basehref}QuizSeite/images/backgroundquizStandard.jpg")`
);

function onlyUnlock() {
	const parms = new URLSearchParams(window.location.search);
	const loadOnly = parms.get("loadOnlyQuizData");
	if (loadOnly) {
		window.location.href =
			basehref + "Homepage/Stationen/index.html?from=quizunlock";
		return;
	}
}

// --- Elemente ---
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const homeBtn = document.getElementById("homeBtn");
homeBtn.classList.toggle("hidden");

let currentQuiz;
let currentQuestion = 0;
let answered = false;

// --- Quiz initialisieren ---
function getQuizID() {
	const parms = new URLSearchParams(window.location.search);
	const q = parms.get("quiztype");

	if (q && allQuiz[q]) {
		currentQuiz = q;
		localStorage.setItem(`quizUnlock_${currentQuiz}`, JSON.stringify(true));
		if (JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`)) !== true) {
			localStorage.setItem(`quizScore_${currentQuiz}`, "0");
		}
	} else {
		currentQuiz = "null";
	}
}

function getScore() {
	return parseInt(localStorage.getItem(`quizScore_${currentQuiz}`) || "0", 10);
}

function setScore(v) {
	localStorage.setItem(`quizScore_${currentQuiz}`, String(v));
	scoreEl.textContent = `Punkte: ${getScore()}`;
}

function setCorrectLocation() {
	localStorage.setItem(`located_${currentQuiz}`, true);
}

// --- Frage rendern ---
function renderQuestion() {
	if (!currentQuiz || !allQuiz[currentQuiz]) {
		document.getElementById("quizTitle").textContent =
			"Dieses Quiz existiert nicht";
		questionEl.textContent = "";
		answersEl.innerHTML = "";
		nextBtn.classList.toggle("hidden");
		scoreEl.classList.toggle("hidden");
		if (homeBtn) homeBtn.classList.toggle("hidden");
		return;
	}

	if (
		JSON.parse(localStorage.getItem(`quizDone_${currentQuiz}`) || "false") ===
		true
	) {
		document.getElementById("quizTitle").textContent =
			allQuiz[currentQuiz].name || "Unbekannt";
		questionEl.textContent = "Dieses Quiz hast du schon abgeschlossen.";
		answersEl.innerHTML = "";
		nextBtn.classList.toggle("hidden");
		scoreEl.classList.remove("hidden");
		scoreEl.textContent = `Punktzahl: ${getScore()}`;
		if (homeBtn) homeBtn.classList.toggle("hidden");
		return;
	}

	const quiz = allQuiz[currentQuiz];
	const q = quiz.questions[currentQuestion];

	if (!q) {
		questionEl.textContent = "Frage nicht gefunden.";
		answersEl.innerHTML = "";
		return;
	}

	answered = false;

	nextBtn.disabled = true;
	nextBtn.style.opacity = "0.5";
	nextBtn.style.cursor = "not-allowed";
	nextBtn.classList.remove("hidden");
	scoreEl.classList.remove("hidden");
	if (homeBtn) homeBtn.classList.add("hidden");

	document.getElementById("quizTitle").textContent = quiz.name || "Unbekannt";
	questionEl.textContent = q.question;

	if (currentQuestion === allQuiz[currentQuiz].questions.length - 1) {
		nextBtn.innerHTML = "Quiz abschließen";
	}

	if (q.type === "multipleChoice") {
		renderMultipleChoice(q);
	} else if (q.type === "DragAndDrop") {
		renderDragAndDrop(q);
	} else if (q.type === "locator") {
		renderLocator(q);
	}
}

// --- Multiple Choice ---
function renderMultipleChoice(q) {
	answersEl.innerHTML = "";
	q.answers.forEach((ans, i) => {
		const btn = document.createElement("button");
		btn.className = "answer-btn";
		btn.textContent = ans;
		btn.addEventListener("click", () => onAnswerMultipleChoice(i));
		answersEl.appendChild(btn);
	});
}

function onAnswerMultipleChoice(index) {
	if (answered) return;
	answered = true;

	const q = allQuiz[currentQuiz].questions[currentQuestion];
	const buttons = Array.from(document.querySelectorAll(".answer-btn"));
	buttons.forEach((b, i) => {
		b.disabled = true;
		if (i === q.correctIndex) b.classList.add("correct");
		else if (i === index) b.classList.add("wrong");
	});

	if (index === q.correctIndex) {
		setScore(getScore() + 3);
	}

	nextBtn.disabled = false;
	nextBtn.style.opacity = "1";
	nextBtn.style.cursor = "pointer";
}

// --- Drag & Drop ---
function renderDragAndDrop(q) {
	answersEl.innerHTML = "";
	const wrapper = document.createElement("div");
	wrapper.className = "dragdrop-wrapper";

	const shuffledItems = shuffleArray([...q.items]);
	const shuffledDrops = shuffleArray([...q.drops]);

	const dragContainer = document.createElement("div");
	dragContainer.className = "drag-container";

	shuffledItems.forEach((item) => {
		const el = document.createElement("div");
		el.className = "drag-item";
		el.dataset.correct = item.correctDrop;

		if (item.img) {
			const img = document.createElement("img");
			img.src = item.img;
			img.alt = item.text || "";
			img.className = "drag-img";
			el.appendChild(img);
		} else if (item.text) {
			const span = document.createElement("span");
			span.textContent = item.text;
			el.appendChild(span);
		}

		dragContainer.appendChild(el);
	});

	const dropContainer = document.createElement("div");
	dropContainer.className = "drop-container";

	shuffledDrops.forEach((drop) => {
		const slot = document.createElement("div");
		slot.className = "drop-slot";
		slot.dataset.id = drop.label;

		const label = document.createElement("span");
		label.textContent = drop.label;
		slot.appendChild(label);

		dropContainer.appendChild(slot);
	});

	wrapper.appendChild(dragContainer);
	wrapper.appendChild(dropContainer);
	answersEl.appendChild(wrapper);

	let draggedItem = null;
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;

	wrapper.querySelectorAll(".drag-item").forEach((item) => {
		item.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			if (item.classList.contains("locked")) return;

			isDragging = true;
			draggedItem = item;
			const rect = item.getBoundingClientRect();
			offsetX = e.clientX - rect.left;
			offsetY = e.clientY - rect.top;

			item.style.width = rect.width + "px";
			item.style.height = rect.height + "px";
			item.style.position = "absolute";
			item.style.zIndex = "1000";
			item.style.pointerEvents = "none";
			item.style.transition = "none";

			document.body.appendChild(item);
			moveAt(e.pageX, e.pageY);
		});
	});

	document.addEventListener("pointermove", (e) => {
		if (!isDragging || !draggedItem) return;
		moveAt(e.pageX, e.pageY);

		const hovering = document
			.elementFromPoint(e.clientX, e.clientY)
			?.closest(".drop-slot");
		dropContainer.querySelectorAll(".drop-slot").forEach((item) => {
			item.classList.remove("hover");
		});
		if (hovering) hovering.classList.add("hover");
	});

	document.addEventListener("pointerup", (e) => {
		if (!isDragging || !draggedItem) return;
		isDragging = false;
		const item = draggedItem;
		draggedItem = null;

		const drop = document
			.elementFromPoint(e.clientX, e.clientY)
			?.closest(".drop-slot");

		if (drop) {
			const correct = item.dataset.correct;
			const dropId = drop.dataset.id;

			if (correct === dropId) {
				drop.classList.add("correct");
				item.classList.add("locked");
				item.style.position = "static";
				item.style.pointerEvents = "none";
				item.style.width = "";
				item.style.height = "";
				drop.appendChild(item);
				setScore(getScore() + 1);
			} else {
				drop.classList.add("wrong");
				setTimeout(() => drop.classList.remove("wrong"), 800);
				resetItem(item);
			}
		} else {
			resetItem(item);
		}

		checkAllLocked();
	});

	function moveAt(x, y) {
		draggedItem.style.left = x - offsetX + "px";
		draggedItem.style.top = y - offsetY + "px";
	}

	function resetItem(item) {
		item.style.position = "static";
		item.style.zIndex = "";
		item.style.pointerEvents = "";
		item.style.width = "";
		item.style.height = "";
		item.style.transition = "";
		dragContainer.appendChild(item);
	}

	function checkAllLocked() {
		const totalItems = q.items.length;
		const lockedItems = wrapper.querySelectorAll(".drag-item.locked").length;
		if (lockedItems === totalItems) {
			nextBtn.disabled = false;
			nextBtn.style.opacity = "1";
			nextBtn.style.cursor = "pointer";
		}
	}
}

//distanzermittlung
function distance(lat1, lon1, lat2, lon2) {
	const R = 6371000; // Erdradius in Metern
	const toRad = (deg) => (deg * Math.PI) / 180;

	const φ1 = toRad(lat1);
	const φ2 = toRad(lat2);
	const Δφ = toRad(lat2 - lat1);
	const Δλ = toRad(lon2 - lon1);

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

//Locator Quiz
function renderLocator(q) {
	const targetlat = q.lat;
	const targetlon = q.lon;

	const mapsbtn = document.createElement("button");
	const checkbtn = document.createElement("button");

	mapsbtn.className = "answer-btn";
	mapsbtn.textContent = "Hier kommst du zum Google-Maps Link";
	answersEl.appendChild(mapsbtn);
	mapsbtn.addEventListener("click", () => {
		const mapsUrl = `https://www.google.com/maps?q=${targetlat},${targetlon}`;
		window.open(mapsUrl, "_blank");
	});

	checkbtn.className = "answer-btn";
	checkbtn.textContent =
		"Hier kannst du nachschauen, ob du an der richtigen Position gelandet bist.";
	answersEl.appendChild(checkbtn);
	checkbtn.addEventListener("click", () => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const lat = pos.coords.latitude;
				const lon = pos.coords.longitude;

				const target = { lat: targetlat, lon: targetlon }; // Beispiel
				const radius = 10; // Meter

				console.log(`${lat} + ${lon}`);
				console.log(target);

				if (distance(lat, lon, target.lat, target.lon) <= radius) {
					alert("Du hast den richtigen Ort gefunden");
					setCorrectLocation();

					nextBtn.disabled = false;
					nextBtn.style.opacity = "1";
					nextBtn.style.cursor = "pointer";
				} else {
					alert("Das ist noch nicht der richtige Ort!");
				}
			},
			() => {
				alert("Standortzugriff verweigert oder nicht verfügbar");
			},
		);
	});
}

// --- Next Button ---
nextBtn.addEventListener("click", () => {
	const type = allQuiz[currentQuiz].questions[currentQuestion].type;
	const length = allQuiz[currentQuiz].questions.length;

	currentQuestion++;

	console.log(type);
	if (type === "locator" && currentQuestion >= length) {
		quizEnde("locator");
		return;
	}
	if (type === "normal" && currentQuestion >= length) {
		quizEnde("normal");
		return;
	}
	renderQuestion();
});

function quizEnde(type) {
	answersEl.innerHTML = "";
	nextBtn.disabled = true;
	nextBtn.classList.toggle("hidden");
	scoreEl.classList.toggle("hidden");
	homeBtn.classList.toggle("hidden");
	if (type === "normal") {
		questionEl.textContent =
			"Du hast das Quiz beendet und " + getScore() + " Punkte erreicht.";
	} else if (type === "locator") {
		questionEl.textContent = "Du hast den gesuchten Ort gefunden. Gut gemacht!";
	}
}

// --- Hilfsfunktionen ---
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// --- Home Button ---
if (homeBtn) {
	homeBtn.addEventListener("click", () => {
		const target = homeBtn.getAttribute("data-home") || "#";
		if (target === "#") return;
		localStorage.setItem(`quizDone_${currentQuiz}`, JSON.stringify(true));
		window.location.href = basehref + target;
	});
}

document.addEventListener("DOMContentLoaded", () => {
	onlyUnlock();
});
// --- Quiz starten ---
getQuizID();
renderQuestion();
