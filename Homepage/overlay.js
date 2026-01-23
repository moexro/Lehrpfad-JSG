//Overlay der Website

function createOverlay() {
  let basehref = "";
  if (location.hostname.includes("github.io")) {
    basehref = "/Lehrpfad-JSG/"; // GitHub Pages Root
  } else {
    basehref = "/";
  }

  const header = document.getElementById("topbar");
  if (!header) return;
  //linke Seite
  const left = document.createElement("div");
  left.className = "left";

  const nav = document.createElement("nav");
  nav.className = "dropdown-menu";

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.id = "dropdown";

  const icon = document.createElement("div");
  icon.className = "icon dropbtn";
  icon.id = "dropBtn";

  dropdown.appendChild(icon);
  nav.appendChild(dropdown);

  const homeBtn = document.createElement("a");
  homeBtn.className = "btn";
  homeBtn.id = "homebtn";
  homeBtn.href = basehref + "Homepage/index.html";
  homeBtn.textContent = "Home";

  left.appendChild(nav);
  left.appendChild(homeBtn);

  const controls = document.createElement("div");
  controls.className = "controls";

  if (header.classList.contains("withUnlock")) {
    const unlockBtn = document.createElement("a");
    unlockBtn.className = "btn";
    unlockBtn.href = basehref + "QuizSeite/index.html?loadOnlyQuizData=true";
    unlockBtn.textContent = "Unlock";
    controls.appendChild(unlockBtn);
  }

  header.appendChild(left);
  header.appendChild(controls);

  //Dropcontent
  const main = document.getElementById("main");
  const dropcontent = document.createElement("ul");
  dropcontent.classList.add("dropcontent");
  dropcontent.classList.add("second-container");
  dropcontent.id = "dropcontent";

  const buttons = {
    homepage: {
      href: "https://www.jsg-karlstadt.de",
      text: "JSG-Homepage",
    },
    information: {
      href: basehref + "Homepage/Informationen/index.html",
      text: "Informationen",
    },
    stationen: {
      href: basehref + "Homepage/Stationen/index.html",
      text: "Zu den Stationen",
    },
    mitwirkende: {
      href: basehref + "Homepage/index.html#mentions",
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

  if (main) {
    main.appendChild(dropcontent);
  }

  //Untere Leiste
  const menubarbottom = document.createElement("nav");
  menubarbottom.className = "menubar";
  menubarbottom.id = "bottombar";
  const icons = {
    home: {
      href: basehref + "Homepage/index.html",
      id: "home",
    },
    info: {
      href: basehref + "Homepage/Informationen/index.html",
      id: "info",
    },
    member: {
      href: basehref + "Homepage/index.html#member",
      id: "member",
    },
  };

  Object.values(icons).forEach((e) => {
    const link = document.createElement("a");
    link.className = "icon";
    link.href = e.href;
    link.id = e.id;
    menubarbottom.appendChild(link);
  });

  document.body.appendChild(menubarbottom);

  const footer = document.createElement("footer");
  footer.className = "bar";
  footer.id = "footer";
  document.body.appendChild(footer);
}

//DROPDOWN MENÜ
function overlay() {
  const dropBtn = document.getElementById("dropBtn");
  const dropdown = document.getElementById("dropcontent");
  const topbar = document.getElementById("topbar");
  const overlay = document.getElementById("overlay");
  const menu = document.getElementById("footer");
  const footer = document.getElementById("bottombar");

  // Toggle Dropdown beim Klick
  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
    const isOpen = dropdown.classList.contains("open");

    // Nur den Seiteninhalt abdunkeln

    topbar.style.filter = isOpen ? "brightness(1.5)" : ""; // topbar aufhellen
    footer.style.filter = isOpen ? "brightness(1.5)" : ""; // dropdown aufhellen
    menu.style.filter = isOpen ? "brightness(1.5)" : ""; // dropdown aufhellen
    dropdown.style.filter = isOpen ? "brightness(1.5)" : ""; // dropdown aufhellen

    // page.style.filter = isOpen ? "brightness(0.4)" : "";
    overlay.classList.toggle("open");
    document.body.classList.toggle("dimmed", isOpen); //body::before abdunkeln
  });

  // Klick außerhalb schließt das Dropdown
  document.addEventListener("click", (e) => {
    if (e.target !== dropBtn) {
      dropdown.classList.remove("open");
      overlay.classList.remove("open");

      topbar.style.filter = "";
      dropdown.style.filter = ""; // topbar aufhellen
      footer.style.filter = "";
      menu.style.filter = ""; // dropdown aufhellen

      document.body.classList.remove("dimmed");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createOverlay();
  overlay();
  setBodyBgFromImage(setBodyBgFromBefore());
});

function median(arr) {
  arr.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0
    ? arr[mid]
    : Math.round((arr[mid - 1] + arr[mid]) / 2);
}

function setBodyBgFromBefore() {
  const style = getComputedStyle(document.body, "::before"); // oder direkt body
  const bg =
    style.backgroundImage || getComputedStyle(document.body).backgroundImage;

  if (bg === "none") return;

  // backgroundImage kann mehrere Layer enthalten, durch Komma getrennt
  const layers = bg.split(",");

  for (let layer of layers) {
    layer = layer.trim();
    if (layer.startsWith("url(")) {
      const url = layer.slice(4, -1).replace(/["']/g, "");
      console.log(url);
      return url;
    }
  }
  return null;
}

function setBodyBgFromImage(imgSrc) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgSrc;

  img.onload = () => {
    const sliceHeight = Math.floor(img.height / 32);

    const canvas = document.createElement("canvas");
    

    const ctx = canvas.getContext("2d");
    
    canvas.width  = img.naturalWidth;
    canvas.height = sliceHeight;

		ctx.drawImage(
      img,
      0, 0,
      img.naturalWidth,
      sliceHeight,
      0, 0,
      img.naturalWidth,
      sliceHeight
    );
    

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const rValues = [];
    const gValues = [];
    const bValues = [];

		for (let i = 0; i < data.length; i += 4) {
  		rValues.push(data[i]);
      gValues.push(data[i + 1]);
    	bValues.push(data[i + 2]);
		}
    
    const rMedian = median(rValues);
		const gMedian = median(gValues);
		const bMedian = median(bValues);

		document.body.style.backgroundColor =
  			`rgb(${rMedian}, ${gMedian}, ${bMedian})`;
  	};

  img.onerror = () => {
    console.error("Bild konnte nicht geladen werden");
  };
}