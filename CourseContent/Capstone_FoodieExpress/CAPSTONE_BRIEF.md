# 🍕 FoodieExpress: Data-Driven Turnaround Strategy

## A Capstone Project — DSA & ML for Business

---

## 🎬 The Situation

**FoodieExpress** is the **3rd-largest food delivery platform** in Bengaluru, India.
Launched 3 years ago, the platform has grown to **1,500 partner restaurants**,
**5,000+ active customers**, and processes **~10,000 orders/month**.

But growth has stalled. The company is **burning ₹15 Crore/month**, and the board
has given the new leadership team **90 days to turn things around** — or face
acquisition by a larger competitor.

---

## 🧑‍💼 Your Role

You have just been appointed **VP of Analytics at FoodieExpress**.

The CEO has identified **4 critical problem areas** where data analytics can make
an immediate business impact. Your job is to analyze each problem, apply the
right algorithms, and present a **board-ready turnaround plan**.

---

## 🔥 The 4 Problems

### Problem 1: "Customers Can't Find Good Food Fast" — Restaurant Ranking
> **Impact: 40% search drop-off rate**

The current search results are sorted by restaurant name alphabetically.
Customers are abandoning search results because they can't find relevant,
high-quality restaurants quickly. Every second of delay costs the platform
₹2.3 Lakh/day in lost orders.

**Your task:** Build a **multi-criteria ranking engine** that surfaces the best
restaurants for each search query. Compare sorting algorithms at scale.

- **Skills Applied:** Composite scoring, Sorting algorithms (Selection, QuickSort, TimSort), Time complexity analysis
- **Dataset:** `restaurants.csv` — 1,500 restaurants with ratings, delivery times, prices, and more

---

### Problem 2: "Deliveries Take Too Long" — Route Optimization
> **Impact: Average delivery time is 45 min vs industry average of 30 min**

Delivery partners are using suboptimal routes between zones. The platform has
no real-time routing intelligence. During rain or peak hours, delivery times
balloon to 60+ minutes, causing cancellations and 1-star ratings.

**Your task:** Model Bengaluru's delivery network as a **graph** and find
optimal routes. Identify **critical bottleneck zones** whose failure would
collapse the network.

- **Skills Applied:** Graph construction, Dijkstra's shortest path, Centrality analysis, Network resilience simulation
- **Dataset:** `delivery_network.csv` — 24 zones with ~160 road connections

---

### Problem 3: "Marketing Spend is Spray-and-Pray" — Customer Segmentation
> **Impact: ₹2 Cr/month on blanket discounts with only 2% conversion**

The marketing team sends the **same 20% discount coupon** to all 5,000 customers
every week. Power users (who would order anyway) get unnecessary discounts.
Dormant users need a different reactivation strategy. The current approach
wastes ₹1.6 Cr/month on non-converting offers.

**Your task:** **Segment customers** into distinct behavioral groups using
clustering algorithms. Design **targeted campaigns** for each segment with
specific channel, message, and offer — and calculate the ROI.

- **Skills Applied:** Feature scaling, K-Means clustering, Elbow method, Silhouette analysis, PCA visualization
- **Dataset:** `customers.csv` — 5,000 customers with order history, preferences, spending patterns

---

### Problem 4: "18% of Orders Get Cancelled" — Cancellation Prediction
> **Impact: ₹3.2 Cr/month in food waste + delivery partner idle time**

Nearly 1 in 5 orders is cancelled after the kitchen starts preparing. This
causes **food waste** (₹180 avg per cancelled order), **delivery partner idle time**
(₹50 per idle trip), and **customer dissatisfaction**. The operations team needs
a way to **predict cancellations before they happen** and intervene proactively.

**Your task:** Build a **classification model** to predict which orders will be
cancelled. Optimize the model using a **business cost matrix** — because a missed
cancellation (food wasted) costs far more than a false alarm (calling the customer).

- **Skills Applied:** Decision Tree, Random Forest, SGD Classifier, ROC analysis, Cost matrix optimization
- **Dataset:** `orders.csv` — 10,000 orders with features like distance, time, weather, surge pricing

---

## 📊 The Datasets

| Dataset | Rows | Key Features | Session Skill |
|---------|------|-------------|---------------|
| `restaurants.csv` | 1,500 | rating, reviews, delivery time, price, zone | Sorting |
| `delivery_network.csv` | ~160 edges | distance, travel time, traffic, road type | Graphs |
| `customers.csv` | 5,000 | order history, frequency, complaints, payment | Segmentation |
| `orders.csv` | 10,000 | value, distance, hour, rain, surge, cancellation | Classification |

---

## 🏆 Deliverables

### Phase 1: Restaurant Ranking Engine (Session 1 Skills)
- Build composite ranking score
- Compare sorting algorithms and their time complexity
- Quantify: how much faster are customers finding good restaurants?

### Phase 2: Delivery Network Optimization (Session 2 Skills)
- Build Bengaluru delivery graph
- Find shortest routes (Dijkstra) optimizing for time vs distance
- Identify the #1 most critical zone — what happens if it goes down?

### Phase 3: Customer Segmentation Strategy (Session 3 Skills)
- Segment customers using K-Means
- Profile each segment with a persona name
- Design targeted campaigns and calculate expected ROI

### Phase 4: Order Cancellation Predictor (Session 4 Skills)
- Train classification models
- Apply cost matrix: missed cancellation = ₹230, false alarm = ₹30
- Find the optimal threshold and estimate monthly savings

### Phase 5: The Board Presentation ⭐
Synthesize all 4 analyses into a **single strategic recommendation**:
- Total monthly savings/revenue from all 4 improvements
- Implementation priority order
- Resource requirements and timeline

---

## 💡 The Competitive Element

If this is being run in a classroom setting, teams can compete on:

| Metric | Description |
|--------|-------------|
| **Ranking Quality** | Which team's restaurant ranking score correlates best with monthly_orders? |
| **Route Efficiency** | Lowest average delivery time across all zone pairs |
| **Segment Actionability** | Most commercially viable segment strategy (judges score on specificity) |
| **Model Cost** | Lowest total business cost on the hold-out set |
| **Board Pitch** | Best 5-minute pitch (clarity, impact quantification, feasibility) |

---

## ⏱ Suggested Timing

| Phase | Duration | Mode |
|-------|----------|------|
| Phase 1: Ranking | 30 min | Individual or pair |
| Phase 2: Network | 30 min | Individual or pair |
| Phase 3: Segmentation | 35 min | Team of 3-4 |
| Phase 4: Classification | 35 min | Team of 3-4 |
| Phase 5: Board Pitch | 20 min prep + 5 min/team | Team presentation |
| **Total** | **~2.5 hours** | |

---

## 📁 File Structure

```
Capstone_FoodieExpress/
├── CAPSTONE_BRIEF.md          ← You are here
├── generate_data.py           ← Run this to regenerate datasets
├── datasets/
│   ├── restaurants.csv        (1,500 rows)
│   ├── delivery_network.csv   (~160 edges)
│   ├── customers.csv          (5,000 rows)
│   └── orders.csv             (10,000 rows)
└── notebooks/
    └── Capstone_FoodieExpress.ipynb
```

---

*"FoodieExpress doesn't need more funding. It needs better algorithms."*
— Board Chairman, Opening Remark
