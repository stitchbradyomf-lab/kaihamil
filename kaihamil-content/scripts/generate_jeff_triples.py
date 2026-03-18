#!/usr/bin/env python3
"""Generate RDF triples from Jeff's real data"""
import sys
sys.path.insert(0, '/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/clients/jeff')
from jeff_data_template import CLIENT_DATA, TRANSACTIONS

CLIENT_ID = "jeff"
TRIPLES_DIR = "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/clients/jeff/triples"

RDF_PREFIX = """@prefix kh: <http://kaihamil.com/ontology/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .

"""

def create_client_triples():
    triples = []
    triples.append(f"kh:{CLIENT_ID} rdf:type kh:Realtor ;")
    triples.append(f'    kh:name "Jeffrey Weber" ;')
    triples.append(f'    kh:yearsActive "{CLIENT_DATA["years_active"]}"^^xsd:integer ;')
    triples.append(f'    kh:totalTransactions "{CLIENT_DATA["total_transactions"]}"^^xsd:integer ;')
    triples.append(f'    kh:profileUrl "https://www.homes.com/real-estate-agents/jeffrey-weber/kgce42c/" ;')
    
    for neighborhood in CLIENT_DATA["neighborhoods"]:
        triples.append(f'    kh:activeInArea "{neighborhood}" ;')
    
    triples.append("    .")
    return "\n".join(triples)

def create_neighborhood_triples():
    triples = []
    for neighborhood in CLIENT_DATA["neighborhoods"]:
        area_id = neighborhood.lower().replace(" ", "-")
        triples.append(f"kh:area-{area_id} rdf:type kh:Neighborhood ;")
        triples.append(f'    kh:name "{neighborhood}" ;')
        triples.append(f'    kh:servedBy kh:{CLIENT_ID} ;')
        triples.append("    .")
    return "\n".join(triples)

def create_transaction_triples(tx):
    tx_id = tx["id"]
    triples = []
    
    triples.append(f"kh:{tx_id} rdf:type kh:RealEstateTransaction ;")
    triples.append(f'    kh:representedBy kh:{CLIENT_ID} ;')
    triples.append(f'    kh:listingKey "{tx["listing_key"]}" ;')
    triples.append(f'    kh:propertyAddress "{tx["address"]}" ;')
    triples.append(f'    kh:salePrice "{tx["price"]}"^^xsd:decimal ;')
    triples.append(f'    kh:transactionType "{tx["type"]}" ;')
    triples.append(f'    kh:standardStatus "{tx["standard_status"]}" ;')
    triples.append(f'    kh:daysOnMarket "{tx["days_on_market"]}"^^xsd:integer ;')
    triples.append(f'    kh:transactionDate "{tx["date"]}"^^xsd:date ;')
    
    if tx.get("bedrooms"):
        triples.append(f'    kh:bedrooms "{tx["bedrooms"]}"^^xsd:integer ;')
    if tx.get("bathrooms"):
        triples.append(f'    kh:bathrooms "{tx["bathrooms"]}"^^xsd:decimal ;')
    if tx.get("square_feet"):
        triples.append(f'    kh:squareFeet "{tx["square_feet"]}"^^xsd:integer ;')
    
    area_id = tx["neighborhood"].lower().replace(" ", "-")
    triples.append(f'    kh:locatedIn kh:area-{area_id} ;')
    triples.append(f'    kh:propertyType "{tx["property_type"]}" ;')
    
    if tx.get("client_type"):
        triples.append(f'    kh:clientType "{tx["client_type"]}" ;')
    
    triples.append("    .")
    return "\n".join(triples)

# Generate all triples
all_triples = [RDF_PREFIX]
all_triples.append("# Client Profile")
all_triples.append(create_client_triples())
all_triples.append("")
all_triples.append("# Neighborhoods")
all_triples.append(create_neighborhood_triples())
all_triples.append("")
all_triples.append("# Transactions")
for tx in TRANSACTIONS:
    all_triples.append(create_transaction_triples(tx))
    all_triples.append("")

# Save
output_path = f"{TRIPLES_DIR}/20260227-real-data.ttl"
with open(output_path, 'w') as f:
    f.write("\n".join(all_triples))

print(f"✓ Generated {len(TRANSACTIONS)} transaction triples")
print(f"✓ Saved to: {output_path}")
