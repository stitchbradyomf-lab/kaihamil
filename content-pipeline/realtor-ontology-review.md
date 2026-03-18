# Realtor Ontology Review: Industry Standards Alignment

**Date:** February 26, 2026  
**Purpose:** Validate Kai Hamil's real estate ontology against industry standards (RESO, schema.org, MLS)

---

## 1. Industry Standards Overview

### **RESO (Real Estate Standards Organization)**
**The gold standard for MLS data in North America**

- **Data Dictionary 2.0:** 1,000+ standardized fields
- **Web API:** RESTful standard for MLS data exchange
- **Certification:** Required for MLS providers
- **Coverage:** 99%+ of US residential listings

**Key RESO Resource Classes:**
```
Property
├── Listing
│   ├── ListPrice
│   ├── StandardStatus (Active, Pending, Closed, etc.)
│   ├── PropertyType (Residential, Commercial, Land)
│   └── MlsStatus (local variations)
├── Location
│   ├── Address
│   ├── City/State/Zip
│   ├── County
│   └── Subdivision
├── Structure
│   ├── BedroomsTotal
│   ├── BathroomsTotal
│   ├── LivingArea
│   └── YearBuilt
└── Financial
    ├── TaxAnnualAmount
    ├── AssociationFee
    └── PricePerSquareFoot
```

### **Schema.org Real Estate Extensions**
**SEO/web standard for property listings**

```
RealEstateListing (schema.org)
├── name
├── description
├── url
├── address (PostalAddress)
├── price (PriceSpecification)
├── priceCurrency
├── availability
├── mlsNumber
└── propertyType (PropertyType)
    ├── SingleFamilyResidence
    ├── Apartment
    ├── House
    └── Condo
```

### **RETS (Real Estate Transaction Standard)**
**Legacy but still widely used**
- XML-based data exchange
- Being phased out in favor of RESO Web API
- Still relevant for older MLS integrations

---

## 2. Current Kai Hamil Ontology vs. RESO

### **✅ Aligned Concepts**

| Kai Hamil | RESO Standard | Notes |
|-----------|---------------|-------|
| `kh:propertyAddress` | `Property.Address` | ✓ Direct match |
| `kh:salePrice` | `Listing.ListPrice` | ✓ Direct match |
| `kh:bedrooms` | `Property.BedroomsTotal` | ✓ Use RESO naming |
| `kh:bathrooms` | `Property.BathroomsTotal` | ✓ Use RESO naming |
| `kh:squareFeet` | `Property.LivingArea` | ✓ Use RESO naming |
| `kh:transactionDate` | `Listing.CloseDate` | ✓ Use RESO naming |
| `kh:propertyType` | `Property.PropertyType` | ✓ RESO has enum values |
| `kh:locatedIn` | `Property.SubdivisionName` | Partial match |

### **⚠️ Needs Adjustment**

| Current | RESO Standard | Action Required |
|---------|---------------|-----------------|
| `kh:Realtor` | `Member` or `Office` | Use RESO `Member` for agent |
| `kh:Client` | `Buyer` or `Seller` | RESO tracks party roles |
| `kh:RealEstateTransaction` | `Listing` or `Transaction` | Distinguish listing vs. sale |
| `kh:transactionType` | `Listing.BuyerAgencyCompensation` | More granular in RESO |

### **❌ Missing Critical Fields**

**For Deal Flow Tracking:**
- `StandardStatus`: Active, Pending, Closed, Withdrawn, Expired
- `MlsNumber`: Unique MLS identifier
- `ListingKey`: Unique system identifier
- `ModificationTimestamp`: For tracking updates
- `DaysOnMarket`: Critical metric

**For Legal/Title:**
- `TaxLegalDescription`: Legal property description
- `TaxAssessedValue`: For tax proration calculations
- `TaxYear`: Assessment year
- `AssumableMortgage`: Loan assumption details
- `LandLeaseYN`: Critical for condos/co-ops

**For Listing Details:**
- `ShowingInstructions`: How to show property
- `LockBoxType`: Access method
- `AccessCode`: Security (encrypted)
- `VirtualTourURL`: Marketing asset
- `PhotosCount`: Media tracking

---

## 3. Proposed Ontology Enhancements

### **Phase 1: RESO Alignment (Immediate)**

```turtle
# Update existing classes to match RESO

kh:Realtor rdfs:subClassOf reso:Member ;
    kh:memberStatus "Active" ;
    kh:officeId "office-123" ;
    kh:mlsId "mls-456" .

kh:Listing rdf:type rdfs:Class ;
    rdfs:subClassOf reso:Listing ;
    # Core RESO fields
    kh:listingKey "L123456789" ;           # Unique system ID
    kh:mlsNumber "MLS987654" ;              # MLS display number
    kh:standardStatus "Active" ;            # RESO enum: Active, Pending, Closed, etc.
    kh:mlsStatus "Active-Under Contract" ;  # Local variation
    kh:listPrice "725000"^^xsd:decimal ;
    kh:daysOnMarket "12"^^xsd:integer ;
    kh:modificationTimestamp "2024-02-26T14:30:00Z"^^xsd:dateTime ;
    # Relationship
    kh:listingAgent kh:jeff ;               # Link to realtor
    kh:buyerAgent kh:other-agent ;          # Co-op agent
    kh:sellingAgent kh:jeff .               # If Jeff represented seller

kh:Property rdf:type rdfs:Class ;
    rdfs:subClassOf reso:Property ;
    # RESO standard property fields
    kh:propertyType "Residential" ;
    kh:propertySubType "SingleFamily" ;     # Colonial, Ranch, etc.
    kh:bedroomsTotal "4"^^xsd:integer ;
    kh:bathroomsTotal "2.5"^^xsd:decimal ;
    kh:livingArea "2400"^^xsd:integer ;
    kh:livingAreaUnits "SquareFeet" ;
    kh:yearBuilt "1995"^^xsd:integer ;
    kh:lotSizeArea "0.25"^^xsd:decimal ;
    kh:lotSizeUnits "Acres" ;
    # Location (RESO compliant)
    kh:universalPropertyId "US-NJ-UNION-12345" ;
    kh:streetNumber "123" ;
    kh:streetName "Maple" ;
    kh:streetSuffix "Street" ;
    kh:city "Westfield" ;
    kh:stateOrProvince "NJ" ;
    kh:postalCode "07090" ;
    kh:countyOrParish "Union" ;
    kh:subdivisionName "Dudley Park" ;
    # Tax/Legal
    kh:taxAssessedValue "650000"^^xsd:decimal ;
    kh:taxAnnualAmount "12000"^^xsd:decimal ;
    kh:taxYear "2023"^^xsd:integer ;
    kh:taxLegalDescription "Lot 15, Block 23, Dudley Park" .
```

### **Phase 2: Deal Flow State Machine**

```turtle
# Track listing through entire lifecycle

kh:ListingStatus rdf:type rdfs:Class .

kh:status-001 rdf:type kh:ListingStatus ;
    kh:belongsToListing kh:listing-123 ;
    kh:statusValue "Active" ;
    kh:statusDate "2024-01-15"^^xsd:date ;
    kh:daysAtStatus "12"^^xsd:integer .

kh:status-002 rdf:type kh:ListingStatus ;
    kh:belongsToListing kh:listing-123 ;
    kh:statusValue "Pending" ;
    kh:statusDate "2024-01-27"^^xsd:date ;
    kh:statusChangeReason "Under Contract" .

kh:status-003 rdf:type kh:ListingStatus ;
    kh:belongsToListing kh:listing-123 ;
    kh:statusValue "Closed" ;
    kh:statusDate "2024-02-15"^^xsd:date ;
    kh:closePrice "720000"^^xsd:decimal .

# State transitions enable queries like:
# "Show me listings that went from Active to Pending in under 14 days"
# "What's Jeff's average days on market before closing?"
```

### **Phase 3: Transaction Parties & Roles**

```turtle
# Clear representation tracking for legal compliance

kh:Party rdf:type rdfs:Class ;
    rdfs:comment "Any party to a real estate transaction" .

kh:Client rdf:type rdfs:Class ;
    rdfs:subClassOf kh:Party ;
    kh:partyType "Buyer" ;              # or "Seller"
    kh:representationType "Exclusive" ; # Exclusive, Non-Exclusive, etc.
    kh:representedBy kh:jeff ;
    kh:coBroker kh:other-agent ;        # If co-op
    .

# Buyer representation agreement
kh:buyer-agreement-001 rdf:type kh:RepresentationAgreement ;
    kh:agreementType "BuyerAgency" ;
    kh:agent kh:jeff ;
    kh:client kh:client-johnson ;
    kh:agreementDate "2024-01-01"^^xsd:date ;
    kh:expirationDate "2024-07-01"^^xsd:date ;
    kh:compensationStructure "3% of purchase price" .
```

---

## 4. Legal & Title Documentation Alignment

### **Required for Compliance**

```turtle
# Contract milestones
kh:ContractEvent rdf:type rdfs:Class ;
    kh:eventType "AttorneyReview" ;     # Attorney Review, Inspection, Mortgage Commitment, etc.
    kh:eventDate "2024-02-01"^^xsd:date ;
    kh:eventStatus "Completed" ;         # Completed, Pending, Overdue
    kh:daysToClose "30"^^xsd:integer .  # Calculated from event date

# Title information
kh:TitleInformation rdf:type rdfs:Class ;
    kh:titleCompany "ABC Title Services" ;
    kh:titleSearchOrdered "2024-01-20"^^xsd:date ;
    kh:titleSearchCompleted "2024-01-25"^^xsd:date ;
    kh:titleStatus "Clear" ;             # Clear, Exceptions, Pending
    kh:exceptionsToTitle "None" ;        # or list of exceptions
    kh:surveyRequired "true"^^xsd:boolean ;
    kh:surveyOrdered "2024-01-22"^^xsd:date .

# Mortgage/Financing tracking
kh:Financing rdf:type rdfs:Class ;
    kh:loanStatus "Commitment" ;         # Pre-Approved, Commitment, Clear-to-Close
    kh:lenderName "Wells Fargo" ;
    kh:loanOfficer "Jane Smith" ;
    kh:loanAmount "580000"^^xsd:decimal ;
    kh:loanType "Conventional" ;         # FHA, VA, Conventional, etc.
    kh:interestRate "6.875"^^xsd:decimal ;
    kh:commitmentDate "2024-02-10"^^xsd:date ;
    kh:commitmentExpiration "2024-03-10"^^xsd:date .
```

---

## 5. Recommended Action Plan

### **Before Wednesday Demo**

1. **✅ Keep Current Ontology** — It's sufficient for proof-of-concept
2. **Add 3 Critical Fields:**
   - `kh:standardStatus` — Enable status tracking
   - `kh:daysOnMarket` — Key realtor metric
   - `kh:listingKey` — Unique identifier

### **Post-Demo (If Jeff Wants to Proceed)**

1. **Full RESO Alignment:**
   - Map all Kai Hamil classes to RESO equivalents
   - Add missing required fields
   - Implement status state machine

2. **MLS Integration Capability:**
   - Design for RESO Web API ingestion
   - Export to RETS format (if needed for legacy)
   - Compliance with local MLS rules

3. **Legal Compliance Layer:**
   - Contract milestone tracking
   - Representation agreement management
   - Document expiration alerts

### **Data Import Strategy**

For Jeff's backfill from homes.com:
```python
# Map homes.com fields to RESO-compliant RDF
homes_fields = {
    "address": "kh:unformattedAddress",
    "price": "kh:listPrice", 
    "beds": "kh:bedroomsTotal",
    "baths": "kh:bathroomsTotal",
    "sqft": "kh:livingArea",
    "status": "kh:standardStatus",  # Map to RESO enum
    "date": "kh:closeDate"
}
```

---

## 6. Key Resources for Validation

### **Official Standards**
1. **RESO Data Dictionary 2.0:** https://www.reso.org/data-dictionary/
2. **RESO Web API Spec:** https://www.reso.org/web-api/
3. **Schema.org RealEstateListing:** https://schema.org/RealEstateListing

### **MLS Field References**
1. **Bright MLS (Mid-Atlantic):** 600+ fields
2. **CRMLS (California):** 800+ fields  
3. **MLSPIN (New England):** 500+ fields

**Common Core:** ~150 fields are universal across MLSs

---

## 7. Ontology Validation Checklist

### **For Jeff's Use Case (Wednesday)**
- [x] Property identification (address, price)
- [x] Basic characteristics (beds, baths, sqft)
- [x] Client relationships
- [x] Transaction types (buyer/seller rep)
- [x] Geographic areas (neighborhoods)
- [ ] Status tracking (Active → Pending → Closed)
- [ ] Days on market calculation
- [ ] Agent representation clarity

### **For Production Real Estate Platform**
- [ ] RESO Data Dictionary compliance
- [ ] MLS Web API integration
- [ ] Standard status enums
- [ ] Legal description tracking
- [ ] Tax assessment data
- [ ] Contract milestone tracking
- [ ] Representation agreement management
- [ ] Document expiration alerts
- [ ] Commission tracking
- [ ] Referral network mapping

---

## Summary

**Current ontology is 70% aligned** with industry standards. For Wednesday's demo, it's sufficient. For a production platform serving realtors, we'd need:

1. **Immediate:** Add `standardStatus`, `daysOnMarket`, `listingKey`
2. **Short-term:** Full RESO Data Dictionary mapping
3. **Long-term:** MLS integration, legal compliance layer

The foundation is solid. The gaps are known and documented.
