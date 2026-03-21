# Knowledge Graph Competency Questions
## Query Coverage Test Suite

**Purpose:** Evaluate search capabilities and identify gaps in the knowledge graph structure
**Last Updated:** 2026-03-17
**Version:** 1.0

---

## Framework-Product Connectivity

### Q1: Which frameworks do not yet connect to a product?
**Query Type:** Left outer join / Negative existence
**Expected Pattern:** 
```
SELECT ?framework
WHERE {
  ?framework rdf:type kh:Framework .
  FILTER NOT EXISTS {
    ?product kh:implements ?framework .
  }
}
```
**Business Value:** Identify orphaned frameworks needing product implementation
**Status:** ⬜ Not yet tested

### Q2: Which products lack a defined user type?
**Query Type:** Missing attribute check
**Expected Pattern:**
```
SELECT ?product
WHERE {
  ?product rdf:type kh:Product .
  FILTER NOT EXISTS {
    ?product kh:targetUserType ?userType .
  }
}
```
**Business Value:** Find products needing user persona definition
**Status:** ⬜ Not yet tested

---

## Cross-Domain Relationships (Bloomberg ↔ Kai Hamil)

### Q3: Which concepts from Bloomberg have I written a post about?
**Query Type:** Cross-source content linkage
**Expected Pattern:**
```
SELECT ?concept ?post
WHERE {
  ?concept kh:source "bloomberg" .
  ?post rdf:type kh:BlogPost ;
        kh:references ?concept .
}
```
**Business Value:** Track knowledge transfer between work and business
**Status:** ⬜ Not yet tested

### Q4: Which work frameworks could apply to Kai Hamil business challenges?
**Query Type:** Cross-domain pattern matching
**Expected Pattern:**
```
SELECT DISTINCT ?framework ?challenge
WHERE {
  ?framework kh:source "bloomberg" ;
             kh:appliesTo ?domain .
  ?challenge kh:source "kaihamil" ;
             kh:domain ?domain .
}
```
**Business Value:** Reuse work insights for business problems
**Status:** ⬜ Not yet tested

---

## User Type Analytics

### Q5: Which user type has the most products available?
**Query Type:** Aggregation with grouping
**Expected Pattern:**
```
SELECT ?userType (COUNT(?product) as ?productCount)
WHERE {
  ?product kh:targetUserType ?userType .
}
GROUP BY ?userType
ORDER BY DESC(?productCount)
```
**Business Value:** Identify underserved user segments
**Status:** ⬜ Not yet tested

### Q6: Which user types lack a dedicated tool?
**Query Type:** Negative existence with filtering
**Expected Pattern:**
```
SELECT ?userType
WHERE {
  ?userType rdf:type kh:UserType .
  FILTER NOT EXISTS {
    ?tool rdf:type kh:Tool ;
          kh:targetUserType ?userType .
  }
}
```
**Business Value:** Find gaps in tool coverage
**Status:** ⬜ Not yet tested

---

## Content-Concept Alignment

### Q7: Which wisdom traditions are not represented in any framework?
**Query Type:** Orphan detection
**Expected Pattern:**
```
SELECT ?tradition
WHERE {
  ?tradition rdf:type kh:WisdomTradition .
  FILTER NOT EXISTS {
    ?framework kh:drawsFrom ?tradition .
  }
}
```
**Business Value:** Identify untapped philosophical resources
**Status:** ⬜ Not yet tested

### Q8: Which posts reference concepts from multiple wisdom traditions?
**Query Type:** Multi-source aggregation
**Expected Pattern:**
```
SELECT ?post (COUNT(DISTINCT ?tradition) as ?traditionCount)
WHERE {
  ?post kh:references ?concept .
  ?concept kh:drawsFrom ?tradition .
}
GROUP BY ?post
HAVING (?traditionCount > 1)
```
**Business Value:** Find highly integrative content
**Status:** ⬜ Not yet tested

---

## Operational Gaps

### Q9: Which tools have not been deployed yet?
**Query Type:** Status filtering
**Expected Pattern:**
```
SELECT ?tool
WHERE {
  ?tool rdf:type kh:Tool ;
        kh:status ?status .
  FILTER (?status != "deployed")
}
```
**Business Value:** Track backlog of built-but-not-deployed tools
**Status:** ⬜ Not yet tested

### Q10: Which research topics lack a published output?
**Query Type:** Workflow gap detection
**Expected Pattern:**
```
SELECT ?researchTopic
WHERE {
  ?researchTopic rdf:type kh:ResearchTopic ;
                 kh:status "completed" .
  FILTER NOT EXISTS {
    ?output kh:derivedFrom ?researchTopic ;
            rdf:type kh:PublishedContent .
  }
}
```
**Business Value:** Find completed research needing publication
**Status:** ⬜ Not yet tested

---

## Operational Metrics (Tracked Over Time)

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Query Coverage (passing queries/total) | 0/10 | 10/10 | 📈 |
| Orphaned Frameworks | - | 0 | 📉 |
| Products w/o User Type | - | 0 | 📉 |
| Cross-Domain Links | - | 20+ | 📈 |
| Underserved User Types | - | 0 | 📉 |

---

## Adding New Competency Questions

**Template:**
```markdown
### Q[N]: [Question text]
**Query Type:** [Classification]
**Expected Pattern:** [SPARQL or description]
**Business Value:** [Why this matters]
**Status:** ⬜ Not yet tested / ✅ Passing / ❌ Failing
**Notes:** [Implementation notes, blockers, etc.]
```

---

## Testing Procedure

1. **Weekly:** Run all competency questions against current graph
2. **Log results:** Update status indicators above
3. **Gap analysis:** Identify which queries fail and why
4. **Prioritize:** Fix gaps based on business value
5. **Expand:** Add new questions as graph grows

---

---

## Groove Pal — Record Journey Analytics

### Q11: Which genres spend the most time in the South?
**Query Type:** Aggregation with geographic filtering
**Expected Pattern:**
```sparql
SELECT ?genre (SUM(?days) as ?totalDays)
WHERE {
  ?visit gp:record ?record .
  ?visit gp:location ?location .
  ?visit gp:daysSpent ?days .
  ?location gp:region "south" .
  ?record gp:copyOf ?album .
  ?album gp:hasGenre ?genre .
}
GROUP BY ?genre
ORDER BY DESC(?totalDays)
```
**Business Value:** Understand regional music preferences for targeted distribution
**Status:** ⬜ Not yet tested

### Q12: Where does jazz travel vs hip-hop?
**Query Type:** Genre-location correlation
**Expected Pattern:**
```sparql
SELECT ?genre ?city ?state (COUNT(?visit) as ?visits)
WHERE {
  ?visit gp:record ?record .
  ?visit gp:location ?location .
  ?location gp:city ?city .
  ?location gp:state ?state .
  ?record gp:copyOf ?album .
  ?album gp:hasGenre ?genre .
  FILTER (?genre IN (gp:jazz, gp:hip-hop))
}
GROUP BY ?genre ?city ?state
ORDER BY ?genre DESC(?visits)
```
**Business Value:** Map genre distribution patterns geographically
**Status:** ⬜ Not yet tested

### Q13: What is the average journey length for Stevie Wonder albums?
**Query Type:** Artist-specific aggregation
**Expected Pattern:**
```sparql
SELECT ?album (AVG(?totalDays) as ?avgDays) (AVG(?totalMiles) as ?avgMiles)
WHERE {
  ?record gp:copyOf ?album .
  ?album gp:byArtist gp:stevie-wonder .
  ?record gp:totalDays ?totalDays .
  ?record gp:totalMiles ?totalMiles .
}
GROUP BY ?album
```
**Business Value:** Measure artist engagement and record "stickiness"
**Status:** ⬜ Not yet tested

### Q14: Which cities have the longest average hold times?
**Query Type:** Location performance analysis
**Expected Pattern:**
```sparql
SELECT ?city ?state (AVG(?days) as ?avgDays)
WHERE {
  ?visit gp:location ?location .
  ?visit gp:daysSpent ?days .
  ?location gp:city ?city .
  ?location gp:state ?state .
}
GROUP BY ?city ?state
ORDER BY DESC(?avgDays)
LIMIT 20
```
**Business Value:** Identify cities where records "settle" longest
**Status:** ⬜ Not yet tested

### Q15: Which records are stuck in one location too long?
**Query Type:** Anomaly detection
**Expected Pattern:**
```sparql
SELECT ?record ?album ?location ?days
WHERE {
  ?visit gp:record ?record .
  ?visit gp:location ?location .
  ?visit gp:daysSpent ?days .
  ?visit gp:departed ?departed .
  ?record gp:copyOf ?album .
  FILTER (?days > 90 && !BOUND(?departed))
}
ORDER BY DESC(?days)
```
**Business Value:** Find records needing follow-up (reminder to send forward)
**Status:** ⬜ Not yet tested

### Q16: What's the flow pattern after NYC?
**Query Type:** Sequence analysis
**Expected Pattern:**
```sparql
SELECT ?nextCity ?nextState (COUNT(*) as ?count)
WHERE {
  ?visit1 gp:record ?record .
  ?visit1 gp:location gp:new-york-ny .
  ?visit2 gp:record ?record .
  ?visit2 gp:location ?nextLocation .
  ?visit2 gp:arrived ?arrived2 .
  ?visit1 gp:departed ?departed1 .
  ?nextLocation gp:city ?nextCity .
  ?nextLocation gp:state ?nextState .
  FILTER (?arrived2 > ?departed1)
}
GROUP BY ?nextCity ?nextState
ORDER BY DESC(?count)
```
**Business Value:** Understand record flow patterns for network optimization
**Status:** ⬜ Not yet tested

### Q17: Which artists have the widest geographic reach?
**Query Type:** Artist geographic spread
**Expected Pattern:**
```sparql
SELECT ?artist (COUNT(DISTINCT ?state) as ?statesReached)
WHERE {
  ?record gp:copyOf ?album .
  ?album gp:byArtist ?artist .
  ?visit gp:record ?record .
  ?visit gp:location ?location .
  ?location gp:state ?state .
}
GROUP BY ?artist
ORDER BY DESC(?statesReached)
```
**Business Value:** Identify artists with broad community appeal
**Status:** ⬜ Not yet tested

### Q18: What's the most popular track across all records?
**Query Type:** Track preference aggregation
**Expected Pattern:**
```sparql
SELECT ?track (COUNT(*) as ?votes)
WHERE {
  ?log gp:favoriteTrack ?track .
}
GROUP BY ?track
ORDER BY DESC(?votes)
LIMIT 20
```
**Business Value:** Surface crowd favorites for playlist/curation
**Status:** ⬜ Not yet tested

### Q19: Which records are out of circulation and why?
**Query Type:** Status audit
**Expected Pattern:**
```sparql
SELECT ?record ?album ?status ?lastLocation
WHERE {
  ?record gp:status ?status .
  ?record gp:copyOf ?album .
  OPTIONAL { ?record gp:currentLocation ?lastLocation }
  FILTER (?status IN ("lost", "retired", "paused"))
}
```
**Business Value:** Track attrition and identify patterns
**Status:** ⬜ Not yet tested

### Q20: Seasonal patterns — do records move faster in certain months?
**Query Type:** Temporal analysis
**Expected Pattern:**
```sparql
SELECT ?month (AVG(?days) as ?avgDays) (COUNT(*) as ?visits)
WHERE {
  ?visit gp:departed ?departed .
  ?visit gp:daysSpent ?days .
  BIND(MONTH(?departed) as ?month)
}
GROUP BY ?month
ORDER BY ?month
```
**Business Value:** Identify seasonal engagement patterns
**Status:** ⬜ Not yet tested

---

## Related Files
- `/data/graph.json` — Main knowledge graph
- `/data/allowlist.json` — User access tracking
- `/openclaw/knowledge-graph-schema.md` — Graph structure documentation
- `/products/groove-pal/design/knowledge-graph-schema.md` — Groove Pal schema

---

*This file grows as the knowledge graph matures. Each query represents a real business intelligence need.*
