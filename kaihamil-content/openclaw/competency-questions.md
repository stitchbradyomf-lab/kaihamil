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

## Related Files
- `/data/graph.json` — Main knowledge graph
- `/data/allowlist.json` — User access tracking
- `/openclaw/knowledge-graph-schema.md` — Graph structure documentation

---

*This file grows as the knowledge graph matures. Each query represents a real business intelligence need.*
