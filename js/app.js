/* ------------------------------------------------------------
   HF LAB — FULL APP.JS (COMPLETE WORKING VERSION)
------------------------------------------------------------ */

/* ------------------------------------------------------------
   POPULATE ANTENNA TYPE DROPDOWN
------------------------------------------------------------ */

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

/* ------------------------------------------------------------
   CALCULATE BUTTON HANDLER
------------------------------------------------------------ */

document.getElementById("calculate_btn").addEventListener("click", calculateERP);

/* ------------------------------------------------------------
   ERP CALCULATION ENGINE
------------------------------------------------------------ */

function calculateERP() {

  // Read inputs
  const bandMHz = parseFloat(document.getElementById("band_select").value);
  const txPower = parseFloat(document.getElementById("tx_power").value);
  const antennaGain = parseFloat(document.getElementById("antenna_gain").value);
  const coaxLoss = parseFloat(document.getElementById("coax_loss").value);

  // Basic ERP formula:
  // ERP(W) = TX Power × 10^((Gain - Loss)/10)

  const erpWatts = txPower * Math.pow(10, (antennaGain - coaxLoss) / 10);
  const erpDbw = 10 * Math.log10(erpWatts);
  const erpDbm = erpDbw + 30;

  // Update ERP Summary Panel
  document.getElementById("erp_band").textContent = `${bandMHz} MHz`;
  document.getElementById("erp_w").textContent = erpWatts.toFixed(2);
  document.getElementById("erp_dbw").textContent = erpDbw.toFixed(2);
  document.getElementById("erp_dbm").textContent = erpDbm.toFixed(2);

  // Update Cut Lengths (Quarter‑wave)
  updateCutLengths(bandMHz);
}

/* ------------------------------------------------------------
   CUT LENGTH CALCULATOR
------------------------------------------------------------ */

function updateCutLengths(bandMHz) {

  // Quarter‑wave formula:
  // Length (meters) = 71.5 / frequency(MHz)

  const bands = {
    "80m": 3.5,
    "40m": 7.0,
    "20m": 14.0,
    "15m": 21.0,
    "10m": 28.0,
    "6m": 50.0
  };

  Object.keys(bands).forEach(band => {
    const freq = bands[band];
    const lengthMeters = 71.5 / freq;
    document.getElementById(`cut_${band}`).textContent = `${lengthMeters.toFixed(2)} m`;
  });
}
