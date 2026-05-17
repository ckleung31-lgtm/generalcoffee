// toggle Karvonen
document.getElementById("method").addEventListener("change", function () {
  document.getElementById("karvonenBox").style.display =
    this.value === "karvonen" ? "block" : "none";
});

// helpers
function paceToSec(p) {
  let [m, s] = p.split(":").map(Number);
  return m * 60 + s;
}

function secToPace(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  if (s < 10) s = "0" + s;
  return m + ":" + s;
}

function formatTime(sec) {
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  let s = sec % 60;

  if (s < 10) s = "0" + s;
  if (m < 10 && h > 0) m = "0" + m;

  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

// HR zones
function getHRZones(age, method, maxHrInput, restHr) {
  let maxHR = method === "basic" ? 220 - age : Number(maxHrInput);

  function calc(p) {
    if (method === "basic") return Math.round(maxHR * p);
    return Math.round(restHr + (maxHR - restHr) * p);
  }

  return {
    z1: [calc(0.50), calc(0.60)],
    z2: [calc(0.60), calc(0.70)],
    z3: [calc(0.70), calc(0.80)],
    z4: [calc(0.80), calc(0.90)],
    z5: [calc(0.90), calc(1.00)]
  };
}

// pace zones
function getPaceZones(baseSec, hr) {
  return [
    { name: "Recovery", pace: secToPace(baseSec + 75), hr: hr.z1 },
    { name: "Easy", pace: secToPace(baseSec + 60), hr: hr.z2 },
    { name: "Long", pace: secToPace(baseSec + 30), hr: hr.z2 },
    { name: "Tempo", pace: secToPace(baseSec - 10), hr: hr.z4 },
    { name: "Interval", pace: secToPace(baseSec - 40), hr: hr.z5 }
  ];
}

// race prediction
function predictFromTempo(tempoSec) {
  function riegel(t1, d1, d2) {
    return t1 * Math.pow(d2 / d1, 1.06);
  }

  let base10K = tempoSec * 10;

  return {
    "5K": riegel(base10K, 10, 5),
    "10K": base10K,
    "HM": riegel(base10K, 10, 21.1),
    "FM": riegel(base10K, 10, 42.2)
  };
}

// mileage adjustment
function adjustForMileage(time, mileage, distance) {
  if (distance === "5K" || distance === "10K") return time;

  if (mileage < 40) return time * 1.10;
  if (mileage < 60) return time * 1.05;
  if (mileage < 80) return time * 1.02;

  return time;
}

// plan generator
function generatePlan(pz, goal, weeks) {
  let plan = [];

  let baseLong =
    goal === "FM" ? 16 :
    goal === "HM" ? 12 :
    goal === "10K" ? 8 :
    6;

  let intervalTypes = [
    "400m x 6",
    "400m x 8",
    "800m x 5",
    "1k x 5"
  ];

  for (let w = 0; w < weeks; w++) {
    let longRun = Math.round(baseLong + w * 1.5);
    let interval = intervalTypes[w % intervalTypes.length];

    plan.push({
      week: w + 1,
      days: [
        { day: "Mon", type: "Rest" },
        {
          day: "Tue",
          type: "Interval",
          detail: `WU 10min → ${interval} @ ${pz[4].pace} → CD 10min`
        },
        {
          day: "Wed",
          type: "Recovery",
          detail: `30min @ ${pz[0].pace}`
        },
        {
          day: "Thu",
          type: "Tempo",
          detail: `WU 10min → 20min @ ${pz[3].pace} → CD 10min`
        },
        { day: "Fri", type: "Rest" },
        {
          day: "Sat",
          type: "Easy",
          detail: `45min @ ${pz[1].pace}`
        },
        {
          day: "Sun",
          type: "Long",
          detail: `${longRun} km @ ${pz[2].pace}`
        }
      ]
    });
  }

  return plan;
}

function getRecommendedWeeks(goal) {
  if (goal === "5K") return "建議 6–8 週";
  if (goal === "10K") return "建議 8–10 週";
  if (goal === "HM") return "建議 10–14 週";
  if (goal === "FM") return "建議 12–16 週";
}

document.getElementById("goal").addEventListener("change", function () {
  let goal = this.value;
  document.getElementById("weeksHint").innerText =
    getRecommendedWeeks(goal);
});

document.getElementById("weeksHint").innerText =
  getRecommendedWeeks(document.getElementById("goal").value);

  function autoFillWeeks(goal) {
  if (goal === "5K") return 8;
  if (goal === "10K") return 10;
  if (goal === "HM") return 12;
  if (goal === "FM") return 16;
}

document.getElementById("goal").addEventListener("change", function () {
  let goal = this.value;

  document.getElementById("weeksHint").innerText =
    getRecommendedWeeks(goal);

  document.getElementById("weeks").value =
    autoFillWeeks(goal);
});

// render plan
function renderPlan(plan) {
  let html = "";

  plan.forEach(w => {
    html += `<h4>Week ${w.week}</h4>`;
    html += `<table border="1" cellpadding="5">
      <tr><th>Day</th><th>Type</th><th>Workout</th></tr>`;

    w.days.forEach(d => {
      html += `
        <tr>
          <td>${d.day}</td>
          <td>${d.type}</td>
          <td>${d.detail || "-"}</td>
        </tr>
      `;
    });

    html += "</table><br>";
  });

  return html;
}

// MAIN
function calculate() {
  let mileage = Number(document.getElementById("mileage").value);
  let age = Number(document.getElementById("age").value);
  let pace = document.getElementById("pace").value;
  let method = document.getElementById("method").value;
  let maxHr = document.getElementById("maxHr").value;
  let restHr = Number(document.getElementById("restHr").value);

  let goal = document.getElementById("goal").value;
  let weeks = Number(document.getElementById("weeks").value || 8);

  if (!/^[0-9]+:[0-5][0-9]$/.test(pace)) {
    alert("配速格式錯誤");
    return;
  }

  if (method === "karvonen" && (!maxHr || !restHr)) {
    alert("請輸入 Max HR + Rest HR");
    return;
  }

  let baseSec = paceToSec(pace);

  let hr = getHRZones(age, method, maxHr, restHr);
  let pz = getPaceZones(baseSec, hr);

  let tempoSec = baseSec - 10;
  let rawRace = predictFromTempo(tempoSec);

  let race = {
    "5K": rawRace["5K"],
    "10K": rawRace["10K"],
    "HM": adjustForMileage(rawRace["HM"], mileage, "HM"),
    "FM": adjustForMileage(rawRace["FM"], mileage, "FM")
  };

  // tables
  let hrTable = `
    <table border="1">
    <tr><th>Zone</th><th>HR</th></tr>
    <tr><td>Z1</td><td>${hr.z1.join(" - ")}</td></tr>
    <tr><td>Z2</td><td>${hr.z2.join(" - ")}</td></tr>
    <tr><td>Z3</td><td>${hr.z3.join(" - ")}</td></tr>
    <tr><td>Z4</td><td>${hr.z4.join(" - ")}</td></tr>
    <tr><td>Z5</td><td>${hr.z5.join(" - ")}</td></tr>
    </table>
  `;

  let paceTable = `
    <table border="1">
    <tr><th>Type</th><th>Pace</th><th>HR</th></tr>
  `;

  pz.forEach(z => {
    paceTable += `
      <tr>
        <td>${z.name}</td>
        <td>${z.pace}</td>
        <td>${z.hr.join(" - ")}</td>
      </tr>
    `;
  });

  paceTable += "</table>";

  let raceTable = `
    <table border="1">
    <tr><th>Distance</th><th>Time</th></tr>
    <tr><td>5K</td><td>${formatTime(Math.round(race["5K"]))}</td></tr>
    <tr><td>10K</td><td>${formatTime(Math.round(race["10K"]))}</td></tr>
    <tr><td>HM</td><td>${formatTime(Math.round(race["HM"]))}</td></tr>
    <tr><td>FM</td><td>${formatTime(Math.round(race["FM"]))}</td></tr>
    </table>
  `;

  let plan = generatePlan(pz, goal, weeks);
  let planHTML = renderPlan(plan);

  document.getElementById("result").innerHTML = `
    <h3>❤️ HR Zones</h3>${hrTable}<br>
    <h3>⚡ Pace Zones</h3>${paceTable}<br>
    <h3>🏁 Race Prediction</h3>${raceTable}<br>
    <h3>📅 Training Plan (${weeks} weeks)</h3>${planHTML}
  `;
}