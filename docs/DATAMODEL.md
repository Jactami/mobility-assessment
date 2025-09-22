# Data Model
- Structure geospatial data using a **three-level hierarchical model**
- Group location-based elements by functional and urban dimensions
- Evaluate locations based on **thematic relevance** (e.g. mobility, healthcare)

---

## 🟢 Level 1

**Definition:**  
The most granular unit — a specific physical place or object.

**Examples:**  
- "Lidl Supermarket, Main Street"
- "Pharmacy am Markt"
- "Bus Stop A"

**Naming Ideas:**
- `element`
- `entity`
- `instance`
- `feature` 
- `place`
- `poi`
- `location`

---

## 🟡 Level 2

**Definition:**  
The type of service or facility the granular unit represents.

**Examples:**  
- `supermarket`
- `bakery`
- `pharmacy`
- `bus_stop`
- `park`

**Naming Suggestions:**  
- `category`
- `place_type`
- `type`
- `class`
- `key`

---

## 🔵 Level 3

**Definition:**  
Thematic grouping to evaluate broader location aspects.

**Examples:**  
- `supply` (e.g. supermarkets, bakeries, ATMs)
- `mobility` (e.g. bus stops, train stations, bike-sharing)
- `healthcare` (e.g. pharmacies, doctors)
- `recreation` (e.g. parks, sports facilities)

**Naming Suggestions:**  
- `dimension`
- `factor`
- `theme`
- `topic`
- `cluster`
- `sector`
- `segment`
- `domain` 
- `key_group`
