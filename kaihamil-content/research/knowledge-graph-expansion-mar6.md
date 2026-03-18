# Knowledge Graph Expansion — March 6, 2026

Based on Kyle's feedback on the triple store structure.

---

## Changes Requested

1. **Rename:** "AI User Types" → "AI Problem Solver Type"
2. **Add intersection:** Double Diamond intersects Convergence/Divergence with Problem/Solution
3. **Connect:** Double Diamond → supports → Problem Solving
4. **Chain:** Problem Solving + Causal Inference → Continuous Improvement
5. **Model:** Continuous Improvement as trait of highly effective systems

---

## New Triples (JavaScript format for knowledge-graph.html)

```javascript
// ===== DOUBLE DIAMOND EXPANSION =====
// Rename: AI User Types → AI Problem Solver Type
{ subject: "Double Diamond", predicate: "categorizes", object: "AI Problem Solver Types", type: "framework" },

// Intersection structure
{ subject: "Double Diamond", predicate: "intersects", object: "Convergence-Divergence Axis", type: "framework" },
{ subject: "Double Diamond", predicate: "intersects", object: "Problem-Solution Axis", type: "framework" },
{ subject: "Convergence-Divergence Axis", predicate: "contains", object: "Divergent Thinking", type: "concept" },
{ subject: "Convergence-Divergence Axis", predicate: "contains", object: "Convergent Thinking", type: "concept" },
{ subject: "Problem-Solution Axis", predicate: "contains", object: "Problem Space", type: "concept" },
{ subject: "Problem-Solution Axis", predicate: "contains", object: "Solution Space", type: "concept" },

// Double Diamond → Problem Solving
{ subject: "Double Diamond", predicate: "supports", object: "Problem Solving", type: "framework" },
{ subject: "Problem Solving", predicate: "requires", object: "Problem Definition", type: "concept" },
{ subject: "Problem Solving", predicate: "requires", object: "Solution Development", type: "concept" },

// ===== PROBLEM SOLVING EXPANSION =====
{ subject: "Problem Solving", predicate: "combinedWith", object: "Causal Inference", type: "concept" },
{ subject: "Problem Solving", predicate: "combinedWith", object: "Root Cause Analysis", type: "concept" },
{ subject: "Problem Solving + Causal Inference", predicate: "enables", object: "Continuous Improvement", type: "concept" },

// ===== CONTINUOUS IMPROVEMENT AS SYSTEM TRAIT =====
{ subject: "Continuous Improvement", predicate: "characterizes", object: "Highly Effective Systems", type: "concept" },
{ subject: "Highly Effective Systems", predicate: "exhibits", object: "Feedback Loops", type: "concept" },
{ subject: "Highly Effective Systems", predicate: "exhibits", object: "Adaptive Capacity", type: "concept" },
{ subject: "Continuous Improvement", predicate: "implements", object: "PDCA Cycle", type: "concept" },
{ subject: "Continuous Improvement", predicate: "relatedTo", object: "Kaizen", type: "concept" },
{ subject: "Continuous Improvement", predicate: "relatedTo", object: "Statistical Process Control", type: "concept" },

// ===== TYPE → QUADRANT MAPPING =====
{ subject: "Explorer", predicate: "occupies", object: "Problem Space + Divergent", type: "concept" },
{ subject: "Analyst", predicate: "occupies", object: "Problem Space + Convergent", type: "concept" },
{ subject: "Designer", predicate: "occupies", object: "Solution Space + Divergent", type: "concept" },
{ subject: "Builder", predicate: "occupies", object: "Solution Space + Convergent", type: "concept" },

// ===== NEIGHBORING RELATIONSHIPS =====
// Systems Thinking connections
{ subject: "Systems Thinking", predicate: "enables", object: "Problem Solving", type: "concept" },
{ subject: "Systems Thinking", predicate: "relatedTo", object: "Causal Inference", type: "concept" },
{ subject: "Systems Thinking", predicate: "relatedTo", object: "Feedback Loops", type: "concept" },

// Decision Making chain
{ subject: "Problem Solving", predicate: "informs", object: "Decision Making", type: "concept" },
{ subject: "Decision Making", predicate: "uses", object: "5 Filters", type: "framework" },
{ subject: "Decision Making", predicate: "uses", object: "Problem Audit", type: "framework" },

// Learning & Growth
{ subject: "Continuous Improvement", predicate: "requires", object: "Reflective Practice", type: "concept" },
{ subject: "Reflective Practice", predicate: "relatedTo", object: "Self Side", type: "concept" },
{ subject: "Problem Solving", predicate: "relatedTo", object: "System Side", type: "concept" },

// Deming connection (historical)
{ subject: "W. Edwards Deming", predicate: "created", object: "PDCA Cycle", type: "person" },
{ subject: "W. Edwards Deming", predicate: "influenced", object: "Continuous Improvement", type: "person" },
{ subject: "Toyota Production System", predicate: "implements", object: "Continuous Improvement", type: "concept" },
{ subject: "Toyota Production System", predicate: "implements", object: "Kaizen", type: "concept" },
```

---

## Proper RDF/Turtle Format

For canonical semantic web compliance, here's how this should be modeled:

```turtle
@prefix kh: <https://kaihamil.com/ontology/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix dc: <http://purl.org/dc/elements/1.1/> .

# ===== CUSTOM PREDICATES =====
kh:intersects rdf:type rdf:Property ;
    rdfs:label "intersects" ;
    rdfs:comment "Indicates two concepts or axes that cross to form a matrix or quadrant system" .

kh:occupies rdf:type rdf:Property ;
    rdfs:label "occupies" ;
    rdfs:comment "Indicates position within a matrix or coordinate system" .

kh:combinedWith rdf:type rdf:Property ;
    rdfs:label "combined with" ;
    rdfs:comment "Indicates synergistic combination of two concepts" .

kh:characterizes rdf:type rdf:Property ;
    rdfs:label "characterizes" ;
    rdfs:comment "Indicates a defining trait or attribute" .

kh:exhibits rdf:type rdf:Property ;
    rdfs:label "exhibits" ;
    rdfs:comment "Shows or demonstrates a quality" .

# ===== DOUBLE DIAMOND FRAMEWORK =====
kh:DoubleDiamond rdf:type kh:Framework ;
    rdfs:label "Double Diamond" ;
    dc:description "Design thinking framework with 4 phases across 2 axes" ;
    kh:intersects kh:ConvergenceDivergenceAxis ;
    kh:intersects kh:ProblemSolutionAxis ;
    kh:supports kh:ProblemSolving ;
    kh:categorizes kh:AIProblemSolverTypes .

# ===== AXES =====
kh:ConvergenceDivergenceAxis rdf:type kh:Axis ;
    rdfs:label "Convergence-Divergence Axis" ;
    skos:narrower kh:DivergentThinking ;
    skos:narrower kh:ConvergentThinking .

kh:ProblemSolutionAxis rdf:type kh:Axis ;
    rdfs:label "Problem-Solution Axis" ;
    skos:narrower kh:ProblemSpace ;
    skos:narrower kh:SolutionSpace .

# ===== AI PROBLEM SOLVER TYPES =====
kh:AIProblemSolverTypes rdf:type skos:Collection ;
    rdfs:label "AI Problem Solver Types" ;
    skos:member kh:Explorer ;
    skos:member kh:Analyst ;
    skos:member kh:Designer ;
    skos:member kh:Builder .

kh:Explorer rdf:type kh:ProblemSolverType ;
    rdfs:label "Explorer" ;
    kh:occupies "Problem Space + Divergent" ;
    kh:focusesOn kh:ProblemDiscovery .

kh:Analyst rdf:type kh:ProblemSolverType ;
    rdfs:label "Analyst" ;
    kh:occupies "Problem Space + Convergent" ;
    kh:focusesOn kh:ProblemDefinition .

kh:Designer rdf:type kh:ProblemSolverType ;
    rdfs:label "Designer" ;
    kh:occupies "Solution Space + Divergent" ;
    kh:focusesOn kh:SolutionDiscovery .

kh:Builder rdf:type kh:ProblemSolverType ;
    rdfs:label "Builder" ;
    kh:occupies "Solution Space + Convergent" ;
    kh:focusesOn kh:SolutionDelivery .

# ===== PROBLEM SOLVING → CONTINUOUS IMPROVEMENT CHAIN =====
kh:ProblemSolving rdf:type kh:Concept ;
    rdfs:label "Problem Solving" ;
    kh:combinedWith kh:CausalInference ;
    kh:combinedWith kh:RootCauseAnalysis ;
    kh:enables kh:ContinuousImprovement .

kh:ContinuousImprovement rdf:type kh:Concept ;
    rdfs:label "Continuous Improvement" ;
    kh:characterizes kh:HighlyEffectiveSystems ;
    kh:implements kh:PDCACycle ;
    skos:related kh:Kaizen ;
    skos:related kh:StatisticalProcessControl .

kh:HighlyEffectiveSystems rdf:type kh:Concept ;
    rdfs:label "Highly Effective Systems" ;
    kh:exhibits kh:FeedbackLoops ;
    kh:exhibits kh:AdaptiveCapacity ;
    kh:exhibits kh:ContinuousImprovement .
```

---

## Predicate Recommendations

| Predicate | Use Case | Example |
|-----------|----------|---------|
| `intersects` | Two axes forming a matrix | Double Diamond intersects Convergence-Divergence |
| `occupies` | Position in coordinate space | Explorer occupies Problem+Divergent |
| `combinedWith` | Synergistic combination | Problem Solving combinedWith Causal Inference |
| `enables` | Causal enablement | Combination enables Continuous Improvement |
| `characterizes` | Defining trait | CI characterizes Highly Effective Systems |
| `exhibits` | Observable quality | Systems exhibit Feedback Loops |
| `supports` | Foundational support | Double Diamond supports Problem Solving |

---

## Visual: The Expanded Graph Structure

```
                    [Convergence-Divergence Axis]
                              |
                         intersects
                              |
    [Double Diamond] ----supports----> [Problem Solving]
          |                                   |
     intersects                         combinedWith
          |                                   |
   [Problem-Solution Axis]           [Causal Inference]
                                              |
                                           enables
                                              |
                                   [Continuous Improvement]
                                              |
                                        characterizes
                                              |
                                  [Highly Effective Systems]
                                         /    |    \
                                      exhibits exhibits exhibits
                                       /      |       \
                            [Feedback] [Adaptive] [Reflective
                              Loops    Capacity    Practice]
```

---

## Suggested Next Steps

1. Update `knowledge-graph.html` with new triples
2. Add visual distinction for "Axis" type nodes
3. Consider adding W. Edwards Deming as a person entity (connects Continuous Improvement to historical roots)
4. Link Continuous Improvement ↔ Self Side via Reflective Practice (bridges System // Self)

---

*Generated: March 6, 2026*
