document.addEventListener("DOMContentLoaded", () => {
	const base = document.createElement("base");

	// Prüfen, ob GitHub Pages
	if (location.hostname.includes("github.io")) {
		base.href = "/Lehrpfad-JSG/"; // Root auf GitHub Pages
	} else {
		base.href = "/"; // lokal, relativ zum aktuellen Ordner
	}

	// Base-Tag ganz vorne in <head> einfügen
	const head = document.querySelector("head");
	head.prepend(base);
});