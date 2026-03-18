#!/usr/bin/env python3
"""
Realtor Data Importer - Backfill from Homes.com Profile
Converts transaction history into RDF triples for Knowledge Graph
"""

import json
import os
from datetime import datetime
from typing import List, Dict

# Configuration
CLIENT_ID = "jeff"
CLIENT_NAME = "Jeffrey Weber"
BASE_DIR = os.path.expanduser("~/.openclaw/workspace/kaihamil-content/clients")
RAW_DIR = f"{BASE_DIR}/{CLIENT_ID}/raw"
TRIPLES_DIR = f"{BASE_DIR}/{CLIENT_ID}/triples"
EXTRACTED_DIR = f"{BASE_DIR}/{CLIENT_ID}/extracted"

# RDF Namespace
RDF_PREFIX = """@prefix kh: <http://kaihamil.com/ontology/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .

"""

def save_raw_note(content: str, note_type: str = "transaction") -> str:
    """Save original note/raw data"""
    timestamp = datetime.now().isoformat()
    filename = f"{timestamp}-{note_type}.json"
    filepath = f"{RAW_DIR}/{filename}"
    
    data = {
        "timestamp": timestamp,
        "type": note_type,
        "source": "homes.com_profile",
        "content": content
    }
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    
    return filename

def create_client_triples(client_data: Dict) -> str:
    """Generate RDF triples for client/realtor profile"""
    triples = []
    
    # Client entity
    triples.append(f"kh:{CLIENT_ID} rdf:type kh:Realtor ;")
    triples.append(f'    kh:name "{CLIENT_NAME}" ;')
    triples.append(f'    kh:yearsActive "{client_data.get("years_active", 5)}"^^xsd:integer ;')
    triples.append(f'    kh:totalTransactions "{client_data.get("total_transactions", 0)}"^^xsd:integer ;')
    triples.append(f'    kh:profileUrl "https://www.homes.com/real-estate-agents/jeffrey-weber/kgce42c/" ;')
    
    # Active neighborhoods
    for neighborhood in client_data.get("neighborhoods", []):
        triples.append(f'    kh:activeInArea "{neighborhood}" ;')
    
    triples.append("    .")
    
    return "\n".join(triples)

def create_transaction_triples(transaction: Dict) -> str:
    """Generate RDF triples for a single transaction"""
    tx_id = transaction.get("id", f"tx-{datetime.now().timestamp()}")
    triples = []
    
    # Transaction entity
    triples.append(f"kh:{tx_id} rdf:type kh:RealEstateTransaction ;")
    triples.append(f'    kh:representedBy kh:{CLIENT_ID} ;')
    
    # CRITICAL FIELD 1: Unique listing identifier
    listing_key = transaction.get("listing_key", tx_id)
    triples.append(f'    kh:listingKey "{listing_key}" ;')
    
    triples.append(f'    kh:propertyAddress "{transaction.get("address", "")}" ;')
    triples.append(f'    kh:salePrice "{transaction.get("price", 0)}"^^xsd:decimal ;')
    
    # Transaction type (buy/sell)
    tx_type = transaction.get("type", "sale")  # buyer_representation or seller_representation
    triples.append(f'    kh:transactionType "{tx_type}" ;')
    
    # CRITICAL FIELD 2: Standard status (Active, Pending, Closed, etc.)
    standard_status = transaction.get("standard_status", "Closed")
    triples.append(f'    kh:standardStatus "{standard_status}" ;')
    
    # CRITICAL FIELD 3: Days on market
    days_on_market = transaction.get("days_on_market", 0)
    triples.append(f'    kh:daysOnMarket "{days_on_market}"^^xsd:integer ;')
    
    # Date
    if "date" in transaction:
        triples.append(f'    kh:transactionDate "{transaction["date"]}"^^xsd:date ;')
    
    # Property details
    if "bedrooms" in transaction:
        triples.append(f'    kh:bedrooms "{transaction["bedrooms"]}"^^xsd:integer ;')
    if "bathrooms" in transaction:
        triples.append(f'    kh:bathrooms "{transaction["bathrooms"]}"^^xsd:decimal ;')
    if "square_feet" in transaction:
        triples.append(f'    kh:squareFeet "{transaction["square_feet"]}"^^xsd:integer ;')
    
    # Neighborhood/area
    if "neighborhood" in transaction:
        triples.append(f'    kh:locatedIn "{transaction["neighborhood"]}" ;')
        # Create connection to area
        triples.append(f'    kh:locatedIn kh:area-{transaction["neighborhood"].lower().replace(" ", "-")} ;')
    
    # Client info (anonymized for demo)
    if "client_type" in transaction:
        triples.append(f'    kh:clientType "{transaction["client_type"]}" ;')  # first_time_buyer, investor, etc.
    
    triples.append("    .")
    
    return "\n".join(triples)

def create_neighborhood_triples(neighborhoods: List[str]) -> str:
    """Create area/neighborhood entities"""
    triples = []
    
    for neighborhood in neighborhoods:
        area_id = neighborhood.lower().replace(" ", "-")
        triples.append(f"kh:area-{area_id} rdf:type kh:Neighborhood ;")
        triples.append(f'    kh:name "{neighborhood}" ;')
        triples.append(f'    kh:servedBy kh:{CLIENT_ID} ;')
        triples.append("    .")
    
    return "\n".join(triples)

def create_patterns_and_insights(transactions: List[Dict]) -> str:
    """Generate derived insights from transaction patterns"""
    triples = []
    
    # Calculate patterns
    price_range = {}
    property_types = {}
    
    for tx in transactions:
        price = tx.get("price", 0)
        if price < 300000:
            range_key = "entry_level"
        elif price < 600000:
            range_key = "mid_market"
        else:
            range_key = "luxury"
        
        price_range[range_key] = price_range.get(range_key, 0) + 1
        
        prop_type = tx.get("property_type", "single_family")
        property_types[prop_type] = property_types.get(prop_type, 0) + 1
    
    # Create expertise profile
    expertise_id = f"{CLIENT_ID}-expertise"
    triples.append(f"kh:{expertise_id} rdf:type kh:ExpertiseProfile ;")
    triples.append(f"    kh:belongsTo kh:{CLIENT_ID} ;")
    
    for range_key, count in price_range.items():
        triples.append(f'    kh:specializesInPriceRange "{range_key}" ;')
        triples.append(f'    kh:{range_key}Transactions "{count}"^^xsd:integer ;')
    
    for prop_type, count in property_types.items():
        triples.append(f'    kh:handlesPropertyType "{prop_type}" ;')
    
    triples.append("    .")
    
    return "\n".join(triples)

def import_all_data(client_data: Dict, transactions: List[Dict]) -> str:
    """Main import function - creates complete RDF dataset"""
    
    # Save raw data
    raw_content = {
        "client_profile": client_data,
        "transactions": transactions,
        "imported_at": datetime.now().isoformat()
    }
    raw_file = save_raw_note(json.dumps(raw_content, indent=2), "profile_import")
    print(f"✓ Saved raw data: {raw_file}")
    
    # Generate all triples
    all_triples = []
    all_triples.append(RDF_PREFIX)
    
    # Client profile
    all_triples.append("# Client Profile")
    all_triples.append(create_client_triples(client_data))
    all_triples.append("")
    
    # Neighborhoods
    all_triples.append("# Active Neighborhoods/Areas")
    all_triples.append(create_neighborhood_triples(client_data.get("neighborhoods", [])))
    all_triples.append("")
    
    # Transactions
    all_triples.append("# Transaction History")
    for tx in transactions:
        all_triples.append(create_transaction_triples(tx))
        all_triples.append("")
    
    # Derived insights
    all_triples.append("# Derived Patterns and Insights")
    all_triples.append(create_patterns_and_insights(transactions))
    
    # Save triples file
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    triples_filename = f"{timestamp}-import.ttl"
    triples_path = f"{TRIPLES_DIR}/{triples_filename}"
    
    with open(triples_path, 'w') as f:
        f.write("\n".join(all_triples))
    
    print(f"✓ Generated RDF triples: {triples_path}")
    
    # Create summary for web view
    summary = {
        "client_id": CLIENT_ID,
        "client_name": CLIENT_NAME,
        "total_transactions": len(transactions),
        "active_neighborhoods": client_data.get("neighborhoods", []),
        "years_active": client_data.get("years_active", 5),
        "price_range_specialization": {},
        "last_updated": datetime.now().isoformat()
    }
    
    summary_path = f"{EXTRACTED_DIR}/profile-summary.json"
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"✓ Saved summary: {summary_path}")
    
    return triples_path

# Sample data structure for manual entry
SAMPLE_CLIENT_DATA = {
    "years_active": 5,
    "total_transactions": 47,
    "neighborhoods": [
        "Westfield",
        "Cranford",
        "Mountainside",
        "Scotch Plains"
    ],
    "specialties": ["first_time_buyers", "luxury_homes"]
}

SAMPLE_TRANSACTIONS = [
    {
        "id": "tx-001",
        "address": "123 Maple Street, Westfield, NJ",
        "price": 725000,
        "type": "buyer_representation",
        "date": "2024-01-15",
        "bedrooms": 4,
        "bathrooms": 2.5,
        "square_feet": 2400,
        "neighborhood": "Westfield",
        "property_type": "colonial",
        "client_type": "family_upgrading"
    },
    {
        "id": "tx-002",
        "address": "456 Oak Avenue, Cranford, NJ",
        "price": 485000,
        "type": "seller_representation",
        "date": "2024-02-03",
        "bedrooms": 3,
        "bathrooms": 2,
        "square_feet": 1800,
        "neighborhood": "Cranford",
        "property_type": "cape_cod",
        "client_type": "empty_nester_downsizing"
    }
]

if __name__ == "__main__":
    print("=" * 60)
    print("Realtor Data Importer for Knowledge Graph")
    print("=" * 60)
    print()
    print("To import Jeff's actual data:")
    print("1. Edit this script with real transaction data from homes.com")
    print("2. Run: python3 import_realtor_data.py")
    print("3. Check generated files in clients/jeff/")
    print()
    print("Using SAMPLE data for now (2 transactions)...")
    print()
    
    # Run with sample data
    result_path = import_all_data(SAMPLE_CLIENT_DATA, SAMPLE_TRANSACTIONS)
    
    print()
    print(f"✅ Import complete! Files created:")
    print(f"   Raw data: {RAW_DIR}/")
    print(f"   RDF triples: {result_path}")
    print(f"   Summary: {EXTRACTED_DIR}/profile-summary.json")
