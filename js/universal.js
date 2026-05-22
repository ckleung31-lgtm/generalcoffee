// ========================================
// Green Door Coffee
// universal.js - 通用沖煮指南
// 包含：烘焙度、風味調性、沖煮哲學
// 自動更新＋理念解說＋計算機 CTA
// ========================================

let roastSelect, flavorSelect, philosophySelect, resultDiv, resultPlaceholder;
let currentRoast = "medium", currentFlavor = "balanced", currentPhilosophy = "balanced";

document.addEventListener("DOMContentLoaded", () => {
  roastSelect = document.getElementById("roastSelect");
  flavorSelect = document.getElementById("flavorSelect");
  philosophySelect = document.getElementById("philosophySelect");
  resultDiv = document.getElementById("result");
  resultPlaceholder = document.getElementById("resultPlaceholder");

  if (roastSelect && flavorSelect && philosophySelect) {
    currentRoast = roastSelect.value;
    currentFlavor = flavorSelect.value;
    currentPhilosophy = philosophySelect.value;
    updateRecipe();

    roastSelect.addEventListener("change", () => {
      currentRoast = roastSelect.value;
      updateRecipe();
    });
    flavorSelect.addEventListener("change", () => {
      currentFlavor = flavorSelect.value;
      updateRecipe();
    });
    philosophySelect.addEventListener("change", () => {
      currentPhilosophy = philosophySelect.value;
      updateRecipe();
    });
  } else {
    console.error("Missing required select elements");
  }
});

function getRecipeParams(roast, flavor, philosophy) {
  let temp = 92, ratio = "1:15.5", grind = "中 · Medium", flowStyle = "平衡注水 · Balanced pour";
  let pours = [];

  if (roast === "light") { temp = 93; grind = "中細 · Medium-Fine"; }
  else if (roast === "dark") { temp = 88; grind = "中粗 · Medium-Coarse"; }
  else { temp = 92; grind = "中 · Medium"; }

  if (flavor === "floral") { temp += 1; ratio = "1:16.5"; if (grind === "中 · Medium") grind = "中細 · Medium-Fine"; }
  else if (flavor === "rich") { temp -= 1; ratio = "1:15"; if (grind === "中 · Medium") grind = "中粗 · Medium-Coarse"; }

  if (philosophy === "clean") flowStyle = "低擾動、中心注水 · Low agitation, center pour";
  else if (philosophy === "heavy") flowStyle = "高攪動、多段注水 · High agitation, multi-pour";
  else flowStyle = "中度攪動、螺旋注水 · Medium agitation, spiral pour";

  if (philosophy === "clean") {
    pours = [
      { title: "悶蒸 · Bloom", amount: "50ml", timing: "0:00 – 0:40", note: "緩慢中心注水，避免擾動" },
      { title: "主萃取 · Main Extraction", amount: "120ml", timing: "0:40 – 1:20", note: "穩定中心注水，維持濾床平穩" },
      { title: "收尾 · Finishing Pour", amount: "100ml", timing: "1:20 – 2:00", note: "低水位注水，避免尾段澀味" }
    ];
  } else if (philosophy === "heavy") {
    pours = [
      { title: "悶蒸 · Bloom", amount: "40ml", timing: "0:00 – 0:30", note: "快速均勻悶蒸" },
      { title: "第一注 · First Pour", amount: "100ml", timing: "0:30 – 1:00", note: "強力注水，攪動粉層" },
      { title: "第二注 · Second Pour", amount: "100ml", timing: "1:00 – 1:30", note: "中段攪動" },
      { title: "收尾 · Finishing Pour", amount: "80ml", timing: "1:30 – 2:00", note: "溫柔注水，避免苦澀" }
    ];
  } else {
    pours = [
      { title: "悶蒸 · Bloom", amount: "50ml", timing: "0:00 – 0:35", note: "均勻浸濕所有粉層" },
      { title: "主萃取 · Main Extraction", amount: "150ml", timing: "0:35 – 1:10", note: "螺旋注水，中度擾動" },
      { title: "收尾 · Finishing Pour", amount: "100ml", timing: "1:10 – 1:45", note: "減低擾動，避免過萃" }
    ];
  }

  temp = Math.min(Math.max(temp, 85), 94);
  return { temp, ratio, grind, flowStyle, pours };
}

function getStyleConcept(roast, flavor, philosophy) {
  const isLight = roast === "light", isClean = philosophy === "clean";
  const isBalanced = philosophy === "balanced", isHeavy = philosophy === "heavy";
  if (isLight && flavor === "floral" && isClean) return "☕ 理念：日系乾淨感 — 低擾動、透徹茶感、突出細緻花香與明亮酸質。";
  if (isLight && flavor === "floral" && isBalanced) return "☕ 理念：北歐高萃取混合日系思維 — 保留清晰度，同時提升甜感與圓潤度。";
  if (roast === "medium" && flavor === "balanced" && isBalanced) return "☕ 理念：Café 平衡耐飲＋Hybrid Modern — 甜感、醇厚度兼顧，適合日常輕鬆沖煮。";
  if (roast === "medium" && flavor === "rich" && isHeavy) return "☕ 理念：北歐高萃取厚實版 — 較高萃取率、糖漿口感、風味飽滿。";
  if (roast === "dark" && flavor === "rich" && isHeavy) return "☕ 理念：濃郁競技風格 — 厚重、低苦、高甜，類似 competition 爆發型沖煮。";
  if (roast === "dark" && flavor === "balanced" && isBalanced) return "☕ 理念：改良式 Café 風格 — 保持深焙甜感，同時避免過苦，平衡易飲。";
  return "☕ 理念：根據你嘅選擇，結合清晰度、甜感與醇厚度，屬於現代通用沖煮思維。";
}

function getExplanationText(roast, flavor, philosophy, params) {
  const roastNames = { light: "淺焙", medium: "中焙", dark: "深焙" };
  const flavorNames = { floral: "花香果酸", balanced: "平衡甜感", rich: "醇厚濃郁" };
  const philosophyNames = { clean: "乾淨透徹", balanced: "平衡圓潤", heavy: "濃郁厚重" };
  const concept = getStyleConcept(roast, flavor, philosophy);
  let base = `你選擇嘅係 ${roastNames[roast]} · ${flavorNames[flavor]} · ${philosophyNames[philosophy]}。<br>
  水溫 ${params.temp}°C，粉水比 ${params.ratio}，研磨度 ${params.grind}，注水方式：${params.flowStyle}。`;
  if (roast === "light" && flavor === "floral" && philosophy === "clean")
    base += " 淺焙豆需要較高水溫萃取花果香，低擾動中心注水可保留 delicate 香氣。💡 建議 V60 或 Origami，水壺貼近水面。";
  else if (roast === "medium" && flavor === "balanced" && philosophy === "balanced")
    base += " 中焙豆甜度最高，中等水溫配合螺旋注水，萃取均勻、口感圓潤。💡 適合 Kalita Wave 或蛋糕濾紙。";
  else if (roast === "dark" && flavor === "rich" && philosophy === "heavy")
    base += " 深焙豆結構鬆散，低水溫避免苦澀，高攪動多段注水營造糖漿口感。💡 建議 Chemex 或 Kono，粗研磨分段萃取。";
  else
    base += " 沖煮時請保持水流穩定，可按實際口感微調研磨度。";
  return `${concept}<br><br>📖 ${base}`;
}

function updateRecipe() {
  if (!resultDiv || !resultPlaceholder) return;
  const params = getRecipeParams(currentRoast, currentFlavor, currentPhilosophy);
  const explanation = getExplanationText(currentRoast, currentFlavor, currentPhilosophy, params);
  const poursHTML = params.pours.map(p => `
    <div class="pour-step">
      <div class="pour-title">${p.title}</div>
      <div class="pour-detail">${p.amount} · ${p.timing}<br><br>${p.note}</div>
    </div>
  `).join("");
  const roastDisp = { light:"淺焙 · Light", medium:"中焙 · Medium", dark:"深焙 · Dark" }[currentRoast];
  const flavorDisp = { floral:"花香果酸 · Floral/Fruity", balanced:"平衡甜感 · Balanced", rich:"醇厚濃郁 · Rich/Chocolatey" }[currentFlavor];
  const philosophyDisp = { clean:"乾淨透徹 · Clean", balanced:"平衡圓潤 · Balanced", heavy:"濃郁厚重 · Heavy" }[currentPhilosophy];

  resultDiv.innerHTML = `
    <div class="result-section">
      <div class="coffee-name">☕ 通用沖煮建議</div>
      <div class="coffee-meta">${roastDisp} · ${flavorDisp} · ${philosophyDisp}</div>
    </div>
    <div class="result-section">
      <div class="section-title">沖煮參數 · Brewing Recipe</div>
      <div class="recipe-grid">
        <div class="recipe-item"><h3>水溫 · Water Temperature</h3><p>${params.temp}°C</p></div>
        <div class="recipe-item"><h3>粉水比 · Brew Ratio</h3><p>${params.ratio}</p></div>
        <div class="recipe-item"><h3>研磨度 · Grind Size</h3><p>${params.grind}</p></div>
        <div class="recipe-item"><h3>注水方式 · Flow Style</h3><p>${params.flowStyle}</p></div>
      </div>
    </div>
    <div class="result-section">
      <div class="section-title">注水結構 · Pour Structure</div>
      ${poursHTML}
    </div>
    <div class="result-section">
      <div class="section-title">📖 沖煮解說 · Brewing Notes</div>
      <div class="analysis">${explanation}</div>
    </div>
  `;
  resultPlaceholder.style.display = "none";
  resultDiv.style.display = "block";
}