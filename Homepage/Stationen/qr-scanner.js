

function createScanner() {
  const root = document.getElementById("qr-scanner");
  if (!root) {
    console.error("[qr-scanner] Element #qr-scanner not found.");
    return;
  }

  // ── Build DOM ──────────────────────────────────────────────────────────────
  root.innerHTML = `
    <div class="qrs-card">
      <div class="qrs-viewfinder">
        <video class="qrs-video" autoplay playsinline muted></video>
        <canvas class="qrs-canvas"></canvas>
        <div class="qrs-overlay">
          <div class="qrs-frame">
            <span></span>
            <div class="qrs-scan-line"></div>
          </div>
        </div>
        <div class="qrs-idle">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5">
            <rect x="4" y="12" width="40" height="28" rx="4"/>
            <circle cx="24" cy="26" r="8"/>
            <path d="M16 12l3-5h10l3 5"/>
          </svg>
          <p>Kamera starten um QR-Code zu scannen</p>
        </div>
        <div class="qrs-flash"></div>
      </div>
      <div class="qrs-controls">
        <button class="qrs-btn">▶ Kamera starten</button>
      </div>
      <div class="qrs-result">
        <p class="qrs-status">— bereit</p>
        <p class="qrs-result-text"></p>
      </div>
    </div>
    
  `;

  // ── Refs ───────────────────────────────────────────────────────────────────
  const video = root.querySelector(".qrs-video");
  const canvas = root.querySelector(".qrs-canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const btn = root.querySelector(".qrs-btn");
  const idle = root.querySelector(".qrs-idle");
  const scanLine = root.querySelector(".qrs-scan-line");
  const flash = root.querySelector(".qrs-flash");
  const statusEl = root.querySelector(".qrs-status");
  const resultEl = root.querySelector(".qrs-result-text");

  // ── State ──────────────────────────────────────────────────────────────────
  let stream = null;
  let scanning = false;
  let animFrame = null;
  let lastResult = "";

  // ── Camera ────────────────────────────────────────────────────────────────
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = stream;
      scanning = true;

      btn.textContent = "■ Kamera stoppen";
      idle.classList.add("hidden");
      scanLine.style.display = "block";
      setStatus("idle", "— scannt …");

      requestAnimationFrame(tick);
    } catch (e) {
      setStatus("err", "Kamerazugriff verweigert");
    }
  }

  function stopCamera() {
    scanning = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    video.srcObject = null;

    btn.textContent = "▶ Kamera starten";
    idle.classList.remove("hidden");
    scanLine.style.display = "none";
    lastResult = "";
  }

  btn.addEventListener("click", () =>
    scanning ? stopCamera() : startCamera(),
  );

  // ── Scan loop ──────────────────────────────────────────────────────────────
  function tick() {
    if (!scanning) return;
    animFrame = requestAnimationFrame(tick);
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data !== lastResult) {
      lastResult = code.data;
      triggerFlash();
      handleResult(code.data);
    }
  }

  // ── Result ────────────────────────────────────────────────────────────────
  function handleResult(text) {
    setStatus("ok", "✓ erkannt");
    resultEl.textContent = text;
    stopCamera();

    if (/^https?:\/\//i.test(text)) {
      window.location.href = text;
    }
  }

  function setStatus(type, text) {
    statusEl.className =
      "qrs-status" + (type === "ok" ? " ok" : type === "err" ? " err" : "");
    statusEl.textContent = text;
  }

  // ── Flash ─────────────────────────────────────────────────────────────────
  function triggerFlash() {
    flash.classList.add("active");
    setTimeout(() => flash.classList.remove("active"), 150);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createScanner();
});
