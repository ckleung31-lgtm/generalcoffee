// ========================================
// Green Door Coffee
// universal.js - 通用沖煮指南
// 含 Bypass 選項「清澈甜感」
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
  let bypassAmount = 0;

  // 烘焙度基礎
  if (roast === "light") { temp = 93; grind = "中細 · Medium-Fine"; }
  else if (roast === "dark") { temp = 88; grind = "中粗 · Medium-Coarse"; }
  else { temp = 92; grind = "中 · Medium"; }

  // 風味調性調整
  if (flavor === "floral") { temp += 1; ratio = "1:16.5"; if (grind === "中 · Medium") grind = "中細 · Medium-Fine"; }
  else if (flavor === "rich") { temp -= 1; ratio = "1:15"; if (grind === "中 · Medium") grind = "中粗 · Medium-Coarse"; }

  // 沖煮哲學（含 Bypass）
  if (philosophy === "clean") {
    flowStyle = "低擾動、中心注水 · Low agitation, center pour";
    pours = [
      { title: "悶蒸 · Bloom", amount: "50ml", timing: "0:00 – 0:40", note: "緩慢中心注水，避免擾動" },
      { title: "主萃取 · Main Extraction", amount: "120ml", timing: "0:40 – 1:20", note: "穩定中心注水，維持濾床平穩" },
      { title: "收尾 · Finishing Pour", amount: "100ml", timing: "1:20 – 2:00", note: "低水位注水，避免尾段澀味" }
    ];
    bypassAmount = 0;
  }
  else if (philosophy === "heavy") {
    flowStyle = "高攪動、多段注水 · High agitation, multi-pour";
    pours = [
      { title: "悶蒸 · Bloom", amount: "40ml", timing: "0:00 – 0:30", note: "快速均勻悶蒸" },
      { title: "第一注 · First Pour", amount: "100ml", timing: "0:30 – 1:00", note: "強力注水，攪動粉層" },
      { title: "第二注 · Second Pour", amount: "100ml", timing: "1:00 – 1:30", note: "中段攪動" },
      { title: "收尾 · Finishing Pour", amount: "80ml", timing: "1:30 – 2:00", note: "溫柔注水，避免苦澀" }
    ];
    bypassAmount = 0;
  }
  else if (philosophy === "clarity-sweet") {
    // Bypass 選項：幼研磨 + 低擾動 + bypass
    if (roast === "light") temp = 94;
    else if (roast === "medium") temp = 93;
    else temp = 90;
    grind = "細 · Fine (比正常幼半格)";
    ratio = "1:16.5";
    flowStyle = "低擾動、中心注水 + Bypass · Low agitation, center pour + Bypass";
    pours = [
      { title: "悶蒸 · Bloom", amount: "50ml", timing: "0:00 – 0:35", note: "緩慢中心注水" },
      { title: "主萃取 · Main Extraction", amount: "120ml", timing: "0:35 – 1:10", note: "穩定中心注水，保持低擾動" },
      { title: "收尾 · Finishing Pour", amount: "80ml", timing: "1:10 – 1:30", note: "最後通過粉床嘅水" }
    ];
    bypassAmount = 30;
  }
  else { // balanced
    flowStyle = "中度攪動、螺旋注水 · Medium agitation, spiral pour";
    pours = [
      { title: "悶蒸 · Bloom", amount: "50ml", timing: "0:00 – 0:35", note: "均勻浸濕所有粉層" },
      { title: "主萃取 · Main Extraction", amount: "150ml", timing: "0:35 – 1:10", note: "螺旋注水，中度擾動" },
      { title: "收尾 · Finishing Pour", amount: "100ml", timing: "1:10 – 1:45", note: "減低擾動，避免過萃" }
    ];
    bypassAmount = 0;
  }

  temp = Math.min(Math.max(temp, 85), 94);
  return { temp, ratio, grind, flowStyle, pours, bypassAmount };
}

function getDescriptiveConcept(roast, flavor, philosophy) {
  if (philosophy === "clarity-sweet") {
    return "☕ 幼研磨 + 低擾動 + Bypass 溝水 — 突出高甜度、極致清晰度、乾淨收尾。";
  }
  if (roast === "light" && flavor === "floral" && philosophy === "clean") {
    return "☕ 低擾動、透徹茶感、突出細緻花果香氣與明亮酸質。";
  }
  if (roast === "light" && flavor === "floral" && philosophy === "balanced") {
    return "☕ 保留清晰度，同時提升甜感與圓潤度，平衡花香與醇厚感。";
  }
  if (roast === "medium" && flavor === "balanced" && philosophy === "balanced") {
    return "☕ 甜感、醇厚度兼顧，萃取均勻，適合日常輕鬆沖煮。";
  }
  if (roast === "medium" && flavor === "rich" && philosophy === "heavy") {
    return "☕ 較高萃取率、糖漿口感、風味飽滿，適合喜愛濃郁風味者。";
  }
  if (roast === "dark" && flavor === "rich" && philosophy === "heavy") {
    return "☕ 厚重、低苦、高甜，營造飽滿口感與強烈風味層次。";
  }
  if (roast === "dark" && flavor === "balanced" && philosophy === "balanced") {
    return "☕ 保持深焙甜感，同時避免過苦，平衡易飲。";
  }
  return "☕ 結合清晰度、甜感與醇厚度，屬於現代通用沖煮思維。";
}

function getExplanationText(roast, flavor, philosophy, params) {
  const roastNames = { light: "淺焙", medium: "中焙", dark: "深焙" };
  const flavorNames = { floral: "花香果酸", balanced: "平衡甜感", rich: "醇厚濃郁" };
  const philosophyNames = {
    clean: "乾淨透徹",
    balanced: "平衡圓潤",
    heavy: "濃郁厚重",
    "clarity-sweet": "清澈甜感 (Bypass)"
  };

  const concept = getDescriptiveConcept(roast, flavor, philosophy);

  let base = `你選擇嘅係 ${roastNames[roast]} · ${flavorNames[flavor]} · ${philosophyNames[philosophy]}。<br>
  水溫 ${params.temp}°C，粉水比 ${params.ratio}，研磨度 ${params.grind}，注水方式：${params.flowStyle}。`;

  // Bypass 特別解說
  if (philosophy === "clarity-sweet") {
    base += `<br><br>💡 <strong>咩係 Bypass？</strong><br>
    Bypass 即係「溝水」。沖煮最後階段，直接加 ${params.bypassAmount}ml 純水落萃取完嘅咖啡液度，而唔經咖啡粉。<br><br>
    <strong>作用</strong>：幼研磨可以萃取更多甜味，但同時會產生細粉。Bypass 可以喺保持高甜度嘅同時，避免細粉過萃帶嚟嘅苦澀，令杯咖啡更清澈、更甜。<br><br>
    <strong>適合</strong>：追求極致清晰度、花香、果酸、高甜感嘅用家。Body 會薄少少，但風線好乾淨。<br><br>
    <strong>點樣做</strong>：完成最後一次注水並等水流完後，直接將 ${params.bypassAmount}ml 嘅純水（建議用沖煮用嘅熱水）倒入咖啡液中，輕輕攪拌即可。`;
  }
  // 原有解說
  else if (roast === "light" && flavor === "floral" && philosophy === "clean") {
    base += " 淺焙豆需要較高水溫萃取花果香，低擾動中心注水可保留細膩香氣。💡 建議 V60 或 Origami，水壺貼近水面。";
  } else if (roast === "medium" && flavor === "balanced" && philosophy === "balanced") {
    base += " 中焙豆甜度最高，中等水溫配合螺旋注水，萃取均勻、口感圓潤。💡 適合 Kalita Wave 或蛋糕濾紙。";
  } else if (roast === "dark" && flavor === "rich" && philosophy === "heavy") {
    base += " 深焙豆結構鬆散，低水溫避免苦澀，高攪動多段注水營造糖漿口感。💡 建議 Chemex 或 Kono，粗研磨分段萃取。";
  } else {
    base += " 沖煮時請保持水流穩定，可按實際口感微調研磨度。";
  }

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

  // 如果有 bypass，顯示額外步驟
  const bypassHTML = params.bypassAmount > 0 ? `
    <div class="pour-step" style="background: #e8efe2;">
      <div class="pour-title">✨ Bypass 溝水 · Bypass</div>
      <div class="pour-detail">
        加入 ${params.bypassAmount}ml 純水 · Add ${params.bypassAmount}ml clean water
        <br><br>
        直接倒入咖啡液中，輕輕攪拌均勻。
      </div>
    </div>
  ` : "";

  const roastDisp = { light:"淺焙 · Light", medium:"中焙 · Medium", dark:"深焙 · Dark" }[currentRoast];
  const flavorDisp = { floral:"花香果酸 · Floral/Fruity", balanced:"平衡甜感 · Balanced", rich:"醇厚濃郁 · Rich/Chocolatey" }[currentFlavor];
  const philosophyDisp = {
    clean:"乾淨透徹 · Clean",
    balanced:"平衡圓潤 · Balanced",
    heavy:"濃郁厚重 · Heavy",
    "clarity-sweet":"清澈甜感 · Clean & Sweet (Bypass)"
  }[currentPhilosophy];

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
      ${bypassHTML}
    </div>
    <div class="result-section">
      <div class="section-title">📖 沖煮解說 · Brewing Notes</div>
      <div class="analysis">${explanation}</div>
    </div>
  `;

  resultPlaceholder.style.display = "none";
  resultDiv.style.display = "block";
}