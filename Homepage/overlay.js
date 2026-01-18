//Overlay der Website

function createOverlay() {
	document.addEventListener("DOMContentLoaded", () => {
		const base = document.createElement("base");

		// Prüfen, ob GitHub Pages
		if (location.hostname.includes("github.io")) {
			base.href = "/Lehrpfad-JSG"; // Root auf GitHub Pages
		} else {
			base.href = ""; // lokal, relativ zum aktuellen Ordner
		}

		// Base-Tag ganz vorne in <head> einfügen
		const head = document.querySelector("head");
		head.prepend(base);
	});

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
	homeBtn.href = "/Homepage/";
	homeBtn.textContent = "Home";

	left.appendChild(nav);
	left.appendChild(homeBtn);

	const controls = document.createElement("div");
	controls.className = "controls";

	if (header.classList.contains("withUnlock")) {
		const unlockBtn = document.createElement("a");
		unlockBtn.className = "btn";
		unlockBtn.href = "/QuizSeite/index.html?loadOnlyQuizData=true";
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
			href: "/Homepage/Informationen/",
			text: "Informationen",
		},
		stationen: {
			href: "/Homepage/Stationen/",
			text: "Zu den Stationen",
		},
		mitwirkende: {
			href: "/Homepage/#mentions",
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
			href: "/Homepage/",
			id: "home",
		},
		info: {
			href: "/Homepage/Informationen/",
			id: "info",
		},
		member: {
			href: "/Homepage/#member",
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
});
