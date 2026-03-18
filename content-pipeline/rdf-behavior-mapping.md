# RDF Behavior Mapping: AI User Assessment

**Date:** February 26, 2026  
**Purpose:** Map behavioral assessment data to RDF triples for Knowledge Graph integration and cross-system correlation discovery

---

## Ontology Structure

### Namespace
```turtle
@prefix kh: <http://kaihamil.com/ontology/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix schema: <http://schema.org/> .
```

### Core Classes

```turtle
kh:AIUser rdf:type rdfs:Class ;
    rdfs:label "AI User" ;
    rdfs:comment "A person who uses AI tools and systems" .

kh:BehaviorProfile rdf:type rdfs:Class ;
    rdfs:label "Behavior Profile" ;
    rdfs:comment "Assessment results capturing AI usage behaviors" .

kh:Behavior rdf:type rdfs:Class ;
    rdfs:label "Behavior" ;
    rdfs:comment "Specific behavioral pattern exhibited by a user" .

kh:AIUserType rdf:type rdfs:Class ;
    rdfs:label "AI User Type" ;
    rdfs:comment "Classification of AI user based on behavioral patterns" .

kh:System rdf:type rdfs:Class ;
    rdfs:label "System" ;
    rdfs:comment "An invisible infrastructure pattern in the user's life" .
```

### User Type Instances

```turtle
kh:Explorer rdf:type kh:AIUserType ;
    rdfs:label "Explorer" ;
    kh:directiveLevel "low" ;
    kh:executionLevel "low" ;
    kh:coreTrait "curiosity" ;
    kh:riskPattern "explorationWithoutClosure" .

kh:Operator rdf:type kh:AIUserType ;
    rdfs:label "Operator" ;
    kh:directiveLevel "low" ;
    kh:executionLevel "high" ;
    kh:coreTrait "systematization" ;
    kh:riskPattern "perfectionism" .

kh:Director rdf:type kh:AIUserType ;
    rdfs:label "Director" ;
    kh:directiveLevel "high" ;
    kh:executionLevel "low" ;
    kh:coreTrait "strategicVision" ;
    kh:riskPattern "analysisParalysis" .

kh:Implementer rdf:type kh:AIUserType ;
    rdfs:label "Implementer" ;
    kh:directiveLevel "high" ;
    kh:executionLevel "high" ;
    kh:coreTrait "executionSpeed" ;
    kh:riskPattern "missingAlternatives" .
```

---

## Assessment Response Mapping

### Example: User Response to Q1

**Question:** "Your workflow breaks. You need to understand why."

**Answer:** "Ask ChatGPT to compare 3 possible root causes, then decide which to investigate"

**Mapped to RDF:**

```turtle
# The user
kh:user123 rdf:type kh:AIUser ;
    foaf:name "Kyle" ;
    kh:hasBehaviorProfile kh:profile123 .

# The assessment profile
kh:profile123 rdf:type kh:BehaviorProfile ;
    kh:assessmentDate "2026-02-26"^^xsd:date ;
    kh:assessmentType "advancedBehavioral" ;
    kh:primaryType kh:Director ;
    kh:directorScore 3 ;
    kh:explorerScore 2 ;
    kh:operatorScore 1 ;
    kh:implementerScore 0 .

# The specific behavior detected
kh:profile123 kh:exhibitsBehavior kh:behaviorQ1Director .

kh:behaviorQ1Director rdf:type kh:Behavior ;
    kh:context "ProblemSolving" ;
    kh:scenario "WorkflowBreakdown" ;
    kh:action "CompareOptionsBeforeDeciding" ;
    kh:indicatesType kh:Director ;
    kh:confidenceScore 0.85 .
```

---

## Behavior Pattern Ontology

### Problem-Solving Behaviors

```turtle
kh:ProblemSolving rdf:type kh:BehaviorContext ;
    rdfs:label "Problem Solving" .

kh:ExploreFirst rdf:type kh:BehaviorPattern ;
    kh:context kh:ProblemSolving ;
    kh:indicates kh:Explorer ;
    kh:description "Seeks to understand through open exploration" .

kh:SystematizeApproach rdf:type kh:BehaviorPattern ;
    kh:context kh:ProblemSolving ;
    kh:indicates kh:Operator ;
    kh:description "Uses templates and systematic methods" .

kh:CompareOptions rdf:type kh:BehaviorPattern ;
    kh:context kh:ProblemSolving ;
    kh:indicates kh:Director ;
    kh:description "Evaluates alternatives before deciding" .

kh:AutomateSolution rdf:type kh:BehaviorPattern ;
    kh:context kh:ProblemSolving ;
    kh:indicates kh:Implementer ;
    kh:description "Builds reusable automated solutions" .
```

### Communication Behaviors

```turtle
kh:Communication rdf:type kh:BehaviorContext ;
    rdfs:label "Communication" .

kh:ConversationalExploration rdf:type kh:BehaviorPattern ;
    kh:context kh:Communication ;
    kh:indicates kh:Explorer ;
    kh:description "Explores tones and approaches conversationally" .

kh:TemplateBased rdf:type kh:BehaviorPattern ;
    kh:context kh:Communication ;
    kh:indicates kh:Operator ;
    kh:description "Uses structured templates systematically" .

kh:GenerateOptions rdf:type kh:BehaviorPattern ;
    kh:context kh:Communication ;
    kh:indicates kh:Director ;
    kh:description "Requests multiple versions to choose from" .

kh:DirectAndEdit rdf:type kh:BehaviorPattern ;
    kh:context kh:Communication ;
    kh:indicates kh:Implementer ;
    kh:description "Gives brief direction, quick edits, ships" .
```

### Learning Behaviors

```turtle
kh:Learning rdf:type kh:BehaviorContext ;
    rdfs:label "Learning" .

kh:PlayfulDiscovery rdf:type kh:BehaviorPattern ;
    kh:context kh:Learning ;
    kh:indicates kh:Explorer ;
    kh:description "Learns through experimentation and play" .

kh:SystematicTesting rdf:type kh:BehaviorPattern ;
    kh:context kh:Learning ;
    kh:indicates kh:Operator ;
    kh:description "Tests methodically and documents results" .

kh:ResearchThenApply rdf:type kh:BehaviorPattern ;
    kh:context kh:Learning ;
    kh:indicates kh:Director ;
    kh:description "Studies best practices before testing" .

kh:LearningByDoing rdf:type kh:BehaviorPattern ;
    kh:context kh:Learning ;
    kh:indicates kh:Implementer ;
    kh:description "Builds to learn, learns through building" .
```

---

## Cross-System Correlation Mapping

### Purpose
Enable queries like:
- "Show me all Explorer-types with high friction in communication systems"
- "Find correlation between exploratory AI use and decision fatigue"
- "Which user types struggle most with logistics coordination?"

### Example Correlations

```turtle
# Link AI behavior to invisible infrastructure
kh:profile123 kh:correlatesWithSystem kh:communicationSystem456 .

kh:communicationSystem456 rdf:type kh:System ;
    kh:systemCategory "CommunicationCoordination" ;
    kh:specificPattern "ReactiveRelay" ;
    kh:maturityLevel 1 ;
    kh:constraint "visibility" ;
    kh:driver "frustration" .

# The correlation
kh:correlation789 rdf:type kh:BehaviorSystemCorrelation ;
    kh:behaviorProfile kh:profile123 ;
    kh:system kh:communicationSystem456 ;
    kh:correlationType "typeSystemFriction" ;
    kh:observation "Directors experience high friction in Reactive Relay systems due to lack of visibility for option comparison" ;
    kh:recommendedIntervention "Introduce shared visibility layer (weekly sync, decision log)" .
```

### Correlation Types

```turtle
kh:typeSystemFriction rdf:type kh:CorrelationType ;
    rdfs:label "Type-System Friction" ;
    rdfs:comment "Friction arising from mismatch between user type and system pattern" .

kh:typeSystemAlignment rdf:type kh:CorrelationType ;
    rdfs:label "Type-System Alignment" ;
    rdfs:comment "High performance due to match between user type and system pattern" .

kh:behaviorPrediction rdf:type kh:CorrelationType ;
    rdfs:label "Behavior Prediction" ;
    rdfs:comment "User behavior in one context predicts behavior in another" .
```

---

## Query Examples

### Find friction patterns for a user type
```sparql
SELECT ?system ?pattern ?friction
WHERE {
    ?correlation kh:behaviorProfile ?profile ;
               kh:system ?system ;
               kh:correlationType kh:typeSystemFriction .
    ?profile kh:primaryType kh:Explorer .
    ?system kh:specificPattern ?pattern ;
            kh:driver ?friction .
}
```

### Find users with similar patterns
```sparql
SELECT ?user ?primaryType
WHERE {
    ?user kh:hasBehaviorProfile ?profile .
    ?profile kh:primaryType ?primaryType ;
             kh:exhibitsBehavior ?behavior .
    ?behavior kh:context "ProblemSolving" ;
              kh:action "CompareOptionsBeforeDeciding" .
}
```

### Correlate AI usage with life system maturity
```sparql
SELECT ?user ?aiType ?systemCategory ?maturity
WHERE {
    ?user kh:hasBehaviorProfile ?profile ;
          kh:correlatesWithSystem ?system .
    ?profile kh:primaryType ?aiType .
    ?system kh:systemCategory ?systemCategory ;
            kh:maturityLevel ?maturity .
    FILTER (?maturity < 3)
}
ORDER BY ?aiType ?maturity
```

---

## Integration with Invisible Infrastructure Framework

### System Taxonomy Link

```turtle
# Link to Communication & Coordination systems
kh:CommunicationCoordination rdf:type kh:SystemCategory ;
    rdfs:label "Communication & Coordination" ;
    kh:includesPattern "ReactiveRelay" ;
    kh:includesPattern "MonitoredMarketplace" ;
    kh:includesPattern "LogisticsCouncil" .

# Patterns detected from system detector tool
kh:ReactiveRelay rdf:type kh:SystemPattern ;
    rdfs:label "Reactive Relay" ;
    kh:maturityLevel 1 ;
    kh:typicalUserTypes (kh:Explorer kh:Director) ;
    kh:frictionPoint "lastMinuteCoordination" .
```

### Recommended Tool Mapping

```turtle
kh:profile123 kh:recommendedTool kh:problemAudit ;
    kh:recommendationReason "Director type with Reactive Relay system — needs structured diagnostic before action" .

kh:problemAudit rdf:type kh:Tool ;
    rdfs:label "Problem Audit" ;
    kh:toolType "diagnosticFramework" ;
    kh:bestForTypes (kh:Director kh:Explorer) ;
    kh:addressesSystem "ReactiveRelay" .
```

---

## Data Collection Points

### From Assessment Tool
- Each question response → `kh:exhibitsBehavior`
- Score distribution → `kh:primaryType`, `kh:*Score` properties
- Time spent per question → `kh:responseTime` (future)
- Navigation patterns → `kh:navigationPattern` (future)

### From System Detector
- Detected system pattern → `kh:correlatesWithSystem`
- System maturity → `kh:maturityLevel`
- Constraint type → `kh:constraint`
- Driver emotion → `kh:driver`

### For Correlation Discovery
- Tool usage patterns
- Return visits
- Framework completion rates
- Report generation frequency

---

## Implementation Notes

1. **Privacy**: Store user IDs as hashes, not plaintext emails
2. **Versioning**: Track ontology versions as assessment evolves
3. **Federation**: Design for eventual federation with other knowledge graphs
4. **Export**: Enable user data export in standard RDF formats

---

*This mapping enables the Knowledge Graph to surface patterns like: "Explorers using Reactive Relay systems benefit most from Problem Audit → Cause & Effect framework sequence"*
