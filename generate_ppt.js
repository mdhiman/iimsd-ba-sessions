const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "MBA Analytics Course";
pptx.title = "Data Structures, Algorithms & Machine Learning for Business";

// ══════════════════════════════════════════════════════════════
// COLOR PALETTE & STYLE CONSTANTS
// ══════════════════════════════════════════════════════════════
const C = {
  navy:     "0B1F3F",
  darkBlue: "1A3A5C",
  blue:     "2563EB",
  lightBlue:"3B82F6",
  accent:   "F59E0B", // amber
  green:    "10B981",
  red:      "EF4444",
  purple:   "8B5CF6",
  teal:     "14B8A6",
  white:    "FFFFFF",
  offWhite: "F8FAFC",
  lightGray:"E2E8F0",
  gray:     "64748B",
  darkGray: "334155",
  black:    "0F172A",
  orange:   "F97316",
  gradStart:"0F172A",
  gradEnd:  "1E3A5F",
};

const FONT = {
  title:    "Segoe UI",
  body:     "Segoe UI",
  code:     "Cascadia Code",
  accent:   "Segoe UI Semibold",
};

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function addGradientBg(slide, color1 = C.gradStart, color2 = C.gradEnd) {
  slide.background = { color: color1 };
  // Add decorative accent bar at top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.06,
    fill: { color: C.accent },
  });
}

function addLightBg(slide) {
  slide.background = { color: C.offWhite };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.06,
    fill: { color: C.blue },
  });
  // Side accent
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.06, h: 7.5,
    fill: { color: C.blue },
  });
}

function addSessionDivider(sessionNum, title, subtitle) {
  const slide = pptx.addSlide();
  addGradientBg(slide, "0A1628", "162D50");
  
  // Decorative large number
  slide.addText(`0${sessionNum}`, {
    x: 0.5, y: 0.5, w: 4, h: 3.5,
    fontSize: 150, fontFace: FONT.title, color: "1E3A5F",
    bold: true, transparency: 50,
  });
  
  // Session label
  slide.addText(`SESSION ${sessionNum}`, {
    x: 1, y: 1.8, w: 11, h: 0.6,
    fontSize: 18, fontFace: FONT.accent, color: C.accent,
    bold: true, letterSpacing: 8,
  });
  
  // Title
  slide.addText(title, {
    x: 1, y: 2.6, w: 11, h: 1.4,
    fontSize: 38, fontFace: FONT.title, color: C.white,
    bold: true, lineSpacingMultiple: 1.1,
  });
  
  // Subtitle
  slide.addText(subtitle, {
    x: 1, y: 4.2, w: 9, h: 0.8,
    fontSize: 16, fontFace: FONT.body, color: C.lightBlue,
    italic: true,
  });
  
  // Bottom accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 1, y: 5.3, w: 3, h: 0.04,
    fill: { color: C.accent },
  });
}

function addUseCaseDivider(caseNum, title, company) {
  const slide = pptx.addSlide();
  addGradientBg(slide, "0D1B2A", "1B3A4B");
  
  slide.addText(`INDUSTRIAL USE CASE ${caseNum}`, {
    x: 1, y: 2.0, w: 11, h: 0.5,
    fontSize: 16, fontFace: FONT.accent, color: C.accent,
    bold: true, letterSpacing: 6,
  });
  
  slide.addText(title, {
    x: 1, y: 2.8, w: 11, h: 1.2,
    fontSize: 34, fontFace: FONT.title, color: C.white,
    bold: true,
  });
  
  slide.addText(`Company Reference: ${company}`, {
    x: 1, y: 4.2, w: 6, h: 0.5,
    fontSize: 16, fontFace: FONT.body, color: C.teal,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 1, y: 5.0, w: 2.5, h: 0.04,
    fill: { color: C.teal },
  });
}

function addWowFactSlide(facts, sessionLabel) {
  const slide = pptx.addSlide();
  addGradientBg(slide, "1A0A2E", "2D1B69");
  
  slide.addText("💡 DID YOU KNOW?", {
    x: 0.8, y: 0.4, w: 11, h: 0.6,
    fontSize: 22, fontFace: FONT.accent, color: C.accent,
    bold: true, letterSpacing: 4,
  });
  
  slide.addText(`Fascinating Facts — ${sessionLabel}`, {
    x: 0.8, y: 1.0, w: 11, h: 0.4,
    fontSize: 14, fontFace: FONT.body, color: C.purple,
    italic: true,
  });
  
  let yPos = 1.7;
  facts.forEach((fact, i) => {
    // Icon circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.8, y: yPos + 0.08, w: 0.35, h: 0.35,
      fill: { color: C.purple }, shadow: { type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.3 },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: yPos + 0.08, w: 0.35, h: 0.35,
      fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true,
      align: "center", valign: "middle",
    });
    
    slide.addText(fact, {
      x: 1.4, y: yPos, w: 10.5, h: 0.85,
      fontSize: 14, fontFace: FONT.body, color: C.white,
      lineSpacingMultiple: 1.2, valign: "top",
    });
    yPos += 1.05;
  });
}

function bulletSlide(title, bullets, opts = {}) {
  const slide = pptx.addSlide();
  addLightBg(slide);
  
  // Title
  slide.addText(title, {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 26, fontFace: FONT.title, color: C.navy, bold: true,
  });
  
  // Divider
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.05, w: 2.5, h: 0.035,
    fill: { color: opts.accentColor || C.blue },
  });
  
  const rows = bullets.map(b => {
    if (typeof b === "string") return { text: b, options: { fontSize: 15, fontFace: FONT.body, color: C.darkGray, bullet: { code: "2022", color: opts.accentColor || C.blue }, lineSpacingMultiple: 1.35, paraSpaceBefore: 4, indentLevel: 0 } };
    return b;
  });
  
  slide.addText(rows, {
    x: 0.8, y: 1.3, w: 11.5, h: 5.5,
    valign: "top",
  });
  
  return slide;
}

function twoColumnSlide(title, leftTitle, leftBullets, rightTitle, rightBullets, opts = {}) {
  const slide = pptx.addSlide();
  addLightBg(slide);
  
  slide.addText(title, {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 26, fontFace: FONT.title, color: C.navy, bold: true,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.05, w: 2.5, h: 0.035,
    fill: { color: opts.accentColor || C.blue },
  });
  
  // Left column box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.4, w: 5.8, h: 5.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.08 },
    rectRadius: 0.1,
  });
  
  slide.addText(leftTitle, {
    x: 0.8, y: 1.55, w: 5.2, h: 0.45,
    fontSize: 16, fontFace: FONT.accent, color: opts.accentColor || C.blue, bold: true,
  });
  
  const lRows = leftBullets.map(b => ({
    text: b, options: { fontSize: 13.5, fontFace: FONT.body, color: C.darkGray, bullet: { code: "25B8", color: opts.accentColor || C.blue }, lineSpacingMultiple: 1.3, paraSpaceBefore: 3 }
  }));
  slide.addText(lRows, { x: 0.9, y: 2.1, w: 5.0, h: 4.5, valign: "top" });
  
  // Right column box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.4, w: 5.8, h: 5.5,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.08 },
    rectRadius: 0.1,
  });
  
  slide.addText(rightTitle, {
    x: 7.1, y: 1.55, w: 5.2, h: 0.45,
    fontSize: 16, fontFace: FONT.accent, color: opts.accentColor || C.green, bold: true,
  });
  
  const rRows = rightBullets.map(b => ({
    text: b, options: { fontSize: 13.5, fontFace: FONT.body, color: C.darkGray, bullet: { code: "25B8", color: opts.accentColor || C.green }, lineSpacingMultiple: 1.3, paraSpaceBefore: 3 }
  }));
  slide.addText(rRows, { x: 7.2, y: 2.1, w: 5.0, h: 4.5, valign: "top" });
  
  return slide;
}

function datasetSlide(title, columns, description) {
  const slide = pptx.addSlide();
  addLightBg(slide);
  
  slide.addText(title, {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 24, fontFace: FONT.title, color: C.navy, bold: true,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.05, w: 2.5, h: 0.035,
    fill: { color: C.teal },
  });
  
  if (description) {
    slide.addText(description, {
      x: 0.8, y: 1.3, w: 11, h: 0.6,
      fontSize: 14, fontFace: FONT.body, color: C.gray, italic: true,
    });
  }
  
  // Dataset table
  const headerRow = [{ text: "Column", options: { fontSize: 13, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.darkBlue }, align: "center" } },
                     { text: "Type", options: { fontSize: 13, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.darkBlue }, align: "center" } },
                     { text: "Description", options: { fontSize: 13, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.darkBlue }, align: "center" } }];
  
  const rows = [headerRow];
  columns.forEach((col, i) => {
    const bgColor = i % 2 === 0 ? "F1F5F9" : C.white;
    rows.push([
      { text: col[0], options: { fontSize: 12, fontFace: FONT.code, color: C.navy, fill: { color: bgColor }, align: "left" } },
      { text: col[1], options: { fontSize: 12, fontFace: FONT.body, color: C.gray, fill: { color: bgColor }, align: "center" } },
      { text: col[2], options: { fontSize: 12, fontFace: FONT.body, color: C.darkGray, fill: { color: bgColor }, align: "left" } },
    ]);
  });
  
  slide.addTable(rows, {
    x: 0.8, y: 2.0, w: 11.5,
    colW: [3.0, 2.0, 6.5],
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    rowH: 0.45,
  });
  
  return slide;
}

function jupyterWorkflowSlide(title, tasks) {
  const slide = pptx.addSlide();
  addLightBg(slide);
  
  slide.addText("🔬  " + title, {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 24, fontFace: FONT.title, color: C.navy, bold: true,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.05, w: 2.5, h: 0.035,
    fill: { color: C.green },
  });
  
  slide.addText("Jupyter Notebook Workflow", {
    x: 0.8, y: 1.2, w: 5, h: 0.4,
    fontSize: 14, fontFace: FONT.accent, color: C.green, bold: true,
  });
  
  let yPos = 1.75;
  tasks.forEach((task, i) => {
    // Step number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.8, y: yPos, w: 0.45, h: 0.45,
      fill: { color: C.green },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: yPos, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONT.accent, color: C.white, bold: true,
      align: "center", valign: "middle",
    });
    
    slide.addText(task, {
      x: 1.5, y: yPos + 0.02, w: 10.5, h: 0.43,
      fontSize: 14, fontFace: FONT.body, color: C.darkGray,
      valign: "middle",
    });
    
    // Connector line
    if (i < tasks.length - 1) {
      slide.addShape(pptx.ShapeType.rect, {
        x: 1.0, y: yPos + 0.45, w: 0.03, h: 0.35,
        fill: { color: C.lightGray },
      });
    }
    
    yPos += 0.82;
  });
  
  return slide;
}


// ══════════════════════════════════════════════════════════════
// TITLE SLIDE
// ══════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addGradientBg(slide, "050D1A", "0F2847");
  
  // Decorative circles
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.5, y: -1, w: 4, h: 4,
    fill: { color: C.blue }, transparency: 90,
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: 5, w: 3, h: 3,
    fill: { color: C.accent }, transparency: 92,
  });
  
  slide.addText("DATA STRUCTURES, ALGORITHMS\n& MACHINE LEARNING", {
    x: 1, y: 1.2, w: 11, h: 2.0,
    fontSize: 38, fontFace: FONT.title, color: C.white,
    bold: true, lineSpacingMultiple: 1.15,
  });
  
  slide.addText("FOR STRATEGIC BUSINESS DECISIONS", {
    x: 1, y: 3.2, w: 11, h: 0.7,
    fontSize: 20, fontFace: FONT.accent, color: C.accent,
    bold: true, letterSpacing: 4,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 1, y: 4.2, w: 4, h: 0.04,
    fill: { color: C.accent },
  });
  
  slide.addText("4 Sessions  •  12 Industrial Use Cases  •  Real-World Business Impact", {
    x: 1, y: 4.5, w: 11, h: 0.5,
    fontSize: 15, fontFace: FONT.body, color: C.lightBlue,
  });
  
  });
}

// ══════════════════════════════════════════════════════════════
// AGENDA / OVERVIEW SLIDE
// ══════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addLightBg(slide);
  
  slide.addText("Course Architecture", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 28, fontFace: FONT.title, color: C.navy, bold: true,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.05, w: 2.5, h: 0.035,
    fill: { color: C.blue },
  });
  
  const sessions = [
    { num: "01", title: "Sorting Algorithms &\nBusiness Prioritization", cases: "LinkedIn Feed Ranking\nIPL Auction Player Ranking\nAmazon Product Ranking", color: C.blue },
    { num: "02", title: "Graph Algorithms &\nNetwork Modeling", cases: "Microsoft Supply Chain\nCricket Partnership Network\nGoogle Maps Routing", color: C.teal },
    { num: "03", title: "Customer Segmentation\nUsing ML", cases: "Netflix User Segmentation\nIPL Fan Segmentation\nSpotify Listener Segmentation", color: C.purple },
    { num: "04", title: "Classification &\nOptimization", cases: "Loan Approval Model\nSaaS Churn Prediction\nCredit Card Fraud Detection", color: C.orange },
  ];
  
  sessions.forEach((s, i) => {
    const xPos = 0.5 + i * 3.15;
    // Card background
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.5, w: 2.95, h: 5.6,
      fill: { color: C.white },
      shadow: { type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.08 },
      rectRadius: 0.12,
    });
    // Color top bar
    slide.addShape(pptx.ShapeType.rect, {
      x: xPos, y: 1.5, w: 2.95, h: 0.08,
      fill: { color: s.color },
    });
    // Number
    slide.addText(s.num, {
      x: xPos + 0.2, y: 1.8, w: 1, h: 0.8,
      fontSize: 36, fontFace: FONT.title, color: s.color, bold: true,
    });
    // Session label
    slide.addText(`SESSION ${s.num}`, {
      x: xPos + 0.2, y: 2.6, w: 2.5, h: 0.3,
      fontSize: 10, fontFace: FONT.accent, color: C.gray, letterSpacing: 3,
    });
    // Title
    slide.addText(s.title, {
      x: xPos + 0.2, y: 3.0, w: 2.5, h: 1.1,
      fontSize: 14, fontFace: FONT.accent, color: C.navy, bold: true,
      lineSpacingMultiple: 1.2,
    });
    // Divider
    slide.addShape(pptx.ShapeType.rect, {
      x: xPos + 0.2, y: 4.3, w: 1.5, h: 0.02,
      fill: { color: C.lightGray },
    });
    // Industrial use cases label
    slide.addText("Industrial Use Cases:", {
      x: xPos + 0.2, y: 4.5, w: 2.5, h: 0.3,
      fontSize: 10, fontFace: FONT.accent, color: s.color, bold: true,
    });
    // Cases
    slide.addText(s.cases, {
      x: xPos + 0.2, y: 4.85, w: 2.5, h: 1.6,
      fontSize: 11.5, fontFace: FONT.body, color: C.darkGray,
      lineSpacingMultiple: 1.3,
    });
  });
}

// ══════════════════════════════════════════════════════════════
// SESSION 1: SORTING ALGORITHMS & BUSINESS PRIORITIZATION
// ══════════════════════════════════════════════════════════════
addSessionDivider(1, "Sorting Algorithms &\nBusiness Prioritization Systems", "Selection Sort  •  Insertion Sort  •  QuickSort  •  Business Impact");

// Wow facts slide Session 1
addWowFactSlide([
  "Google processes 8.5 billion searches/day. Each query sorts millions of results in < 200ms. A 1% inefficiency in sort = $50M+ in extra cloud spend annually.",
  "Amazon found that every 100ms of latency costs them 1% in sales — roughly $4.8 billion/year lost if sort algorithms slow down product rankings.",
  "LinkedIn's feed algorithm re-ranks 100K+ candidate posts per user session using a hybrid ML + sort pipeline. The ranking order directly affects $16B in annual ad revenue.",
  "The IPL player auction involves ₹4,000+ Crore ($500M+) in bids decided in under 48 hours — teams use weighted multi-criteria sorting to rank 500+ players in real-time.",
  "QuickSort, invented in 1960 by Tony Hoare, is still the default sort in most programming languages — 65 years later, no general-purpose algorithm consistently beats it."
], "Session 1 — Sorting & Prioritization");

// Core Theory Slide
bulletSlide("Why Sorting Matters in Business Systems", [
  "Sorting = Ranking = Resource Allocation — every business decision involves ordering alternatives",
  "Time Complexity matters at scale: Selection Sort O(n²), Insertion Sort O(n²) but efficient for nearly-sorted data, QuickSort O(n log n) average",
  "Stability: Stable sorts preserve original order for equal elements — critical for multi-key ranking (e.g., sort by score THEN by date)",
  "In-place vs Memory overhead: QuickSort is in-place (saves RAM), MergeSort needs O(n) extra space",
  "Business Impact: Sorting speed directly affects latency, cloud compute costs, user retention, and revenue",
  "At 10M records: O(n²) takes ~100 trillion ops vs O(n log n) at ~230M ops — that's a 400,000x difference",
  "Real-world: Every extra 100ms of latency = 1% sales drop (Amazon), 0.6% fewer searches (Google)",
]);

// Complexity comparison
{
  const slide = pptx.addSlide();
  addLightBg(slide);
  
  slide.addText("Algorithm Complexity: The Business Cost of Bad Sorting", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 24, fontFace: FONT.title, color: C.navy, bold: true,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.05, w: 3, h: 0.035,
    fill: { color: C.blue },
  });
  
  const header = [
    { text: "Algorithm", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
    { text: "Best", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
    { text: "Average", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
    { text: "Worst", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
    { text: "Space", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
    { text: "Stable?", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
    { text: "Best For", options: { fontSize: 14, fontFace: FONT.accent, color: C.white, bold: true, fill: { color: C.navy }, align: "center" } },
  ];
  
  const dataRows = [
    ["Selection Sort", "O(n²)", "O(n²)", "O(n²)", "O(1)", "No", "Small datasets, minimal swaps needed"],
    ["Insertion Sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes", "Nearly sorted data, streaming input"],
    ["QuickSort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No", "General purpose, large datasets"],
    ["MergeSort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes", "Guaranteed performance, linked lists"],
    ["TimSort", "O(n)", "O(n log n)", "O(n log n)", "O(n)", "Yes", "Python/Java default — real-world data"],
  ];
  
  const tableRows = [header];
  dataRows.forEach((row, i) => {
    const bg = i % 2 === 0 ? "F1F5F9" : C.white;
    tableRows.push(row.map((cell, j) => ({
      text: cell,
      options: { fontSize: 12, fontFace: j === 0 ? FONT.accent : FONT.body, color: C.darkGray, fill: { color: bg }, align: j === 0 ? "left" : "center", bold: j === 0 }
    })));
  });
  
  slide.addTable(tableRows, {
    x: 0.4, y: 1.4, w: 12.5,
    colW: [1.8, 1.4, 1.4, 1.4, 1.2, 1.0, 4.3],
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    rowH: 0.55,
  });
  
  // Business insight callout
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 5.0, w: 12.3, h: 1.8,
    fill: { color: "FEF3C7" },
    rectRadius: 0.1,
    shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.06 },
  });
  
  slide.addText("💰 Business Translation", {
    x: 0.8, y: 5.1, w: 4, h: 0.4,
    fontSize: 15, fontFace: FONT.accent, color: C.accent, bold: true,
  });
  
  slide.addText("Sorting 1M e-commerce products: QuickSort ≈ 0.3s vs Selection Sort ≈ 16 minutes. On Azure B2s VM ($0.05/hr), the O(n²) approach costs 53x more. At Netflix scale (247M subscribers), algorithm choice = millions in infrastructure savings.", {
    x: 0.8, y: 5.5, w: 11.5, h: 1.1,
    fontSize: 13, fontFace: FONT.body, color: C.darkGray,
    lineSpacingMultiple: 1.3,
  });
}

// ── INDUSTRIAL USE CASE 2: IPL ──
addUseCaseDivider(2, "IPL Auction Player Ranking", "Indian Premier League (Cricket)");

twoColumnSlide(
  "IPL Auction: ₹4,000 Cr Decisions in 48 Hours",
  "Business Context",
  [
    "Teams rank 500+ players before the mega auction",
    "Total purse per team: ₹100 Crore (~$12M)",
    "Wrong ranking = overpaying by ₹10-30 Cr per player",
    "Multi-criteria problem: performance, form, injury risk, role fit",
    "2024 auction: ₹4,470 Crore spent across 10 teams in 2 days",
    "Mitchell Starc sold for ₹24.75 Cr — highest ever IPL bid",
  ],
  "Input Features for Ranking",
  [
    "Strike Rate: runs per 100 balls (higher = more aggressive)",
    "Batting Average: runs per dismissal (higher = more consistent)",
    "Recent Form Index: weighted avg of last 10 matches",
    "Injury Risk Probability: 0.0-1.0 based on medical history",
    "Role Requirement: opener, middle-order, finisher, bowler",
    "Base Price: minimum bid set by player",
  ],
);

bulletSlide("Analytical Mapping: Multi-Criteria Sorting", [
  "Multi-Criteria Scoring: composite_score = w1×strike_rate + w2×avg + w3×form - w4×injury + role_bonus",
  "Weighted Sort: different team strategies produce different weight vectors",
  "   • Aggressive team: high weight on strike rate → prioritize finishers",
  "   • Conservative team: high weight on average + low injury → prioritize consistency",
  "Sensitivity Analysis: How much does ranking change when weights shift by ±10%?",
  "Budget Constraint Layer: After sorting, apply knapsack-style optimization — maximize total team value within ₹100 Cr budget",
  "Real Impact: In 2023, teams using analytics-driven sorting won 23% more matches than those relying on expert intuition alone",
], { accentColor: C.teal });

datasetSlide("Industrial Use Case 2: Dataset Structure", [
  ["player_name", "string", "Full name of the cricketer"],
  ["strike_rate", "float", "Career T20 strike rate (runs per 100 balls)"],
  ["batting_avg", "float", "Career T20 batting average"],
  ["recent_form_score", "float", "Weighted score from last 10 T20 matches"],
  ["injury_risk", "float", "0.0 (no risk) to 1.0 (very high risk)"],
  ["base_price", "int", "Minimum auction price in ₹ Lakhs"],
  ["role", "category", "opener | middle_order | finisher | bowler | allrounder"],
], "CSV dataset for IPL Auction Player Ranking");

jupyterWorkflowSlide("Jupyter Notebook Tasks — IPL Auction", [
  "Create weighted composite score with configurable weights per team strategy",
  "Sort players by composite score — compare stable vs unstable sort behavior",
  "Implement 3 team strategies: aggressive, balanced, conservative — observe ranking changes",
  "Sensitivity analysis: vary each weight ±10% and measure rank position change",
  "Budget optimization: select optimal squad (11 players) within ₹100 Cr constraint",
  "Visualize: scatter plot of value-for-money (score/price ratio) vs absolute score",
]);

// ── INDUSTRIAL USE CASE 3: Amazon ──
addUseCaseDivider(3, "Amazon Product Search Ranking", "Amazon.com");

twoColumnSlide(
  "Amazon: 8.5 Billion Searches/Day, Every Result Sorted",
  "Business Problem",
  [
    "Amazon processes 8.5B searches/day — each returns sorted product results",
    "Position #1 gets 35% of clicks — ranking directly determines what sells",
    "350M+ products in the marketplace — sorting speed = revenue speed",
    "Every 100ms of latency costs Amazon ~$1.6B/year in lost sales",
    "Challenge: multi-criteria ranking at massive scale in real-time",
  ],
  "Input Features for Ranking",
  [
    "Relevance Score: keyword match with search query",
    "Avg Rating: 1-5 star customer rating",
    "Review Count: social proof signal (log-scaled)",
    "Delivery Speed: Prime 1-day vs 14-day shipping",
    "Return Rate: product quality signal",
    "Seller Rating: marketplace trust metric",
  ],
);

datasetSlide("Industrial Use Case 3: Amazon Product Dataset", [
  ["product_id", "string", "Unique ASIN identifier"],
  ["category", "category", "Electronics | Books | Clothing | Home | Sports | etc."],
  ["avg_rating", "float", "Average customer rating (1-5 stars)"],
  ["num_reviews", "int", "Total number of customer reviews"],
  ["price", "float", "Product price in USD"],
  ["relevance_score", "float", "0.0 to 1.0 — search query match strength"],
  ["delivery_days", "int", "Expected delivery time in days"],
  ["is_prime", "binary", "1 = Prime eligible, 0 = standard"],
  ["return_rate", "float", "Historical return rate (0-0.3)"],
], "1,000 products for Amazon Search Ranking simulation");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Amazon Product Ranking", [
  "Build composite ranking score from relevance, rating, reviews, delivery, return rate",
  "Compare Selection Sort, QuickSort, and TimSort on 1,000 products",
  "Test 3 ranking strategies: Relevance-First, Customer-Trust, Fast-Delivery",
  "Scale simulation: 100 to 5,000 products — measure time per algorithm",
  "Estimate infrastructure cost at Amazon scale (8.5B daily searches)",
  "Analyze: which strategy surfaces the best products for customers?",
]);

// ══════════════════════════════════════════════════════════════
// SESSION 2: GRAPH ALGORITHMS & NETWORK MODELING
// ══════════════════════════════════════════════════════════════
addSessionDivider(2, "Graph Algorithms &\nNetwork Modeling", "Dijkstra  •  BFS / DFS  •  Minimum Spanning Tree  •  Centrality Analysis");

addWowFactSlide([
  "Facebook's social graph contains 3 billion nodes and 200+ billion edges. Finding a friend suggestion requires traversing this graph in < 100ms.",
  "FedEx optimizes 15 million package routes daily using graph shortest-path algorithms — saving $2B+ per year in fuel costs vs naive routing.",
  "Google Maps' Dijkstra-variant processes 1 billion+ km of roads. A 0.1% improvement in pathfinding saved users 100 million hours of driving time in 2023.",
  "In supply chain networks, a single critical-node failure (like the 2021 Suez Canal blockage) caused $9.6 billion/day in global trade losses — graph centrality analysis could have identified this vulnerability.",
  "The \"Six Degrees of Separation\" theory was proven computationally on Facebook: average shortest path between any two users = 3.57 hops."
], "Session 2 — Graphs & Networks");

bulletSlide("Core Theory: Graph Fundamentals", [
  "Nodes (Vertices): entities in the network — people, locations, servers, products",
  "Edges: relationships between nodes — can be directed or undirected",
  "Weighted Graphs: edges carry values — cost, time, risk, capacity",
  "Key Algorithms:",
  "   • Dijkstra: shortest weighted path — optimization of cost/time",
  "   • BFS (Breadth-First Search): level-by-level exploration — nearest neighbor discovery",
  "   • DFS (Depth-First Search): deep exploration — cycle detection, dependency resolution",
  "   • Minimum Spanning Tree (Kruskal/Prim): connect all nodes at minimum total cost",
  "   • Centrality Measures: identify the most influential/critical nodes",
]);

twoColumnSlide(
  "Business Applications of Graph Theory",
  "Industry Applications",
  [
    "Supply Chain: optimize routing, identify single-point-of-failure",
    "Fraud Detection: unusual transaction patterns in payment graphs",
    "Social Networks: influence propagation, community detection",
    "Transport & Logistics: route optimization, fleet management",
    "Cybersecurity: network intrusion path analysis",
    "Recommendation Engines: collaborative filtering via user-item graphs",
  ],
  "Centrality Measures for Business",
  [
    "Degree Centrality: who has the most connections? (popularity)",
    "Betweenness Centrality: who bridges communities? (information broker)",
    "Closeness Centrality: who can reach everyone fastest? (influence speed)",
    "PageRank: who is connected to other important nodes? (authority)",
    "Business implication: removing high-betweenness node = network fragmentation",
    "Risk: a supplier with highest betweenness = biggest vulnerability",
  ],
);

// ── INDUSTRIAL USE CASE 1: Microsoft Supply Chain ──
addUseCaseDivider(1, "Microsoft Global Supply Chain\nNetwork Optimization", "Microsoft Corporation");

twoColumnSlide(
  "Microsoft Supply Chain: A $200B+ Network",
  "Business Problem",
  [
    "Optimize component movement between 30+ factories & 60+ data centers globally",
    "Microsoft's hardware supply chain: Surface, Xbox, Azure servers, HoloLens",
    "Each day: 10,000+ components move across continents",
    "COVID-19 exposed fragility: 64% of companies faced supply disruption in 2021",
    "Goal: minimize cost while maintaining delivery SLAs and managing risk",
  ],
  "Graph Model",
  [
    "Nodes: Supplier → Factory → Warehouse → Data Center",
    "Edge weights: Transport cost ($), Delivery time (days), Risk probability (0-1)",
    "Multi-objective optimization: minimize cost + time while keeping risk below threshold",
    "Node failure scenario: what happens if a key warehouse goes offline?",
    "Real data: Suez Canal blockage added $400/container → changed shortest paths globally",
  ],
);

datasetSlide("Industrial Use Case 1: Supply Chain Dataset", [
  ["source", "string", "Origin node (e.g., 'Supplier_Taiwan_A')"],
  ["destination", "string", "Destination node (e.g., 'Factory_Ireland')"],
  ["cost", "float", "Transport cost per unit in USD"],
  ["delivery_time", "float", "Expected delivery time in days"],
  ["risk_score", "float", "0.0 (safe) to 1.0 (high risk) — geopolitical, weather, capacity"],
  ["capacity", "int", "Maximum units per shipment on this route"],
], "CSV dataset for Microsoft Supply Chain Graph");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Supply Chain Graph", [
  "Build graph using NetworkX: nodes = facilities, edges = transport routes with cost/time/risk weights",
  "Compute shortest path (Dijkstra) optimizing for cost — then separately for time",
  "Calculate Minimum Spanning Tree: what's the minimum-cost network to connect all nodes?",
  "Betweenness centrality: identify the most critical nodes (highest disruption risk)",
  "Simulate node failure: remove top-centrality node → recalculate paths and cost increase",
  "Visualize: interactive graph with node size = centrality, edge width = capacity",
  "Generate disruption report: % cost increase, SLA breach count, affected product lines",
]);

// ── INDUSTRIAL USE CASE 2: Cricket Partnership ──
addUseCaseDivider(2, "Cricket Partnership Network\nAnalysis", "Indian Premier League");

twoColumnSlide(
  "Cricket Partnership Graph: Data-Driven Team Building",
  "Problem Statement",
  [
    "Identify most valuable batting partnerships in T20 cricket",
    "Partnerships = collaborative performance → graph problem",
    "Traditional metric: individual batting average/strike rate",
    "Graph metric: which PAIR of batters creates most value together?",
    "Insight: some players perform 40% better with specific partners",
    "2023 IPL: top partnership generated 534 runs in 12 innings together",
  ],
  "Graph Model",
  [
    "Nodes: Players (with individual stats as node attributes)",
    "Edges: Partnership records (runs scored together, win contribution)",
    "Edge weight: composite of runs_together × win_percentage",
    "Degree Centrality: who partners successfully with the MOST players?",
    "Betweenness: who connects different batting clusters? (versatile batter)",
    "Community Detection: identify natural batting pairs/groups",
  ],
);

datasetSlide("Industrial Use Case 2: Partnership Dataset", [
  ["player_a", "string", "First player in the partnership"],
  ["player_b", "string", "Second player in the partnership"],
  ["runs_together", "int", "Total runs scored while both were batting"],
  ["matches_played", "int", "Number of matches they batted together"],
  ["win_percentage", "float", "Team win % when this pair bats together"],
  ["avg_partnership_sr", "float", "Combined strike rate during partnerships"],
], "CSV dataset for Cricket Partnership Network");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Partnership Network", [
  "Build partnership graph: players as nodes, partnership stats as weighted edges",
  "Compute degree centrality: who is the most versatile partner?",
  "Compute betweenness centrality: who bridges different batting groups?",
  "Identify strongest edges: top-10 most valuable partnerships by weighted score",
  "Compare: popularity (degree) vs actual impact (weighted betweenness)",
  "Visualize: force-directed graph with communities color-coded",
]);

// ── INDUSTRIAL USE CASE 3: Google Maps ──
addUseCaseDivider(3, "Google Maps Route Optimization", "Google (Alphabet)");

twoColumnSlide(
  "Google Maps: 1 Billion Users, Real-Time Routing",
  "Business Problem",
  [
    "Google Maps processes 1B+ km of roads for routing decisions",
    "1 billion+ users depend on it for daily navigation",
    "0.1% improvement in pathfinding saved 100M hours of driving in 2023",
    "FedEx uses shortest-path algorithms saving $2B+/year in fuel",
    "Multi-objective: minimize distance vs time vs toll cost",
  ],
  "Graph Model",
  [
    "Nodes: 20 city locations (Home, Office, Airport, Mall, etc.)",
    "Edges: road segments with distance, travel time, toll cost",
    "Traffic multiplier: 1.0x (clear) to 2.5x (heavy congestion)",
    "Road types: highway, arterial, local, expressway",
    "Risk score: accident probability per road segment",
    "Same origin-destination has different optimal paths by objective",
  ],
);

datasetSlide("Industrial Use Case 3: Google Maps Dataset", [
  ["source", "string", "Origin location"],
  ["destination", "string", "Destination location"],
  ["distance_km", "float", "Road segment distance in km"],
  ["base_time_min", "float", "Travel time without traffic (minutes)"],
  ["traffic_multiplier", "float", "1.0 (clear) to 2.5 (heavy traffic)"],
  ["road_type", "category", "highway | arterial | local | expressway"],
  ["toll_cost", "float", "Toll charge in USD (0 = no toll)"],
  ["accident_risk", "float", "Historical accident probability (0-0.25)"],
], "City road network with 20 locations and ~113 road segments");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Google Maps Routing", [
  "Build city road network graph with distance, time, traffic, and toll weights",
  "Compute Dijkstra shortest path optimizing for distance vs time vs cost",
  "Find Minimum Spanning Tree — minimum roads to connect all locations",
  "Betweenness centrality: identify critical intersections (traffic bottlenecks)",
  "Simulate road closure: remove top centrality node and measure detour impact",
  "Compare: BFS (min hops) vs Dijkstra (min distance) vs Dijkstra (min time)",
]);

// ══════════════════════════════════════════════════════════════
// SESSION 3: CUSTOMER SEGMENTATION USING ML
// ══════════════════════════════════════════════════════════════
addSessionDivider(3, "Customer Segmentation\nUsing Machine Learning", "K-Means  •  Hierarchical Clustering  •  DBSCAN  •  Business Interpretation");

addWowFactSlide([
  "Netflix saves $1 billion per year through its recommendation system, which is built on user segmentation. 80% of content watched comes from algorithmic suggestions.",
  "Starbucks' customer segmentation drives 40% of its revenue through targeted offers. Their ML system segments 30M+ rewards members into micro-cohorts updated weekly.",
  "Amazon's \"Customers who bought this\" feature (collaborative filtering + segmentation) drives 35% of total revenue — worth $150B+ annually.",
  "Spotify's Discover Weekly playlist, powered by user clustering, has generated 10B+ streams. Users who engage with it have 30% lower churn rate.",
  "The wrong number of segments (K) can be catastrophic: a major retailer lost $50M in a single quarter by targeting 3 segments when their data naturally had 7, sending irrelevant promotions to 60% of customers."
], "Session 3 — Customer Segmentation");

bulletSlide("Core Theory: Unsupervised Learning for Segmentation", [
  "Unsupervised Learning: no labeled data — algorithm discovers structure",
  "K-Means Clustering: partition n observations into K clusters minimizing within-cluster variance",
  "   • Fast, scalable, interpretable — but requires choosing K and assumes spherical clusters",
  "Hierarchical Clustering: builds a tree (dendrogram) of nested clusters",
  "   • No need to pre-specify K — but O(n³) complexity, not scalable beyond ~10K points",
  "DBSCAN: density-based clustering — finds arbitrarily shaped clusters",
  "   • Handles outliers naturally — but sensitive to hyperparameters (eps, min_samples)",
  "Feature Scaling: CRITICAL — K-Means uses Euclidean distance; unscaled features create bias",
  "Choosing K: Elbow Method (inertia plot) + Silhouette Score (cohesion vs separation)",
]);

twoColumnSlide(
  "Business Purpose: Why Segment?",
  "Strategic Value of Segmentation",
  [
    "Personalization: right message to each segment → 5-8x higher engagement",
    "Targeted Marketing: allocate budget to highest-ROI segments first",
    "Lifetime Value (LTV) optimization: identify and nurture high-value cohorts",
    "Product Development: build features that serve largest/highest-value segments",
    "Pricing Strategy: different willingness-to-pay per segment",
    "Churn Prevention: identify at-risk segments before they leave",
  ],
  "Cluster Validation: Is Your Segmentation Good?",
  [
    "Silhouette Score: -1 to +1 (higher = better separation between clusters)",
    "Inertia / Elbow Method: plot inertia vs K — look for the 'elbow' bend",
    "Business Sense Test: can marketing team act on these segments?",
    "Stability Test: re-run with different seeds — do segments stay consistent?",
    "Size Balance: are segments too skewed? (one cluster with 90% of data is useless)",
    "Actionability: each segment must have a distinct strategic response",
  ],
);

// ── INDUSTRIAL USE CASE 1: Netflix ──
addUseCaseDivider(1, "Netflix User Segmentation\n& Retention Strategy", "Netflix Inc.");

twoColumnSlide(
  "Netflix: 247M Subscribers, 190 Countries, 1 Algorithm",
  "Business Problem",
  [
    "Improve recommendation accuracy and reduce churn",
    "Netflix loses $1.6B/year to churn (avg subscriber stays 15 months)",
    "Content library costs $17B/year — ROI depends on matching content to segments",
    "Challenge: segment users to enable hyperpersonalized recommendations",
    "Key insight: users don't know what they want — 80% of plays come from recommendations",
  ],
  "Features for Segmentation",
  [
    "Watch Hours: daily average viewing time",
    "Genre Diversity Score: how many different genres per month (0-1)",
    "Subscription Tier: Basic, Standard, Premium, Ad-supported",
    "Device Type: mobile, tablet, desktop, smart TV",
    "Days Active: number of days with at least one stream in last 30 days",
    "Completion Rate: % of started shows/movies finished",
  ],
);

datasetSlide("Industrial Use Case 1: Netflix Dataset", [
  ["user_id", "string", "Unique anonymous user identifier"],
  ["avg_watch_hours", "float", "Average daily watch hours (0-12)"],
  ["genre_diversity_score", "float", "0.0 (one genre only) to 1.0 (watches all genres)"],
  ["subscription_type", "category", "basic | standard | premium | ad_supported"],
  ["days_active", "int", "Active days in last 30 days (0-30)"],
  ["completion_rate", "float", "% of content started that was finished (0-1)"],
  ["device_primary", "category", "mobile | tablet | desktop | smart_tv"],
], "CSV dataset for Netflix User Segmentation");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Netflix Segmentation", [
  "Feature engineering: encode subscription_type and device_primary using ordinal/one-hot encoding",
  "Scale all features using StandardScaler (critical for K-Means Euclidean distance)",
  "Determine optimal K: plot Elbow curve (inertia) and Silhouette scores for K=2 to K=10",
  "Run K-Means with optimal K — assign cluster labels to each user",
  "Profile each cluster: compute mean/median of all features per cluster",
  "Visualize: PCA 2D projection with cluster coloring + radar charts per cluster",
  "Name each cluster with a business persona (e.g., 'Binge Watcher', 'Casual Browser')",
]);

// ── INDUSTRIAL USE CASE 2: IPL Fan Segmentation ──
addUseCaseDivider(2, "IPL Fan Segmentation\n& Revenue Optimization", "Indian Premier League");

twoColumnSlide(
  "IPL: 500M+ Viewers, ₹50,000 Cr Media Rights",
  "Business Context",
  [
    "IPL 2023 viewership: 505 million across TV + streaming",
    "Media rights deal: ₹48,390 Cr ($5.9B) for 2023-2027",
    "Revenue streams: tickets, merchandise, sponsorship, streaming, fantasy gaming",
    "Challenge: not all fans are equal — need to identify premium segments",
    "Goal: maximize revenue per fan by understanding consumption patterns",
  ],
  "Features for Segmentation",
  [
    "Match Attendance: stadium visits per season (0-14 home games)",
    "Merchandise Spend: annual spend on team merchandise (₹)",
    "Social Engagement: posts, likes, shares about IPL per month",
    "Streaming Hours: hours of IPL content streamed per season",
    "Fantasy Gaming: active in IPL fantasy leagues? spend?",
    "Multi-team vs Single-team: follows 1 team loyally or watches all?",
  ],
);

datasetSlide("Industrial Use Case 2: IPL Fan Dataset", [
  ["fan_id", "string", "Unique anonymous fan identifier"],
  ["match_attendance", "int", "Number of stadium matches attended per season"],
  ["merchandise_spend", "float", "Annual merchandise spending in ₹"],
  ["social_engagement_score", "float", "Normalized social media activity (0-1)"],
  ["streaming_hours", "float", "Total IPL streaming hours per season"],
  ["fantasy_spend", "float", "Annual spend on fantasy cricket in ₹"],
  ["loyalty_index", "float", "0.0 (multi-team) to 1.0 (single-team loyal)"],
], "CSV dataset for IPL Fan Segmentation");

jupyterWorkflowSlide("Jupyter Notebook Tasks — IPL Fan Segmentation", [
  "Scale features and run K-Means for K=3 to K=8 — determine optimal segments",
  "Profile clusters: which segment attends matches? which streams? which spends on merch?",
  "Identify the \"Premium Superfan\" segment: high attendance + high merch + high loyalty",
  "Identify the \"Digital-Only\" segment: high streaming + social but no attendance",
  "Calculate revenue per fan per segment: (ticket + merch + streaming + fantasy revenue)",
  "Design targeted campaign for each segment with specific channel + message + offer",
]);

// ── INDUSTRIAL USE CASE 3: Spotify ──
addUseCaseDivider(3, "Spotify Listener Segmentation", "Spotify Technology");

twoColumnSlide(
  "Spotify: 615M Users, Personalization at Scale",
  "Business Problem",
  [
    "Spotify has 615M+ monthly active users in 180+ markets",
    "Discover Weekly playlist generated 10B+ streams via clustering",
    "Users engaging with personalized playlists have 30% lower churn",
    "Premium subscribers ($11/month) = 87% of revenue",
    "Challenge: segment listeners to enable hyper-personalized recommendations",
  ],
  "Features for Segmentation",
  [
    "Daily Listen Hours: average daily streaming time",
    "Genre Diversity: how many genres per month (0-1 scale)",
    "Skip Rate: % of songs skipped before 30 seconds",
    "Playlist Count: number of saved/created playlists",
    "Discovery Ratio: % of listening from algorithmically suggested music",
    "Is Premium: free tier vs premium subscriber",
  ],
);

datasetSlide("Industrial Use Case 3: Spotify Dataset", [
  ["user_id", "string", "Unique listener identifier"],
  ["daily_listen_hours", "float", "Average daily listening time"],
  ["genre_diversity", "float", "0.0 (one genre) to 1.0 (all genres)"],
  ["skip_rate", "float", "Fraction of songs skipped early"],
  ["playlist_count", "int", "Number of playlists created/saved"],
  ["is_premium", "binary", "1 = Premium, 0 = Free tier"],
  ["discovery_ratio", "float", "Percent of listening from recommendations"],
  ["sessions_per_week", "int", "Number of listening sessions per week"],
  ["avg_song_completion", "float", "Average fraction of song played"],
], "2,000 listeners for Spotify Segmentation");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Spotify Segmentation", [
  "Scale features and run K-Means for K=2 to K=9 with Elbow + Silhouette",
  "Profile clusters: Power Listener, Casual, Workout/Focus, Podcast Lover, Social Sharer",
  "PCA 2D visualization with cluster coloring",
  "Revenue per segment: premium vs free tier breakdown",
  "Design targeted playlist and upsell strategy per segment",
  "Estimate: if personalization reduces churn by 5% in casual segment, revenue impact?",
]);

// ══════════════════════════════════════════════════════════════
// SESSION 4: CLASSIFICATION & OPTIMIZATION
// ══════════════════════════════════════════════════════════════
addSessionDivider(4, "Classification &\nOptimization", "Decision Trees  •  Random Forest  •  SGD  •  Business Cost Matrix");

addWowFactSlide([
  "JPMorgan Chase uses ML classifiers to process 12,000 commercial loan applications annually that previously required 360,000 lawyer-hours. Their model saved $150M in operational costs in the first year.",
  "A 1% improvement in credit default prediction accuracy saves the US banking industry $2.3 billion annually in bad debt losses.",
  "Microsoft Azure's churn prediction models help SaaS clients retain an average of 15% more customers — on a $100M ARR product, that's $15M saved per year.",
  "False negatives in medical classification cost 10-100x more than false positives. The same principle applies in fraud detection: missing a $1M fraud costs far more than investigating 100 legitimate transactions.",
  "Random Forest algorithm was used to win the Netflix Prize ($1M competition) in 2009. Today, Netflix reports that improved recommendations (driven by classification) are worth >$1B/year in prevented cancellations."
], "Session 4 — Classification & Optimization");

bulletSlide("Core Theory: Classification Algorithms", [
  "Decision Tree: produces human-interpretable IF-THEN rules. Intuitive but prone to overfitting",
  "Random Forest: ensemble of 100+ decision trees — reduces variance through bagging (bootstrap aggregation)",
  "   • More accurate but less interpretable — trade-off depends on regulatory context",
  "SGD Classifier (Stochastic Gradient Descent): scalable linear model for very large datasets",
  "   • Low memory, fast training — but works best with linearly separable classes",
  "Key Evaluation Metrics:",
  "   • Accuracy: overall correctness (misleading with imbalanced classes)",
  "   • Precision: of all predicted positives, how many are truly positive?",
  "   • Recall: of all actual positives, how many did we catch?",
  "   • F1 Score: harmonic mean of precision and recall",
  "   • ROC-AUC: overall discriminative power across all thresholds",
]);

twoColumnSlide(
  "The Business Cost Matrix: Why Accuracy Isn't Enough",
  "False Positive vs False Negative",
  [
    "False Positive (FP): predict default → actually good borrower",
    "   Cost: lost interest revenue + customer relationship damage",
    "False Negative (FN): predict good → actually defaults",
    "   Cost: full loan write-off + legal costs",
    "Key insight: FN cost is often 10-50x higher than FP cost",
    "Model threshold must be tuned to minimize total business cost, not just error rate",
  ],
  "Business Cost Matrix Framework",
  [
    "Step 1: Quantify cost of each error type in dollars",
    "Step 2: Build cost matrix: C(FP) and C(FN)",
    "Step 3: Compute total cost = FP×C(FP) + FN×C(FN)",
    "Step 4: Optimize classification threshold to minimize total cost",
    "Example: loan default — C(FN) = $50K, C(FP) = $5K",
    "A model with 95% accuracy but 30% FN rate may COST MORE than 90% accuracy with 5% FN rate",
  ],
  { accentColor: C.red }
);

// ── INDUSTRIAL USE CASE 1: Loan Approval ──
addUseCaseDivider(1, "Loan Approval Model\nCredit Risk Classification", "Banking / Financial Services");

twoColumnSlide(
  "Credit Risk: $4.2 Trillion in Global Loans at Stake",
  "Business Problem",
  [
    "Predict whether a loan applicant will default within 12 months",
    "Global consumer lending: $4.2T outstanding — 2-5% default rate",
    "1% improvement in prediction = billions in saved write-offs",
    "Regulatory requirement: models must be explainable (rules out black-box only)",
    "Challenge: class imbalance — only 5-8% of loans actually default",
    "Bias risk: model must not discriminate on protected attributes",
  ],
  "Classification Challenge",
  [
    "Binary classification: default (1) vs no-default (0)",
    "Imbalanced data: ~95% no-default, ~5% default",
    "Need high recall on defaults: missing a default is very costly",
    "Need reasonable precision: rejecting good borrowers loses revenue",
    "Regulatory: must explain WHY each application is rejected",
    "Decision Tree provides explainability, Random Forest provides accuracy",
  ],
);

datasetSlide("Industrial Use Case 1: Loan Dataset", [
  ["credit_score", "int", "FICO score (300-850)"],
  ["income", "float", "Annual income in USD"],
  ["loan_amount", "float", "Requested loan amount in USD"],
  ["employment_years", "float", "Years at current employer"],
  ["debt_to_income", "float", "Monthly debt payments / monthly income"],
  ["previous_defaults", "int", "Number of previous loan defaults"],
  ["default", "binary", "Target: 1 = defaulted, 0 = repaid"],
], "CSV dataset for Loan Approval Classification");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Loan Approval", [
  "EDA: check class imbalance, feature distributions, correlations",
  "Handle imbalance: try SMOTE oversampling and class_weight='balanced'",
  "Train Decision Tree: visualize the tree, extract human-readable rules",
  "Train Random Forest: 100 trees — compute feature importances",
  "Compare all models: accuracy, precision, recall, F1, ROC-AUC",
  "Apply cost matrix: C(FN) = $50K, C(FP) = $5K — compute total business cost per model",
  "ROC curve analysis: find optimal threshold that minimizes total business cost",
]);

// ── INDUSTRIAL USE CASE 2: Churn Prediction ──
addUseCaseDivider(2, "Churn Prediction\nSaaS Platform (Azure)", "Microsoft (Azure SaaS)");

twoColumnSlide(
  "SaaS Churn: Every 1% Reduction = $100M+ in ARR",
  "Business Problem",
  [
    "Predict which enterprise customers will cancel Azure subscriptions",
    "Azure annual revenue: $80B+ — even 1% churn = $800M at risk",
    "Acquiring new enterprise customer costs 5-7x retaining existing one",
    "Early warning: 60-90 days before churn, usage patterns change",
    "Goal: identify at-risk accounts → trigger retention intervention",
    "SaaS benchmark: 5-7% annual churn for enterprise, 20-30% for SMB",
  ],
  "Churn Signals (Features)",
  [
    "Login Frequency: declining login trend over 30/60/90 days",
    "Support Tickets: increasing ticket volume (frustration signal)",
    "Usage Decline: % drop in compute/storage usage month-over-month",
    "Plan Type: enterprise vs SMB vs startup (different churn patterns)",
    "Contract Renewal: days until renewal — churn concentrates near renewal",
    "NPS Score: last Net Promoter Score (promoter vs detractor)",
  ],
);

datasetSlide("Industrial Use Case 2: SaaS Churn Dataset", [
  ["customer_id", "string", "Unique enterprise customer identifier"],
  ["login_frequency_30d", "int", "Logins in last 30 days"],
  ["support_tickets_90d", "int", "Support tickets in last 90 days"],
  ["usage_decline_pct", "float", "% decline in usage vs 3 months ago"],
  ["plan_type", "category", "enterprise | smb | startup"],
  ["days_to_renewal", "int", "Days until contract renewal"],
  ["nps_score", "int", "Net Promoter Score (-100 to 100)"],
  ["churned", "binary", "Target: 1 = churned, 0 = active"],
], "CSV dataset for SaaS Churn Prediction");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Churn Prediction", [
  "EDA: examine churn rate by plan_type, identify strongest churn predictors",
  "Feature engineering: create trend features (login slope, usage velocity)",
  "Train Decision Tree + Random Forest + SGD classifier",
  "Compare: precision vs recall tradeoff — which metric matters more for churn?",
  "ROC analysis: find optimal threshold (high recall = catch more churners)",
  "Feature importance: which signals best predict churn? Actionable for customer success team?",
  "Simulation: if model catches 80% of churners 60 days early, calculate retention campaign ROI",
]);

// ── INDUSTRIAL USE CASE 3: Credit Card Fraud ──
addUseCaseDivider(3, "Credit Card Fraud Detection", "Visa / Mastercard");

twoColumnSlide(
  "Credit Card Fraud: $32 Billion/Year Global Problem",
  "Business Problem",
  [
    "Global credit card fraud losses: $32 billion/year (Nilson Report)",
    "Visa processes 65,000 transactions/second — each needs real-time scoring",
    "Missing a fraud (FN): full transaction amount + $25 chargeback fee",
    "False alert (FP): $75 investigation cost + customer friction",
    "Only ~2-8% of transactions are fraudulent — severe class imbalance",
  ],
  "Fraud Signals",
  [
    "Transaction Amount: fraud transactions tend to be much larger",
    "Hour of Day: fraudsters operate late at night",
    "Distance from Home: transactions far from cardholder location",
    "Frequency: many transactions in 24 hours = suspicious",
    "Foreign Transaction: cross-border usage by a domestic card",
    "Used Chip: chip transactions are harder to fake",
  ],
);

datasetSlide("Industrial Use Case 3: Credit Card Fraud Dataset", [
  ["transaction_id", "string", "Unique transaction identifier"],
  ["amount", "float", "Transaction amount in USD"],
  ["hour_of_day", "int", "Hour when transaction occurred (0-23)"],
  ["distance_from_home_km", "float", "Distance from cardholder home"],
  ["transactions_last_24h", "int", "Number of transactions in last 24 hours"],
  ["is_foreign_transaction", "binary", "1 = foreign, 0 = domestic"],
  ["is_online", "binary", "1 = online, 0 = in-person"],
  ["used_chip", "binary", "1 = chip used, 0 = swipe/tap"],
  ["is_fraud", "binary", "Target: 1 = fraud, 0 = legitimate"],
], "5,000 transactions for Fraud Detection (7.5% fraud rate)");

jupyterWorkflowSlide("Jupyter Notebook Tasks — Fraud Detection", [
  "EDA: analyze fraud patterns by hour, amount, distance, merchant category",
  "Train Decision Tree, Random Forest, SGD Classifier with balanced class weights",
  "Compare models: precision, recall, F1, ROC-AUC",
  "Apply cost matrix: missed fraud = avg_amount + $25, false alarm = $75",
  "Optimize threshold to minimize total business cost",
  "Scale analysis: estimate daily fraud losses prevented at Visa volume",
]);

// ══════════════════════════════════════════════════════════════
// CLOSING / SUMMARY SLIDE
// ══════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addGradientBg(slide, "050D1A", "0F2847");
  
  slide.addText("COURSE SUMMARY", {
    x: 1, y: 0.5, w: 11, h: 0.6,
    fontSize: 16, fontFace: FONT.accent, color: C.accent,
    bold: true, letterSpacing: 6,
  });
  
  slide.addText("Strategic Thinking + Technical Depth = Business Impact", {
    x: 1, y: 1.2, w: 11, h: 0.8,
    fontSize: 28, fontFace: FONT.title, color: C.white,
    bold: true,
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 1, y: 2.2, w: 3, h: 0.04,
    fill: { color: C.accent },
  });
  
  const summaryItems = [
    { icon: "📊", text: "Apply advanced algorithms to real business data" },
    { icon: "📈", text: "Interpret metrics correctly and critically" },
    { icon: "💡", text: "Justify every decision with data and business logic" },
    { icon: "🔗", text: "Integrate across Finance + Operations + Marketing + Strategy" },
    { icon: "💰", text: "Quantify business impact in dollars, not just accuracy" },
    { icon: "🎯", text: "Present boardroom-ready recommendations" },
  ];
  
  let yy = 2.6;
  summaryItems.forEach(item => {
    slide.addText(`${item.icon}  ${item.text}`, {
      x: 1.2, y: yy, w: 10, h: 0.55,
      fontSize: 18, fontFace: FONT.body, color: C.white,
      lineSpacingMultiple: 1.2,
    });
    yy += 0.7;
  });
  
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1, y: 6.3, w: 11.3, h: 0.8,
    fill: { color: "1E3A5F" },
    rectRadius: 0.08,
  });
  
  slide.addText("Advanced Tool Mastery    |    Enterprise Data-Driven Decisions", {
    x: 1, y: 6.3, w: 11.3, h: 0.8,
    fontSize: 16, fontFace: FONT.accent, color: C.accent,
    bold: true, align: "center", valign: "middle",
  });
}

// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// THANK YOU SLIDE
// ══════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addGradientBg(slide, "050D1A", "0F2847");
  
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9, y: -2, w: 6, h: 6,
    fill: { color: C.blue }, transparency: 92,
  });
  
  slide.addText("THANK YOU", {
    x: 1, y: 2.0, w: 11, h: 1.5,
    fontSize: 52, fontFace: FONT.title, color: C.white,
    bold: true, align: "center",
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.5, y: 3.7, w: 2.5, h: 0.04,
    fill: { color: C.accent },
  });
  
  slide.addText("Now go build something impactful.", {
    x: 1, y: 4.0, w: 11, h: 0.8,
    fontSize: 20, fontFace: FONT.body, color: C.accent,
    italic: true, align: "center",
  });
  
  slide.addText("Data Structures • Algorithms • Machine Learning • Business Strategy", {
    x: 1, y: 5.5, w: 11, h: 0.5,
    fontSize: 14, fontFace: FONT.body, color: C.gray,
    align: "center",
  });
}


// ══════════════════════════════════════════════════════════════
// SAVE
// ══════════════════════════════════════════════════════════════
const outputPath = "Q:\\src\\SqlControlPlaneFramework\\DSA_ML_Business_Course_4Sessions.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`\n✅ Presentation saved successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📊 Total slides: ${pptx.slides.length}`);
  })
  .catch(err => {
    console.error("Error creating presentation:", err);
  });
