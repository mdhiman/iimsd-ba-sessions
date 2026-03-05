"""
══════════════════════════════════════════════════════════════════════
FoodieExpress Capstone — Synthetic Dataset Generator
══════════════════════════════════════════════════════════════════════
Generates 4 interconnected datasets for the capstone project:

  1. restaurants.csv   — 1,500 partner restaurants in Bengaluru
  2. delivery_network.csv — City zone-to-zone delivery routes (~160 edges)
  3. customers.csv     — 5,000 registered customers
  4. orders.csv        — 10,000 historical order records

Run:  python generate_data.py
══════════════════════════════════════════════════════════════════════
"""

import os
import random
import math
from itertools import combinations

random.seed(42)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "datasets")
os.makedirs(DATASET_DIR, exist_ok=True)

# ───────────────────────────────────────────────────────────────────
# Helpers (no numpy/pandas dependency — pure Python for portability)
# ───────────────────────────────────────────────────────────────────

def rand(lo, hi):
    return random.random() * (hi - lo) + lo

def rand_int(lo, hi):
    return random.randint(lo, hi)

def pick(arr):
    return random.choice(arr)

def round2(n):
    return round(n, 2)

def weighted_choice(options, weights):
    return random.choices(options, weights=weights, k=1)[0]

def lognormal(mu, sigma):
    return math.exp(random.gauss(mu, sigma))

def clamp(val, lo, hi):
    return max(lo, min(hi, val))

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def write_csv(filepath, headers, rows):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(",".join(headers) + "\n")
        for row in rows:
            f.write(",".join(str(v) for v in row) + "\n")
    print(f"    ✅ {os.path.basename(filepath)} — {len(rows)} rows")


# ───────────────────────────────────────────────────────────────────
# Bengaluru Geography
# ───────────────────────────────────────────────────────────────────

ZONES = [
    "Koramangala", "Indiranagar", "HSR_Layout", "Whitefield",
    "Electronic_City", "MG_Road", "Jayanagar", "JP_Nagar",
    "Marathahalli", "Yelahanka", "Hebbal", "Malleshwaram",
    "BTM_Layout", "Sarjapur", "Bellandur", "Rajajinagar",
    "Basavanagudi", "Banashankari", "KR_Puram", "Bommanahalli",
    "Yeshwanthpur", "Domlur", "Old_Airport_Road", "Silk_Board",
]

ZONE_COORDS = {
    "Koramangala": (12.935, 77.612), "Indiranagar": (12.972, 77.641),
    "HSR_Layout": (12.912, 77.638), "Whitefield": (12.970, 77.750),
    "Electronic_City": (12.845, 77.660), "MG_Road": (12.975, 77.607),
    "Jayanagar": (12.930, 77.582), "JP_Nagar": (12.905, 77.585),
    "Marathahalli": (12.956, 77.702), "Yelahanka": (13.101, 77.594),
    "Hebbal": (13.035, 77.597), "Malleshwaram": (12.997, 77.570),
    "BTM_Layout": (12.916, 77.610), "Sarjapur": (12.860, 77.787),
    "Bellandur": (12.926, 77.676), "Rajajinagar": (12.988, 77.553),
    "Basavanagudi": (12.943, 77.576), "Banashankari": (12.925, 77.546),
    "KR_Puram": (13.012, 77.696), "Bommanahalli": (12.900, 77.618),
    "Yeshwanthpur": (13.023, 77.544), "Domlur": (12.961, 77.637),
    "Old_Airport_Road": (12.960, 77.648), "Silk_Board": (12.917, 77.623),
}

CUISINES = [
    "North_Indian", "South_Indian", "Chinese", "Italian", "Biryani",
    "Fast_Food", "Pizza", "Street_Food", "Continental", "Thai",
    "Japanese", "Mexican", "Desserts", "Healthy_Bowls", "Cafe",
]

PREFIXES = [
    "Royal", "Spice", "Green", "Golden", "Fresh", "Urban",
    "Desi", "Bombay", "Madras", "Delhi", "Tandoor", "Wok",
    "Pasta", "Bowl", "Grill", "Oven", "Flame", "Chai",
    "Momo", "Biryani", "Curry", "Masala", "Meghana", "Truffles",
    "Empire", "Nandhini", "Vidyarthi", "Rameshwaram", "Veena",
    "Brahmin", "Shivaji", "Paradise", "Third_Wave", "Blue_Tokai",
]

SUFFIXES = [
    "Kitchen", "Express", "House", "Point", "Junction", "Hub",
    "Palace", "Garden", "Corner", "Bites", "Cafe", "Dhaba",
    "Hut", "Delight", "Factory", "Republic", "Studio", "Lab",
    "Grill", "Eatery", "Diner", "Stop", "Bowl", "Plate",
]


# ══════════════════════════════════════════════════════════════
# DATASET 1: restaurants.csv (1,500 restaurants)
# ══════════════════════════════════════════════════════════════

def generate_restaurants():
    print("  📦 restaurants.csv ...")
    headers = [
        "restaurant_id", "name", "cuisine", "zone", "avg_rating",
        "num_reviews", "avg_order_value", "avg_delivery_time_min",
        "prep_time_min", "distance_km", "is_promoted", "monthly_orders",
        "active_hours",
    ]
    rows = []
    used_names = set()

    for i in range(1500):
        # Unique name generation
        for _ in range(50):
            name = f"{pick(PREFIXES)} {pick(SUFFIXES)}"
            if name not in used_names:
                used_names.add(name)
                break
        else:
            name = f"{pick(PREFIXES)} {pick(SUFFIXES)} {i}"
            used_names.add(name)

        cuisine = pick(CUISINES)
        zone = pick(ZONES)

        # Tier-correlated features
        tier = weighted_choice(["premium", "mid", "budget"], [0.15, 0.50, 0.35])

        if tier == "premium":
            avg_rating = round2(rand(4.0, 4.9))
            num_reviews = rand_int(200, 5000)
            avg_order_value = round(rand(400, 1200))
            avg_delivery_time = rand_int(25, 50)
            prep_time = rand_int(15, 35)
        elif tier == "mid":
            avg_rating = round2(rand(3.2, 4.5))
            num_reviews = rand_int(50, 1500)
            avg_order_value = round(rand(200, 600))
            avg_delivery_time = rand_int(20, 45)
            prep_time = rand_int(10, 25)
        else:
            avg_rating = round2(rand(2.5, 4.0))
            num_reviews = rand_int(10, 500)
            avg_order_value = round(rand(80, 300))
            avg_delivery_time = rand_int(15, 40)
            prep_time = rand_int(8, 20)

        is_promoted = 1 if random.random() < 0.12 else 0
        distance_km = round2(rand(0.5, 12.0))
        monthly_orders = int(num_reviews * rand(1.5, 4.0))
        active_hours = rand_int(8, 20)

        rows.append([
            f"rest_{str(i+1).zfill(4)}", name, cuisine, zone, avg_rating,
            num_reviews, avg_order_value, avg_delivery_time,
            prep_time, distance_km, is_promoted, monthly_orders,
            active_hours,
        ])

    write_csv(os.path.join(DATASET_DIR, "restaurants.csv"), headers, rows)
    return rows


# ══════════════════════════════════════════════════════════════
# DATASET 2: delivery_network.csv (~160 zone-to-zone routes)
# ══════════════════════════════════════════════════════════════

def generate_delivery_network():
    print("  📦 delivery_network.csv ...")
    headers = [
        "zone_a", "zone_b", "distance_km", "base_travel_time_min",
        "traffic_multiplier", "road_type", "daily_delivery_volume",
        "accident_risk",
    ]
    rows = []
    road_types = ["highway", "arterial", "local", "expressway"]

    for z1, z2 in combinations(ZONES, 2):
        lat1, lon1 = ZONE_COORDS[z1]
        lat2, lon2 = ZONE_COORDS[z2]
        dist = haversine_km(lat1, lon1, lat2, lon2)

        if dist > 15:
            continue
        if dist > 8 and random.random() < 0.4:
            continue

        road_type = weighted_choice(
            road_types,
            [0.2, 0.4, 0.3, 0.1] if dist > 5 else [0.1, 0.3, 0.5, 0.1]
        )
        base_time = round2(dist * rand(2.5, 4.5))

        if road_type == "highway":
            traffic_mult = round2(rand(1.0, 1.8))
        elif road_type == "expressway":
            traffic_mult = round2(rand(1.0, 1.5))
        else:
            traffic_mult = round2(rand(1.0, 2.5))

        daily_vol = rand_int(50, 800)
        accident_risk = round(rand(0.01, 0.15), 3)

        rows.append([
            z1, z2, round2(dist), base_time, traffic_mult,
            road_type, daily_vol, accident_risk,
        ])

    write_csv(os.path.join(DATASET_DIR, "delivery_network.csv"), headers, rows)
    return rows


# ══════════════════════════════════════════════════════════════
# DATASET 3: customers.csv (5,000 customers)
# ══════════════════════════════════════════════════════════════

def generate_customers():
    print("  📦 customers.csv ...")
    payment_methods = ["UPI", "credit_card", "debit_card", "wallet", "cash_on_delivery"]
    headers = [
        "customer_id", "total_orders", "avg_order_value",
        "order_frequency_monthly", "cuisine_diversity", "avg_rating_given",
        "discount_usage_rate", "days_since_last_order", "preferred_payment",
        "is_premium", "complaints_6m", "lifetime_days",
    ]
    rows = []

    for i in range(5000):
        seg = weighted_choice([1, 2, 3, 4, 5], [0.10, 0.25, 0.30, 0.20, 0.15])

        if seg == 1:  # Power User
            tot = rand_int(80, 300); aov = round(rand(350, 800))
            freq = round2(rand(8, 20)); cdiv = round2(rand(0.6, 1.0))
            rating = round2(rand(3.5, 5.0)); disc = round2(rand(0.1, 0.4))
            dsl = rand_int(0, 7); prem = 1 if random.random() < 0.7 else 0
            comp = rand_int(0, 3); life = rand_int(365, 1200)
            pay = weighted_choice(payment_methods, [0.3, 0.3, 0.1, 0.2, 0.1])

        elif seg == 2:  # Regular
            tot = rand_int(25, 100); aov = round(rand(200, 500))
            freq = round2(rand(3, 8)); cdiv = round2(rand(0.3, 0.7))
            rating = round2(rand(3.0, 4.5)); disc = round2(rand(0.2, 0.6))
            dsl = rand_int(1, 21); prem = 1 if random.random() < 0.3 else 0
            comp = rand_int(0, 5); life = rand_int(180, 800)
            pay = weighted_choice(payment_methods, [0.35, 0.2, 0.15, 0.2, 0.1])

        elif seg == 3:  # Discount Hunter
            tot = rand_int(30, 120); aov = round(rand(100, 300))
            freq = round2(rand(4, 12)); cdiv = round2(rand(0.2, 0.6))
            rating = round2(rand(2.5, 4.0)); disc = round2(rand(0.6, 0.95))
            dsl = rand_int(0, 14); prem = 0
            comp = rand_int(1, 8); life = rand_int(90, 600)
            pay = weighted_choice(payment_methods, [0.25, 0.1, 0.1, 0.3, 0.25])

        elif seg == 4:  # Weekend Orderer
            tot = rand_int(10, 50); aov = round(rand(300, 700))
            freq = round2(rand(1.5, 4)); cdiv = round2(rand(0.4, 0.8))
            rating = round2(rand(3.5, 5.0)); disc = round2(rand(0.05, 0.3))
            dsl = rand_int(2, 30); prem = 1 if random.random() < 0.4 else 0
            comp = rand_int(0, 2); life = rand_int(120, 700)
            pay = weighted_choice(payment_methods, [0.2, 0.35, 0.15, 0.15, 0.15])

        else:  # Dormant / Churning
            tot = rand_int(3, 25); aov = round(rand(100, 400))
            freq = round2(rand(0.2, 2)); cdiv = round2(rand(0.1, 0.4))
            rating = round2(rand(2.0, 3.5)); disc = round2(rand(0.3, 0.7))
            dsl = rand_int(30, 180); prem = 0
            comp = rand_int(2, 12); life = rand_int(30, 400)
            pay = weighted_choice(payment_methods, [0.2, 0.1, 0.1, 0.1, 0.5])

        rows.append([
            f"cust_{str(i+1).zfill(5)}", tot, aov, freq, cdiv, rating,
            disc, dsl, pay, prem, comp, life,
        ])

    write_csv(os.path.join(DATASET_DIR, "customers.csv"), headers, rows)
    return rows


# ══════════════════════════════════════════════════════════════
# DATASET 4: orders.csv (10,000 orders)
# ══════════════════════════════════════════════════════════════

def generate_orders():
    print("  📦 orders.csv ...")
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    hour_weights = [
        0.005, 0.002, 0.002, 0.002, 0.002, 0.005, 0.010, 0.020,
        0.040, 0.040, 0.030, 0.060, 0.100, 0.080, 0.040, 0.030,
        0.040, 0.050, 0.070, 0.100, 0.100, 0.080, 0.040, 0.020,
    ]
    headers = [
        "order_id", "customer_id", "restaurant_id", "order_value",
        "distance_km", "estimated_delivery_min", "hour_of_day",
        "day_of_week", "is_weekend", "rain", "surge_pricing_multiplier",
        "promo_applied", "prep_delay_min", "was_cancelled",
    ]
    rows = []
    cancel_count = 0

    for i in range(10000):
        cid = f"cust_{str(rand_int(1, 5000)).zfill(5)}"
        rid = f"rest_{str(rand_int(1, 1500)).zfill(4)}"

        ov = clamp(round(lognormal(5.5, 0.5)), 50, 2500)
        dist = round2(rand(0.5, 15))
        hour = weighted_choice(list(range(24)), hour_weights)
        day = weighted_choice(days, [0.12, 0.12, 0.12, 0.13, 0.15, 0.18, 0.18])
        is_wknd = 1 if day in ("Saturday", "Sunday") else 0
        rain = 1 if random.random() < 0.20 else 0
        surge = weighted_choice(
            [1.0, 1.0, 1.0, 1.2, 1.5, 1.8, 2.0],
            [0.50, 0.15, 0.10, 0.10, 0.08, 0.05, 0.02]
        )
        promo = 1 if random.random() < 0.35 else 0
        est_del = int(dist * rand(2.5, 4.0) + rand(10, 25))
        prep_delay = max(0, int(random.gauss(0, 5)))

        # Cancellation probability
        cp = 0.05
        if est_del > 45:    cp += 0.10
        if rain == 1:       cp += 0.05
        if surge > 1.5:     cp += 0.08
        if hour < 6 or hour > 22: cp += 0.05
        if prep_delay > 10: cp += 0.12
        if ov < 100:        cp += 0.04
        if dist > 10:       cp += 0.06

        cancelled = 1 if random.random() < min(cp, 0.65) else 0
        cancel_count += cancelled

        rows.append([
            f"ord_{str(i+1).zfill(6)}", cid, rid, ov, dist, est_del,
            hour, day, is_wknd, rain, surge, promo, prep_delay, cancelled,
        ])

    write_csv(os.path.join(DATASET_DIR, "orders.csv"), headers, rows)
    rate = cancel_count / len(rows) * 100
    print(f"         Cancellation rate: {rate:.1f}%")
    return rows


# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n🚀 Generating FoodieExpress Capstone Datasets ...\n")
    generate_restaurants()
    generate_delivery_network()
    generate_customers()
    generate_orders()
    print(f"\n✅ All 4 datasets generated!")
    print(f"📂 Location: {DATASET_DIR}\n")
