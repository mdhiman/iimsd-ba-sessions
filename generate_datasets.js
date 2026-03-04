// ══════════════════════════════════════════════════════════════
// Dataset Generator for DSA & ML Business Course
// Generates 8 realistic synthetic CSV datasets
// ══════════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const BASE = "Q:\\src\\SqlControlPlaneFramework\\CourseContent";

// Helpers
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function round2(n) { return Math.round(n * 100) / 100; }
function uuid() { return 'xxxxxxxx'.replace(/x/g, () => randInt(0, 15).toString(16)); }

function writeCsv(filePath, headers, rows) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const lines = [headers.join(",")];
  rows.forEach(r => lines.push(r.map(v => typeof v === "string" && v.includes(",") ? `"${v}"` : v).join(",")));
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  console.log(`  ✅ ${path.basename(filePath)} — ${rows.length} rows`);
}

// ══════════════════════════════════════════════════════════════
// DATASET 1: LinkedIn Feed Ranking
// ══════════════════════════════════════════════════════════════
function generateLinkedInFeed() {
  const contentTypes = ["article", "video", "poll", "image", "text"];
  const headers = ["post_id", "engagement_score", "connection_strength", "hours_since_posted", "content_type", "creator_followers"];
  const rows = [];
  for (let i = 0; i < 5000; i++) {
    const cType = pick(contentTypes);
    const baseEngagement = cType === "video" ? rand(30, 95) : cType === "poll" ? rand(40, 85) : cType === "article" ? rand(10, 70) : rand(15, 80);
    rows.push([
      `post_${String(i + 1).padStart(5, "0")}`,
      round2(baseEngagement + rand(-10, 10)),
      round2(rand(0.05, 1.0)),
      randInt(0, 168),
      cType,
      randInt(50, 500000),
    ]);
  }
  writeCsv(path.join(BASE, "Session1_Sorting", "datasets", "linkedin_feed_ranking.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 2: IPL Auction Player Ranking
// ══════════════════════════════════════════════════════════════
function generateIPLAuction() {
  const roles = ["opener", "middle_order", "finisher", "bowler", "allrounder"];
  const firstNames = ["Virat", "Rohit", "Jasprit", "Ravindra", "Hardik", "Shubman", "Rishabh", "KL", "Suryakumar", "Mohammed",
    "Jos", "Ben", "Pat", "Mitchell", "Glenn", "David", "Steve", "Kane", "Trent", "Rashid",
    "Quinton", "Kagiso", "Faf", "AB", "Babar", "Shaheen", "Shakib", "Mustafizur", "Wanindu", "Kusal",
    "Devon", "Shimron", "Andre", "Nicholas", "Kieron", "Dwayne", "Chris", "Jason", "Sunil", "Dinesh",
    "Prithvi", "Shreyas", "Ishan", "Sanju", "Ruturaj", "Yashasvi", "Tilak", "Rinku", "Rajat", "Abhishek"];
  const lastNames = ["Kohli", "Sharma", "Bumrah", "Jadeja", "Pandya", "Gill", "Pant", "Rahul", "Yadav", "Siraj",
    "Buttler", "Stokes", "Cummins", "Starc", "Maxwell", "Warner", "Smith", "Williamson", "Boult", "Khan",
    "de Kock", "Rabada", "du Plessis", "de Villiers", "Azam", "Afridi", "Al Hasan", "Rahman", "Hasaranga", "Mendis",
    "Conway", "Hetmyer", "Russell", "Pooran", "Pollard", "Bravo", "Gayle", "Holder", "Narine", "Karthik",
    "Shaw", "Iyer", "Kishan", "Samson", "Gaikwad", "Jaiswal", "Varma", "Singh", "Patidar", "Sharma"];
  const basePrices = [50, 75, 100, 150, 200];

  const headers = ["player_name", "strike_rate", "batting_avg", "recent_form_score", "injury_risk", "base_price", "role"];
  const rows = [];
  for (let i = 0; i < 200; i++) {
    const role = pick(roles);
    const sr = role === "bowler" ? round2(rand(90, 135)) : role === "finisher" ? round2(rand(140, 195)) : round2(rand(115, 170));
    const avg = role === "bowler" ? round2(rand(10, 22)) : round2(rand(20, 55));
    rows.push([
      `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}${i >= 50 ? " Jr" : ""}`,
      sr,
      avg,
      round2(rand(20, 95)),
      round2(rand(0.02, 0.65)),
      pick(basePrices),
      role,
    ]);
  }
  writeCsv(path.join(BASE, "Session1_Sorting", "datasets", "ipl_auction_players.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 3: Microsoft Supply Chain
// ══════════════════════════════════════════════════════════════
function generateSupplyChain() {
  const suppliers = ["Supplier_Taiwan_TSMC", "Supplier_Korea_Samsung", "Supplier_Japan_Sony", "Supplier_China_Foxconn", "Supplier_Vietnam_Intel", "Supplier_Malaysia_Micron"];
  const factories = ["Factory_Ireland", "Factory_China_Shanghai", "Factory_India_Chennai", "Factory_Mexico_Guadalajara", "Factory_Czech_Prague"];
  const warehouses = ["Warehouse_US_Texas", "Warehouse_EU_Netherlands", "Warehouse_Asia_Singapore", "Warehouse_US_Virginia", "Warehouse_India_Mumbai"];
  const datacenters = ["DC_US_Iowa", "DC_US_Virginia", "DC_EU_Dublin", "DC_EU_Amsterdam", "DC_Asia_Tokyo", "DC_Asia_Singapore", "DC_India_Pune", "DC_US_Arizona"];

  const headers = ["source", "destination", "cost", "delivery_time", "risk_score", "capacity"];
  const rows = [];

  // Supplier → Factory
  suppliers.forEach(s => {
    const targets = factories.filter(() => Math.random() > 0.3);
    targets.forEach(f => {
      rows.push([s, f, round2(rand(50, 800)), round2(rand(2, 21)), round2(rand(0.05, 0.7)), randInt(500, 10000)]);
    });
  });
  // Factory → Warehouse
  factories.forEach(f => {
    const targets = warehouses.filter(() => Math.random() > 0.25);
    targets.forEach(w => {
      rows.push([f, w, round2(rand(30, 500)), round2(rand(1, 14)), round2(rand(0.03, 0.5)), randInt(1000, 20000)]);
    });
  });
  // Warehouse → Data Center
  warehouses.forEach(w => {
    const targets = datacenters.filter(() => Math.random() > 0.3);
    targets.forEach(dc => {
      rows.push([w, dc, round2(rand(20, 300)), round2(rand(1, 7)), round2(rand(0.02, 0.35)), randInt(2000, 30000)]);
    });
  });

  writeCsv(path.join(BASE, "Session2_Graphs", "datasets", "microsoft_supply_chain.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 4: Cricket Partnership Network
// ══════════════════════════════════════════════════════════════
function generateCricketPartnership() {
  const players = [
    "Virat Kohli", "Rohit Sharma", "KL Rahul", "Shubman Gill", "Suryakumar Yadav",
    "Rishabh Pant", "Hardik Pandya", "Ravindra Jadeja", "Faf du Plessis", "Glenn Maxwell",
    "Jos Buttler", "David Warner", "Kane Williamson", "Quinton de Kock", "AB de Villiers",
    "Ruturaj Gaikwad", "Yashasvi Jaiswal", "Sanju Samson", "Devon Conway", "Rinku Singh",
    "Nicholas Pooran", "Andre Russell", "Tilak Varma", "Shreyas Iyer", "Ishan Kishan"
  ];
  const headers = ["player_a", "player_b", "runs_together", "matches_played", "win_percentage", "avg_partnership_sr"];
  const rows = [];
  const seen = new Set();

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      if (Math.random() > 0.45) continue;
      const key = `${players[i]}_${players[j]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const matches = randInt(3, 45);
      rows.push([
        players[i], players[j],
        randInt(80, 1200),
        matches,
        round2(rand(30, 75)),
        round2(rand(110, 175)),
      ]);
    }
  }
  writeCsv(path.join(BASE, "Session2_Graphs", "datasets", "cricket_partnership_network.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 5: Netflix User Segmentation
// ══════════════════════════════════════════════════════════════
function generateNetflixUsers() {
  const subTypes = ["basic", "standard", "premium", "ad_supported"];
  const devices = ["mobile", "tablet", "desktop", "smart_tv"];
  const headers = ["user_id", "avg_watch_hours", "genre_diversity_score", "subscription_type", "days_active", "completion_rate", "device_primary"];
  const rows = [];

  for (let i = 0; i < 3000; i++) {
    // Create natural clusters
    const cluster = randInt(1, 5);
    let watchHrs, diversity, sub, daysActive, completion, device;

    switch (cluster) {
      case 1: // Binge Watcher
        watchHrs = round2(rand(4, 10)); diversity = round2(rand(0.3, 0.7)); sub = pick(["premium", "standard"]);
        daysActive = randInt(22, 30); completion = round2(rand(0.7, 0.95)); device = pick(["smart_tv", "desktop"]); break;
      case 2: // Casual Browser
        watchHrs = round2(rand(0.5, 2)); diversity = round2(rand(0.1, 0.4)); sub = pick(["basic", "ad_supported"]);
        daysActive = randInt(5, 15); completion = round2(rand(0.2, 0.5)); device = pick(["mobile", "tablet"]); break;
      case 3: // Weekend Warrior
        watchHrs = round2(rand(2, 5)); diversity = round2(rand(0.4, 0.8)); sub = pick(["standard", "premium"]);
        daysActive = randInt(8, 14); completion = round2(rand(0.5, 0.8)); device = pick(["smart_tv", "tablet"]); break;
      case 4: // Mobile Streamer
        watchHrs = round2(rand(1, 3.5)); diversity = round2(rand(0.2, 0.5)); sub = pick(["basic", "standard", "ad_supported"]);
        daysActive = randInt(15, 25); completion = round2(rand(0.3, 0.6)); device = "mobile"; break;
      case 5: // Premium Enthusiast
        watchHrs = round2(rand(3, 7)); diversity = round2(rand(0.6, 1.0)); sub = "premium";
        daysActive = randInt(20, 30); completion = round2(rand(0.6, 0.9)); device = pick(["smart_tv", "desktop"]); break;
    }

    rows.push([`user_${String(i + 1).padStart(5, "0")}`, watchHrs, diversity, sub, daysActive, completion, device]);
  }
  writeCsv(path.join(BASE, "Session3_Segmentation", "datasets", "netflix_user_segmentation.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 6: IPL Fan Segmentation
// ══════════════════════════════════════════════════════════════
function generateIPLFans() {
  const headers = ["fan_id", "match_attendance", "merchandise_spend", "social_engagement_score", "streaming_hours", "fantasy_spend", "loyalty_index"];
  const rows = [];

  for (let i = 0; i < 2500; i++) {
    const segment = randInt(1, 5);
    let attend, merch, social, stream, fantasy, loyalty;

    switch (segment) {
      case 1: // Stadium Superfan
        attend = randInt(6, 14); merch = round2(rand(5000, 25000)); social = round2(rand(0.5, 0.9));
        stream = round2(rand(20, 60)); fantasy = round2(rand(500, 5000)); loyalty = round2(rand(0.8, 1.0)); break;
      case 2: // Digital-Only
        attend = randInt(0, 1); merch = round2(rand(0, 2000)); social = round2(rand(0.6, 1.0));
        stream = round2(rand(40, 120)); fantasy = round2(rand(1000, 15000)); loyalty = round2(rand(0.3, 0.7)); break;
      case 3: // Casual Viewer
        attend = randInt(0, 2); merch = round2(rand(0, 1000)); social = round2(rand(0.05, 0.3));
        stream = round2(rand(5, 30)); fantasy = round2(rand(0, 500)); loyalty = round2(rand(0.1, 0.4)); break;
      case 4: // Merch Collector
        attend = randInt(2, 6); merch = round2(rand(8000, 40000)); social = round2(rand(0.3, 0.7));
        stream = round2(rand(15, 50)); fantasy = round2(rand(0, 2000)); loyalty = round2(rand(0.7, 1.0)); break;
      case 5: // Fantasy Gamer
        attend = randInt(0, 3); merch = round2(rand(500, 3000)); social = round2(rand(0.4, 0.85));
        stream = round2(rand(30, 80)); fantasy = round2(rand(5000, 50000)); loyalty = round2(rand(0.2, 0.6)); break;
    }

    rows.push([`fan_${String(i + 1).padStart(5, "0")}`, attend, merch, social, stream, fantasy, loyalty]);
  }
  writeCsv(path.join(BASE, "Session3_Segmentation", "datasets", "ipl_fan_segmentation.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 7: Loan Approval
// ══════════════════════════════════════════════════════════════
function generateLoanApproval() {
  const headers = ["credit_score", "income", "loan_amount", "employment_years", "debt_to_income", "previous_defaults", "default"];
  const rows = [];

  for (let i = 0; i < 4000; i++) {
    const creditScore = randInt(300, 850);
    const income = round2(rand(20000, 250000));
    const loanAmount = round2(rand(5000, income * 3));
    const employmentYears = round2(rand(0, 35));
    const dti = round2(rand(0.05, 0.8));
    const prevDefaults = Math.random() < 0.12 ? randInt(1, 3) : 0;

    // Default probability based on features
    let defaultProb = 0.03;
    if (creditScore < 580) defaultProb += 0.25;
    else if (creditScore < 670) defaultProb += 0.1;
    if (dti > 0.5) defaultProb += 0.15;
    if (prevDefaults > 0) defaultProb += 0.2;
    if (loanAmount > income * 2) defaultProb += 0.1;
    if (employmentYears < 2) defaultProb += 0.08;

    const defaulted = Math.random() < Math.min(defaultProb, 0.85) ? 1 : 0;

    rows.push([creditScore, income, loanAmount, employmentYears, dti, prevDefaults, defaulted]);
  }
  writeCsv(path.join(BASE, "Session4_Classification", "datasets", "loan_approval.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// DATASET 8: SaaS Churn Prediction
// ══════════════════════════════════════════════════════════════
function generateSaaSChurn() {
  const planTypes = ["enterprise", "smb", "startup"];
  const headers = ["customer_id", "login_frequency_30d", "support_tickets_90d", "usage_decline_pct", "plan_type", "days_to_renewal", "nps_score", "churned"];
  const rows = [];

  for (let i = 0; i < 3000; i++) {
    const plan = pick(planTypes);
    const logins = plan === "enterprise" ? randInt(15, 120) : plan === "smb" ? randInt(5, 60) : randInt(2, 40);
    const tickets = randInt(0, 15);
    const usageDecline = round2(rand(-20, 60)); // negative = growth
    const daysToRenewal = randInt(1, 365);
    const nps = randInt(-100, 100);

    // Churn probability
    let churnProb = plan === "startup" ? 0.15 : plan === "smb" ? 0.08 : 0.03;
    if (logins < 10) churnProb += 0.15;
    if (tickets > 8) churnProb += 0.12;
    if (usageDecline > 30) churnProb += 0.2;
    if (nps < -20) churnProb += 0.15;
    if (daysToRenewal < 60) churnProb += 0.05;

    const churned = Math.random() < Math.min(churnProb, 0.9) ? 1 : 0;

    rows.push([
      `cust_${String(i + 1).padStart(5, "0")}`,
      logins, tickets, usageDecline, plan, daysToRenewal, nps, churned
    ]);
  }
  writeCsv(path.join(BASE, "Session4_Classification", "datasets", "saas_churn_prediction.csv"), headers, rows);
}

// ══════════════════════════════════════════════════════════════
// GENERATE ALL
// ══════════════════════════════════════════════════════════════
console.log("\n🔧 Generating datasets for DSA & ML Business Course...\n");

console.log("📁 Session 1: Sorting & Business Prioritization");
generateLinkedInFeed();
generateIPLAuction();

console.log("\n📁 Session 2: Graph Algorithms & Networks");
generateSupplyChain();
generateCricketPartnership();

console.log("\n📁 Session 3: Customer Segmentation");
generateNetflixUsers();
generateIPLFans();

console.log("\n📁 Session 4: Classification & Optimization");
generateLoanApproval();
generateSaaSChurn();

console.log("\n✅ All 8 datasets generated successfully!");
console.log(`📂 Location: ${BASE}`);
