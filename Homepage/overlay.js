//DROPDOWN MENÜ

const dropBtn = document.getElementById("dropBtn");
const dropdown = document.getElementById("dropcontent");
const page = document.getElementById("page");
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