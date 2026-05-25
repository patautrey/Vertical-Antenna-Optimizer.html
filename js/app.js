// --------------------------------------------------
// POPULATE ANTENNA TYPE DROPDOWN
// --------------------------------------------------

const antennaTypes = [
  "1/4 Wave Vertical",
  "Rybakov 25 ft (9:1)",
  "EFHW (End Fed Half Wave)",
  "OCF Dipole",
  "Full Wave Loop",
  "Fan Dipole",
  "J-Pole",
  "Doublet",
  "Yagi (2–5 elements)",
  "Extended Double Zepp",
  "Moxon",
  "Bobtail Curtain"
];

function populateAntennaDropdown() {
  const sel = document.getElementById("antenna_type");
  sel.innerHTML = ""; // clear existing

  antennaTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    sel.appendChild(opt);
  });
}

populateAntennaDropdown();
