/* ── karte.js ───────────────────────────────────────────
   Lehrpfad-Karte
   ─────────────────────────────────────────────────────── */

const LP_COORDS = {
  ernaehrung: [49.9446997, 9.7825362],
};

const LP_DEFAULT_CENTER = [48.1351, 11.582];
const LP_DEFAULT_ZOOM = 15;

// ── Proximity-Schwellwert in Metern ──────────────────────
const LP_PROXIMITY_METERS = 5;

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

function lp_isCompleted(quiz) {
  const completed = localStorage.getItem(`quizDone_${quiz.id}`);
  return completed ? JSON.parse(completed) : false;
}

function lp_makeIcon(unlocked, completed) {
  let fill;
  if (completed) {
    fill = "#FFD700"; // Gold für abgeschlossen
  } else if (unlocked) {
    fill = "#5cb85c"; // Grün für freigeschaltet
  } else {
    fill = "#d9534f"; // Rot für nicht freigeschaltet
  }
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

// ── Haversine-Distanz (Meter) ─────────────────────────────
function lp_distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Benutzer-Standort-Marker (Pfeil-Icon) ────────────────
function lp_makeUserIcon(heading) {
  const deg = heading != null ? heading : 0;
  const hasHeading = heading != null;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <!-- Genauigkeitsring -->
    <circle cx="24" cy="24" r="20" fill="rgba(66,133,244,0.15)" stroke="rgba(66,133,244,0.35)" stroke-width="1.5"/>
    <!-- Richtungspfeil (nur wenn Heading vorhanden) -->
    ${
      hasHeading
        ? `<g transform="rotate(${deg}, 24, 24)">
      <polygon points="24,4 29,20 24,17 19,20" fill="#4285f4" opacity="0.85"/>
    </g>`
        : ""
    }
    <!-- Standortpunkt -->
    <circle cx="24" cy="24" r="8" fill="#4285f4" stroke="#fff" stroke-width="2.5"/>
    <circle cx="24" cy="24" r="3.5" fill="#fff"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -28],
  });
}

// ── Genauigkeitskreis-Styling ─────────────────────────────
function lp_makeAccuracyCircle(map, lat, lng, accuracy) {
  return L.circle([lat, lng], {
    radius: accuracy,
    color: "#4285f4",
    fillColor: "#4285f4",
    fillOpacity: 0.08,
    weight: 1,
    dashArray: "4 4",
  }).addTo(map);
}

function lp_loadQuizData(basehref) {
  return fetch(basehref + "data/quizzes.json")
    .then((res) => {
      if (!res.ok) throw new Error("quizzes.json nicht gefunden");
      return res.json();
    })
    .then((data) => Object.values(data))
    .catch((err) => {
      console.warn("Quizdaten konnten nicht geladen werden:", err);
      return [];
    });
}

function lp_initMap() {
  const mapEl = document.getElementById("lehrpfad-map");
  if (!mapEl || typeof L === "undefined") return;

  const basehref = location.hostname.includes("github.io")
    ? "/Lehrpfad-JSG/"
    : "/";

  const map = L.map("lehrpfad-map", {
    center: LP_DEFAULT_CENTER,
    zoom: LP_DEFAULT_ZOOM,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  lp_loadQuizData(basehref).then((listQuiz) => {
    const quizById = {};
    listQuiz.forEach((q) => {
      if (q && q.id) quizById[q.id] = q;
    });

    let totalPoints = 0;
    const bounds = [];

    // Marker-Referenzen für spätere Updates speichern
    const markerRefs = {};

    Object.entries(LP_COORDS).forEach(([key, coords]) => {
      const quiz = quizById[key];
      const type = quiz ? quiz.type : null;
      const unlocked = lp_isUnlocked(key);
      const completed = quiz ? lp_isCompleted(quiz) : false;
      const score = lp_getScore(key);

      if (!isNaN(score)) totalPoints += score;
      bounds.push(coords);

      const marker = L.marker(coords, {
        icon: lp_makeIcon(unlocked, completed),
      }).addTo(map);

      const quizUrl =
        basehref + `QuizSeite/index.html?quiztype=${encodeURIComponent(key)}`;

      const buildPopupHtml = (overrideUnlocked) => {
        const isUnlocked =
          overrideUnlocked !== undefined
            ? overrideUnlocked
            : lp_isUnlocked(key);
        const isCompleted = quiz ? lp_isCompleted(quiz) : false;
        const currentScore = lp_getScore(key);
        const currentName = quiz ? quiz.name || key : key;

        let statusText, pointsHtml;
        if (!isUnlocked) {
          statusText = "Noch nicht freigeschaltet";
          pointsHtml = `<div class="lp-popup-points">🔒 Scanne den QR-Code vor Ort</div>`;
        } else {
          statusText = isCompleted ? "Abgeschlossen ✓" : "Freigeschaltet";
          pointsHtml = `<div class="lp-popup-points">🏆 <strong>${currentScore}</strong> Punkte</div>`;
        }

        const statusClass = isCompleted
          ? "completed"
          : isUnlocked
            ? "unlocked"
            : "locked";
        const quizBtn = isUnlocked
          ? `<button class="lp-btn-quiz" onclick="window.location.href='${quizUrl}'">📝 Quiz</button>`
          : `<button class="lp-btn-quiz" disabled style="opacity:.45;cursor:not-allowed">🔒 Quiz</button>`;

        return `
          <div class="lp-popup-bar ${statusClass}"></div>
          <div class="lp-popup-inner">
            <div class="lp-popup-title">${currentName}</div>
            <div class="lp-popup-status ${statusClass}">${statusText}</div>
            ${pointsHtml}
            <div class="lp-popup-actions">
              ${quizBtn}
            </div>
          </div>`;
      };

      marker.bindPopup(buildPopupHtml(), { maxWidth: 260 });

      // Popup bei Öffnen neu aufbauen (aktuelle Daten)
      marker.on("popupopen", () => {
        marker.getPopup().setContent(buildPopupHtml());
      });

      markerRefs[key] = { marker, coords, quiz, type, buildPopupHtml };
    });

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [36, 36] });

    const scoreControl = L.control({ position: "topright" });
    scoreControl.onAdd = () => {
      const div = L.DomUtil.create("div", "lp-score-control");
      div.textContent = `🏆 Gesamtpunkte: ${totalPoints}`;
      return div;
    };
    scoreControl.addTo(map);

    // ── GPS-Tracking starten ──────────────────────────────
    lp_startTracking(map, markerRefs, basehref);
  });

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
    <div class="lp-legend-item"><div class="lp-legend-dot completed"></div><span>Abgeschlossen</span></div>
    <div class="lp-legend-item"><div class="lp-legend-dot unlocked"></div><span>Freigeschaltet</span></div>
    <div class="lp-legend-item"><div class="lp-legend-dot locked"></div><span>Gesperrt</span></div>`;
  mapEl.insertAdjacentElement("afterend", legend);

  let totalPoints = 0;
  const bounds = [];

  const quizById = {};
  listQuiz.forEach((q) => {
    quizById[q.id] = q;
  });

  // Marker-Referenzen für spätere Updates speichern
  const markerRefs = {};

  Object.entries(LP_COORDS).forEach(([key, coords]) => {
    const quiz = quizById[key];
    const type = quiz ? quiz.type : null;
    const unlocked = lp_isUnlocked(key);
    const completed = quiz ? lp_isCompleted(quiz) : false;
    const score = lp_getScore(key);

    if (!isNaN(score)) totalPoints += score;
    bounds.push(coords);

    const marker = L.marker(coords, {
      icon: lp_makeIcon(unlocked, completed),
    }).addTo(map);

    const quizUrl =
      basehref + `QuizSeite/index.html?quiztype=${encodeURIComponent(key)}`;

    const buildPopupHtml = (overrideUnlocked) => {
      const isUnlocked =
        overrideUnlocked !== undefined ? overrideUnlocked : lp_isUnlocked(key);
      const isCompleted = quiz ? lp_isCompleted(quiz) : false;
      const currentScore = lp_getScore(key);
      const currentName = quiz ? quiz.name || key : key;

      let statusText, pointsHtml;
      if (!isUnlocked) {
        statusText = "Noch nicht freigeschaltet";
        pointsHtml = `<div class="lp-popup-points">🔒 Scanne den QR-Code vor Ort</div>`;
      } else {
        statusText = isCompleted ? "Abgeschlossen ✓" : "Freigeschaltet";
        pointsHtml = `<div class="lp-popup-points">🏆 <strong>${currentScore}</strong> Punkte</div>`;
      }

      const statusClass = isCompleted
        ? "completed"
        : isUnlocked
          ? "unlocked"
          : "locked";
      const quizBtn = isUnlocked
        ? `<button class="lp-btn-quiz" onclick="window.location.href='${quizUrl}'">📝 Quiz</button>`
        : `<button class="lp-btn-quiz" disabled style="opacity:.45;cursor:not-allowed">🔒 Quiz</button>`;

      return `
        <div class="lp-popup-bar ${statusClass}"></div>
        <div class="lp-popup-inner">
          <div class="lp-popup-title">${currentName}</div>
          <div class="lp-popup-status ${statusClass}">${statusText}</div>
          ${pointsHtml}
          <div class="lp-popup-actions">
            ${quizBtn}
          </div>
        </div>`;
    };

    marker.bindPopup(buildPopupHtml(), { maxWidth: 260 });

    // Popup bei Öffnen neu aufbauen (aktuelle Daten)
    marker.on("popupopen", () => {
      marker.getPopup().setContent(buildPopupHtml());
    });

    markerRefs[key] = { marker, coords, quiz, type, buildPopupHtml };
  });

  if (bounds.length > 0) map.fitBounds(bounds, { padding: [36, 36] });

  const scoreControl = L.control({ position: "topright" });
  scoreControl.onAdd = () => {
    const div = L.DomUtil.create("div", "lp-score-control");
    div.textContent = `🏆 Gesamtpunkte: ${totalPoints}`;
    return div;
  };
  scoreControl.addTo(map);

  // ── GPS-Tracking starten ──────────────────────────────
  lp_startTracking(map, markerRefs, basehref);
}

// ── Standort-Tracking & Proximity-Unlock ─────────────────
function lp_startTracking(map, markerRefs, basehref) {
  if (!navigator.geolocation) return;

  let userMarker = null;
  let accuracyCircle = null;
  let lastHeading = null;

  let isFollowing = false;
  let manualOverride = false;

  const LP_TRAIL_RADIUS_M = 1000;
  const notifiedKeys = new Set();

  // 👉 NEU: verhindert initiales Reinzoomen
  let initialViewLocked = true;

  Object.keys(LP_COORDS).forEach((key) => {
    if (lp_isUnlocked(key)) notifiedKeys.add(key);
  });

  map.on("dragstart", () => {
    manualOverride = true;
  });

  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude: lat, longitude: lng, accuracy, heading } = pos.coords;

      const h = heading != null && !isNaN(heading) ? heading : null;

      const wasNear = isFollowing;

      const isNearTrail = Object.values(LP_COORDS).some(
        (coords) =>
          lp_distanceMeters(lat, lng, coords[0], coords[1]) <=
          LP_TRAIL_RADIUS_M,
      );

      isFollowing = isNearTrail;

      if (!userMarker) {
        userMarker = L.marker([lat, lng], {
          icon: lp_makeUserIcon(h),
          zIndexOffset: 1000,
        }).addTo(map);

        accuracyCircle = lp_makeAccuracyCircle(map, lat, lng, accuracy);

        // ❌ KEIN setView mehr hier → Übersicht bleibt erhalten

        // 👉 Nach erstem Fix freigeben
        initialViewLocked = false;
      } else {
        userMarker.setLatLng([lat, lng]);
        userMarker.setIcon(lp_makeUserIcon(h));
        accuracyCircle.setLatLng([lat, lng]);
        accuracyCircle.setRadius(accuracy);

        // 👉 Follow erst nach initialem Laden erlaubt
        if (isNearTrail && !manualOverride && !initialViewLocked) {
          map.panTo([lat, lng], { animate: true, duration: 0.5 });
        }

        // Wenn Nutzer weggeht → wieder Übersicht
        else if (!isNearTrail && wasNear) {
          const allCoords = Object.values(LP_COORDS);
          map.fitBounds(allCoords, { padding: [36, 36] });
        }
      }

      // ── Proximity Unlock ──
      Object.entries(LP_COORDS).forEach(([key, coords]) => {
        if (notifiedKeys.has(key)) return;

        const dist = lp_distanceMeters(lat, lng, coords[0], coords[1]);

        if (dist <= LP_PROXIMITY_METERS) {
          notifiedKeys.add(key);

          localStorage.setItem(`quizUnlock_${key}`, JSON.stringify(true));

          const ref = markerRefs[key];
          if (ref) {
            const isCompleted = ref.quiz ? lp_isCompleted(ref.quiz) : false;
            ref.marker.setIcon(lp_makeIcon(true, isCompleted));
          }
        }
      });
    },
    (err) => {
      console.warn("Geolocation-Fehler:", err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 10000,
    },
  );
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

// ── CSS für Animationen und Locate-Button einfügen ────────
(function lp_injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes lp-slidein {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes lp-fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
    }

    .lp-locate-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #fff;
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      cursor: pointer;
      color: #4285f4;
      font-size: 1.1rem;
      margin-bottom: 6px;
      transition: background 0.15s, box-shadow 0.15s;
    }
    .lp-locate-btn:hover {
      background: #f0f5ff;
      box-shadow: 0 4px 12px rgba(66,133,244,0.25);
    }
    .lp-locate-btn:active {
      transform: scale(0.95);
    }
    .lp-compass-btn {
      font-size: 1.2rem;
    }
    .lp-compass-btn:hover {
      /* Hintergrundfarbe bleibt grün/rot – nicht überschreiben */
      background: inherit;
      filter: brightness(1.15);
    }
  `;
  document.head.appendChild(style);
})();

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
