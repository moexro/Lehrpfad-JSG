// Overlay der Website
// DOM
const header = document.getElementById("topbar");

const nav = document.createElement("nav");
const dropdown = document.createElement("div");
const icon = document.createElement("div");
const main = document.getElementById("main");
const dropcontent = document.createElement("ul");
const footer = document.createElement("footer");

function createOverlay() {
  let basehref = location.hostname.includes("github.io")
    ? "/Lehrpfad-JSG/"
    : "/";

  if (!header) return;

  // ── Linke Seite ──────────────────────────────────────────
  
  nav.className = "dropdown-menu";

  dropdown.className = "dropdown";
  dropdown.id = "dropdown";

  icon.className = "icon dropbtn";
  icon.id = "dropBtn";
  icon.style.backgroundImage = `url("${basehref}media/images/menu.svg")`;

  dropdown.appendChild(icon);
  nav.appendChild(dropdown);



  header.appendChild(nav);

  // ── Rechte Seite / Controls ──────────────────────────────

  const logoAELF = document.createElement("img");
  logoAELF.src = basehref + "media/images/LogoAELF.png";
  logoAELF.alt = "Logo AELF";
  logoAELF.className = "logo";
  header.appendChild(logoAELF);


  // ── Dropdown-Inhalt ──────────────────────────────────────
  dropcontent.classList.add("dropcontent", "container");
  dropcontent.id = "dropcontent";
  dropcontent.style.left = "0";
  dropcontent.style.right = "0";
  dropcontent.style.margin = "auto";

  const buttons = {
    homepage: { href: "https://www.jsg-karlstadt.de", text: "JSG-Homepage" },
    information: {
      href: "#info",
      text: "Informationen",
    },
    stationen: {
      href: "#stations",
      text: "Zu den Stationen",
    },
    mitwirkende: {
      href: "#mentions",
      text: "Die Mitwirkenden",
    },
  };

  Object.values(buttons).forEach((e) => {
    const link = document.createElement("a");
    link.className = "text";
    link.href = e.href;
    link.textContent = e.text;
    dropcontent.appendChild(link);
  });

  if (header.classList.contains("withUnlock")) {
    const unlockBtn = document.createElement("a");
    unlockBtn.href = basehref + "QuizSeite/index.html?loadOnlyQuizData=true";
    unlockBtn.textContent = "Dev-Unlock";
    dropcontent.appendChild(unlockBtn);
  }

  if (main) {
    main.appendChild(dropcontent);
  }

  // ── Footer ───────────────────────────────────────────────
  footer.className = "bar";
  footer.id = "footer";
  document.body.appendChild(footer);
}

// ── Dropdown-Logik ───────────────────────────────────────
function initOverlay() {
  const dropBtn = document.getElementById("dropBtn");
  const dropContent = document.getElementById("dropcontent");
  const topbar = document.getElementById("topbar");
  const overlayEl = document.getElementById("overlay");

  if (!dropBtn || !dropContent || !topbar || !overlayEl) return;

  function openDropdown() {
    dropContent.classList.add("open");
    overlayEl.classList.add("open");
    document.body.classList.add("dimmed");
  }

  function closeDropdown() {
    dropContent.classList.remove("open");
    overlayEl.classList.remove("open");
    document.body.classList.remove("dimmed");
  }

  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropContent.classList.contains("open") ? closeDropdown() : openDropdown();
  });

  document.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
      closeDropdown();
    
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createOverlay();
  initOverlay();
});
