/* ── karte.js ───────────────────────────────────────────
   Lehrpfad-Karte
   ─────────────────────────────────────────────────────── */

const LP_COORDS = {
  Q1: [49.9446997, 9.7825362],
  Q2: [49.9426253, 9.7924135],
  Q3: [49.939822, 9.8011685],
  Q4: [49.9315707, 9.8045507],
  Q5: [49.9363771, 9.8037351],
};

const LP_DEFAULT_CENTER = [48.1351, 11.582];
const LP_DEFAULT_ZOOM = 15;

function lp_getScore(key) {
  return parseInt(localStorage.getItem(`quizScore_${key}`) || "0", 10);
}

function lp_isUnlocked(key) {
  const raw = localStorage.getItem(`quizUnlock_${key}`);
  return raw ? JSON.parse(raw) : false;
}

function lp_isLocated(key) {
  const raw = localStorage.getItem(`located_${key}`);
  return raw ? JSON.parse(raw) : false;
}

function lp_isVisited(quiz) {
  if (quiz.type === "locator") return lp_isLocated(quiz.id);
  const raw = localStorage.getItem(`quizVisited_${quiz.id}`);
  return raw ? JSON.parse(raw) : false;
}

function lp_makeIcon(visited) {
  const fill = visited ? "#5cb85c" : "#d9534f";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 9.375 13.5 25.5 14.5 26.8a.8.8 0 0 0 1 0C16.5 40.5 30 24.375 30 15 30 6.716 23.284 0 15 0z"
      fill="${fill}" stroke="#fff" stroke-width="2"/>
    <circle cx="15" cy="15" r="6.5" fill="#fff" opacity=".9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -44],
  });
}

function lp_initMap() {
  const mapEl = document.getElementById("lehrpfad-map");
  if (!mapEl || typeof L === "undefined") return;

  const basehref = location.hostname.includes("github.io")
    ? "/Lehrpfad-JSG/"
    : "/";

  const quizData = localStorage.getItem("allQuizzes");
  const listQuiz = quizData ? Object.values(JSON.parse(quizData)) : [];

  const map = L.map("lehrpfad-map", {
    center: LP_DEFAULT_CENTER,
    zoom: LP_DEFAULT_ZOOM,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Koordinaten per Klick kopieren
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    const str = `"${lat.toFixed(7)}": [${lat.toFixed(7)}, ${lng.toFixed(7)}],`;
    navigator.clipboard.writeText(str).then(() => {
      const toast = document.createElement("div");
      toast.textContent = `📋 Kopiert: [${lat.toFixed(5)}, ${lng.toFixed(5)}]`;
      toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
        background:#2d4a2d;color:#fff;padding:8px 18px;border-radius:20px;
        font-size:0.85rem;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,0.2);
        z-index:9999;animation:fadeout 2s forwards;`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  });

  // Legende
  const legend = document.createElement("div");
  legend.className = "lp-legend";
  legend.innerHTML = `
    <div class="lp-legend-item"><div class="lp-legend-dot visited"></div><span>Besucht</span></div>
    <div class="lp-legend-item"><div class="lp-legend-dot unvisited"></div><span>Noch nicht besucht</span></div>`;
  mapEl.insertAdjacentElement("afterend", legend);

  let totalPoints = 0;
  const bounds = [];

  const quizById = {};
  listQuiz.forEach((q) => {
    quizById[q.id] = q;
  });

  Object.entries(LP_COORDS).forEach(([key, coords]) => {
    const quiz = quizById[key];
    const type = quiz ? quiz.type : null;
    const unlocked = lp_isUnlocked(key);
    const visited = quiz ? lp_isVisited(quiz) : false;
    const name = quiz && visited ? quiz.name || "" : "";
    const score = lp_getScore(key);

    if (!isNaN(score) && visited) totalPoints += score;
    bounds.push(coords);

    const marker = L.marker(coords, { icon: lp_makeIcon(visited) }).addTo(map);

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
    const quizUrl =
      basehref + `QuizSeite/index.html?quiztype=${encodeURIComponent(key)}`;

    let statusText, pointsHtml;
    if (type === "locator") {
      const located = lp_isLocated(key);
      statusText = located ? "Gefunden ✓" : "Noch nicht gefunden";
      pointsHtml = `<div class="lp-popup-points">📍 ${located ? "Ort wurde gefunden!" : "Ort noch ausstehend"}</div>`;
    } else if (!unlocked) {
      statusText = "Noch nicht freigeschaltet";
      pointsHtml = `<div class="lp-popup-points">🔒 Scanne den QR-Code vor Ort</div>`;
    } else {
      statusText = visited ? "Besucht ✓" : "Noch nicht besucht";
      pointsHtml = `<div class="lp-popup-points">🏆 <strong>${visited ? score : 0}</strong> Punkte</div>`;
    }

    const quizBtn = unlocked
      ? `<button class="lp-btn-quiz" onclick="window.location.href='${quizUrl}'">📝 Quiz</button>`
      : `<button class="lp-btn-quiz" disabled style="opacity:.45;cursor:not-allowed">🔒 Quiz</button>`;

    const popupHtml = `
      <div class="lp-popup-bar ${visited ? "visited" : "unvisited"}"></div>
      <div class="lp-popup-inner">
        <div class="lp-popup-title">${name}</div>
        <div class="lp-popup-status ${visited ? "visited" : "unvisited"}">${statusText}</div>
        ${pointsHtml}
        <div class="lp-popup-actions">
          <a class="lp-btn-maps" href="${mapsUrl}" target="_blank" rel="noopener">🗺️ Navigation</a>
          ${quizBtn}
        </div>
      </div>`;

    marker.bindPopup(popupHtml, { maxWidth: 260 });
  });

  if (bounds.length > 0) map.fitBounds(bounds, { padding: [36, 36] });

  const scoreControl = L.control({ position: "topright" });
  scoreControl.onAdd = () => {
    const div = L.DomUtil.create("div", "lp-score-control");
    div.textContent = `🏆 ${totalPoints} Punkte`;
    return div;
  };
  scoreControl.addTo(map);
}

function lp_hookResetButton() {
  const btn = document.getElementById("resetQuizzes");
  if (!btn) return;
  const fresh = btn.cloneNode(true);
  btn.replaceWith(fresh);
  fresh.addEventListener("click", () => {
    const confirmed = confirm(
      "Willst du wirklich alle gespeicherten Daten löschen?",
    );
    if (confirmed) {
      localStorage.clear();
      alert("Alle Daten wurden gelöscht!");
      window.location.reload();
      sessionStorage.setItem("scrollTo", "stations");
    }
  });
}

const scrollTarget = sessionStorage.getItem("scrollTo");
if (scrollTarget) {
  sessionStorage.removeItem("scrollTo");
  setTimeout(() => {
    document
      .getElementById(scrollTarget)
      ?.scrollIntoView({ behavior: "smooth" });
  }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
  lp_initMap();
  lp_hookResetButton();
});
