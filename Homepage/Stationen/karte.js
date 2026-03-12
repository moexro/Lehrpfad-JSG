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

  // Marker-Referenzen für spätere Updates speichern
  const markerRefs = {};

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

    const buildPopupHtml = (overrideUnlocked) => {
      const isUnlocked =
        overrideUnlocked !== undefined ? overrideUnlocked : lp_isUnlocked(key);
      const isVisited = quiz ? lp_isVisited(quiz) : false;
      const currentScore = lp_getScore(key);
      const currentName = quiz && isVisited ? quiz.name || "" : "";

      let statusText, pointsHtml;
      if (type === "locator") {
        const located = lp_isLocated(key);
        statusText = located ? "Gefunden ✓" : "Noch nicht gefunden";
        pointsHtml = `<div class="lp-popup-points">📍 ${located ? "Ort wurde gefunden!" : "Ort noch ausstehend"}</div>`;
      } else if (!isUnlocked) {
        statusText = "Noch nicht freigeschaltet";
        pointsHtml = `<div class="lp-popup-points">🔒 Scanne den QR-Code vor Ort</div>`;
      } else {
        statusText = isVisited ? "Besucht ✓" : "Noch nicht besucht";
        pointsHtml = `<div class="lp-popup-points">🏆 <strong>${isVisited ? currentScore : 0}</strong> Punkte</div>`;
      }

      const quizBtn = isUnlocked
        ? `<button class="lp-btn-quiz" onclick="window.location.href='${quizUrl}'">📝 Quiz</button>`
        : `<button class="lp-btn-quiz" disabled style="opacity:.45;cursor:not-allowed">🔒 Quiz</button>`;

      return `
        <div class="lp-popup-bar ${isVisited ? "visited" : "unvisited"}"></div>
        <div class="lp-popup-inner">
          <div class="lp-popup-title">${currentName}</div>
          <div class="lp-popup-status ${isVisited ? "visited" : "unvisited"}">${statusText}</div>
          ${pointsHtml}
          <div class="lp-popup-actions">
            <a class="lp-btn-maps" href="${mapsUrl}" target="_blank" rel="noopener">🗺️ Navigation</a>
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
    div.textContent = `🏆 ${totalPoints} Punkte`;
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
  // isFollowing: true = Karte folgt Nutzer (nur wenn er nah am Pfad ist)
  // manualOverride: true = Nutzer hat manuell gescrollt, Auto-Follow pausiert
  let isFollowing = false;
  let manualOverride = false;
  const LP_TRAIL_RADIUS_M = 1000; // < 1 km von mind. einer Station → Follow-Modus
  const notifiedKeys = new Set();

  // Bereits freigeschaltete Stationen als bekannt markieren
  Object.keys(LP_COORDS).forEach((key) => {
    if (lp_isUnlocked(key)) notifiedKeys.add(key);
  });

  // "Meinen Standort anzeigen"-Button
  const locateBtn = L.control({ position: "bottomright" });
  locateBtn.onAdd = () => {
    const btn = L.DomUtil.create("button", "lp-locate-btn");
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      <circle cx="12" cy="12" r="8" opacity=".3"/>
    </svg>`;
    btn.title = "Meinen Standort zentrieren";
    btn.addEventListener("click", () => {
      manualOverride = false;
      if (userMarker) {
        map.setView(userMarker.getLatLng(), Math.max(map.getZoom(), 17));
      }
    });
    return btn;
  };
  locateBtn.addTo(map);

  // "Alle Stationen anzeigen"-Button
  const overviewBtn = L.control({ position: "bottomright" });
  overviewBtn.onAdd = () => {
    const btn = L.DomUtil.create("button", "lp-locate-btn");
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>`;
    btn.title = "Alle Stationen anzeigen";
    btn.addEventListener("click", () => {
      manualOverride = true;
      map.fitBounds(Object.values(LP_COORDS), { padding: [36, 36] });
    });
    return btn;
  };
  overviewBtn.addTo(map);

  // Manuelles Scrollen pausiert Auto-Follow
  map.on("dragstart", () => {
    manualOverride = true;
  });

  // DeviceOrientation für Kompass-Heading
  let deviceHeading = null;
  let compassBtnEl = null;

  function setCompassState(active, unavailable = false) {
    if (!compassBtnEl) return;
    if (unavailable) {
      compassBtnEl.style.background = "#888";
      compassBtnEl.style.color = "#ccc";
      compassBtnEl.style.opacity = "0.5";
      compassBtnEl.style.cursor = "not-allowed";
      compassBtnEl.title = "Kein Kompasssensor vorhanden";
      compassBtnEl.disabled = true;
    } else {
      compassBtnEl.style.background = active ? "#3a7d44" : "#9b2222";
      compassBtnEl.style.color = "#fff";
      compassBtnEl.style.opacity = "1";
      compassBtnEl.style.cursor = "pointer";
      compassBtnEl.disabled = false;
      compassBtnEl.title = active
        ? "Kompass aktiv"
        : "Kompass inaktiv – tippen zum Aktivieren";
    }
  }

  function handleOrientation(e) {
    let heading = null;
    if (e.webkitCompassHeading != null) {
      heading = e.webkitCompassHeading;
    } else if (e.alpha != null) {
      heading = (360 - e.alpha) % 360;
    }
    if (heading == null) return;
    deviceHeading = heading;
    setCompassState(true);
    if (userMarker) {
      userMarker.setIcon(lp_makeUserIcon(deviceHeading));
    }
  }

  function requestIOSOrientation() {
    DeviceOrientationEvent.requestPermission()
      .then((state) => {
        if (state === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
          setCompassState(true);
        } else {
          setCompassState(false);
        }
      })
      .catch(() => setCompassState(false));
  }

  // Kompass-Button immer anzeigen
  const compassControl = L.control({ position: "bottomright" });
  compassControl.onAdd = () => {
    const btn = L.DomUtil.create("button", "lp-locate-btn lp-compass-btn");
    btn.innerHTML = `🧭`;
    compassBtnEl = btn;
    setCompassState(false); // Startzustand: rot (wird ggf. zu grau wenn kein Sensor)

    btn.addEventListener("click", () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        // iOS 13+: Klick löst erneute Anfrage aus (einziger Weg nach Ablehnung)
        requestIOSOrientation();
      }
    });

    return btn;
  };
  compassControl.addTo(map);
  // compassBtnEl ist jetzt gesetzt, da addTo onAdd synchron aufruft

  const isIOS13 =
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function";

  if (isIOS13) {
    // iOS 13+: requestPermission MUSS durch einen User-Gesture ausgelöst werden.
    // Wir hängen uns einmalig an den nächsten Klick irgendwo auf der Seite,
    // um die Erlaubnis so früh wie möglich — aber regelkonform — anzufragen.
    const askOnFirstInteraction = () => {
      document.removeEventListener("click", askOnFirstInteraction, {
        once: true,
      });
      requestIOSOrientation();
    };
    document.addEventListener("click", askOnFirstInteraction, { once: true });
  } else {
    // Android / Desktop: Events registrieren
    // Nach 2s ohne Event → kein Sensor vorhanden → Button grau/deaktiviert
    let sensorDetected = false;
    const sensorTimeout = setTimeout(() => {
      if (!sensorDetected) setCompassState(false, true);
    }, 2000);

    const onOrientFirst = (e) => {
      const hasHeading =
        e.webkitCompassHeading != null || (e.alpha != null && e.alpha !== 0);
      if (hasHeading) {
        sensorDetected = true;
        clearTimeout(sensorTimeout);
      } else if (!sensorDetected) {
        // Events kommen, aber kein Heading → kein Sensor
        clearTimeout(sensorTimeout);
        setCompassState(false, true);
      }
      handleOrientation(e);
    };

    window.addEventListener("deviceorientationabsolute", onOrientFirst, true);
    window.addEventListener("deviceorientation", onOrientFirst, true);
  }

  // Geolocation Watch
  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude: lat, longitude: lng, accuracy, heading } = pos.coords;

      // Heading: GPS-Heading wenn kein Geräte-Heading verfügbar
      const h =
        deviceHeading != null
          ? deviceHeading
          : heading != null && !isNaN(heading)
            ? heading
            : null;

      // Prüfen ob Nutzer innerhalb 1 km von mind. einer Station ist
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
        userMarker.bindPopup("<b>Du bist hier</b>");

        accuracyCircle = lp_makeAccuracyCircle(map, lat, lng, accuracy);

        if (isNearTrail) {
          // Nutzer ist beim Lehrpfad → auf Nutzer zentrieren
          map.setView([lat, lng], 17);
        }
        // Sonst bleibt fitBounds aus lp_initMap aktiv
      } else {
        userMarker.setLatLng([lat, lng]);
        userMarker.setIcon(lp_makeUserIcon(h));
        accuracyCircle.setLatLng([lat, lng]);
        accuracyCircle.setRadius(accuracy);

        if (isNearTrail && !manualOverride) {
          map.panTo([lat, lng], { animate: true, duration: 0.5 });
        } else if (!isNearTrail && wasNear) {
          // Nutzer hat den Pfad verlassen → zurück auf alle Stationen zoomen
          const allCoords = Object.values(LP_COORDS);
          map.fitBounds(allCoords, { padding: [36, 36] });
        }
      }

      // ── Proximity-Check: Stationen innerhalb 5 m freischalten ──
      Object.entries(LP_COORDS).forEach(([key, coords]) => {
        if (notifiedKeys.has(key)) return;

        const dist = lp_distanceMeters(lat, lng, coords[0], coords[1]);

        if (dist <= LP_PROXIMITY_METERS) {
          notifiedKeys.add(key);

          // Station freischalten
          localStorage.setItem(`quizUnlock_${key}`, JSON.stringify(true));

          // Marker-Icon aktualisieren
          const ref = markerRefs[key];
          if (ref) {
            const isVisited = ref.quiz ? lp_isVisited(ref.quiz) : false;
            ref.marker.setIcon(lp_makeIcon(isVisited));
          }

          // Toast-Benachrichtigung
          const toast = document.createElement("div");
          const stationName = markerRefs[key]?.quiz?.name || key;
          toast.innerHTML = `🎯 <strong>Station ${key} in der Nähe!</strong><br><small>Automatisch freigeschaltet</small>`;
          toast.style.cssText = `
            position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
            background:#2d4a2d;color:#fff;padding:12px 20px;border-radius:14px;
            font-size:0.88rem;line-height:1.45;text-align:center;
            box-shadow:0 6px 20px rgba(0,0,0,0.25);z-index:9999;
            border:1.5px solid rgba(255,255,255,0.15);
            animation:lp-slidein 0.35s ease, lp-fadeout 0.4s 3.6s forwards;`;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 4000);

          // Vibration (falls unterstützt)
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
      });
    },
    (err) => {
      console.warn("Geolocation-Fehler:", err.message);

      // Einmalige Fehlermeldung
      if (err.code === err.PERMISSION_DENIED) {
        const toast = document.createElement("div");
        toast.textContent =
          "📍 Standortzugriff verweigert – Tracking nicht möglich";
        toast.style.cssText = `
          position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
          background:#7a1f1f;color:#fff;padding:10px 18px;border-radius:20px;
          font-size:0.85rem;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,0.2);
          z-index:9999;`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }
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
