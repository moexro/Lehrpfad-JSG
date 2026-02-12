document.addEventListener("DOMContentLoaded", () => {
  const yes = document.getElementById("yes");
  const no = document.getElementById("no");

  const HEARTS = 45;
  const overlay = document.getElementById("heart-overlay");

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  const heartSVG = `
  <svg viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor"
      d="M23.6,0c-3.4,0-6.4,2-7.6,4.9C14.8,2,11.8,0,8.4,0
      C3.8,0,0,3.8,0,8.4c0,9.5,16,21.2,16,21.2s16-11.7,16-21.2
      C32,3.8,28.2,0,23.6,0z"/>
  </svg>
  `;

  yes.addEventListener("click", () => {
    alert("Yaaayyyyy");

    for (let i = 0; i < HEARTS; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.innerHTML = heartSVG;

      const size = rand(20, 50);
      heart.style.width = size + "px";
      heart.style.height = size + "px";

      heart.style.left = rand(0, 100) + "vw";
      heart.style.top = rand(0, 100) + "vh";

      heart.style.color = `hsl(${rand(330, 360)}, 80%, 60%)`;

      heart.style.setProperty("--dx", rand(-150, 150) + "px");
      heart.style.setProperty("--dy", rand(-150, 150) + "px");
      heart.style.setProperty("--rot", rand(-180, 180) + "deg");

      heart.style.animationDuration = rand(30, 60) + "s";

      overlay.appendChild(heart);

      // Start der Animation nach kurzer zufälliger Verzögerung
      setTimeout(
        () => {
          heart.classList.add("floating");
        },
        rand(2000, 5000),
      );
    }
  });

  no.addEventListener("click", () => {
    alert("Ey falsche Antwort");
  });
});
