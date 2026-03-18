# Jeff Weber - Client Data Template
# Fill in with actual data from: https://www.homes.com/real-estate-agents/jeffrey-weber/kgce42c/
# Then run: python3 ../scripts/import_realtor_data.py

CLIENT_DATA = {
     "years_active": 4,  # Or however many years shown on profile
    "total_transactions": 36,  # Total sales shown on profile
    "neighborhoods": [
        "Hamilton",
        "Princeton",
        "Ewing",
        "Pennington",
	"Mercerville"
        # Add more neighborhoods from his active areas
    ],
    "specialties": ["first_time_buyers", "luxury_homes"],  # From profile description
    "deal_profile": {
        "average_price": 594300,  # Calculate from transaction history
        "price_range_min": 147000,
        "price_range_max": 1700000,
        "primary_property_types": ["single_family", "colonial", "cape_cod"]
    }
}

# Transaction history - add as many as visible on homes.com
# Look for: Recent Sales, Active Listings, etc.
TRANSACTIONS = [
    {
        "id": "tx-036",
        "listing_key": "L-PRIN-2025-001",
        "address": "189 Moore St, Princeton, NJ 08540",
        "price": 1600000,
        "type": "buyer_representation",
        "standard_status": "Closed",
        "days_on_market": 39,
        "date": "2025-12-18",
        "bedrooms": 3,
        "bathrooms": 2.5,
        "square_feet": 2450,
        "neighborhood": "Princeton",
        "property_type": "colonial",
        "client_type": None
    },
    {
        "id": "tx-035",
        "listing_key": "L-TREN-2025-001",
        "address": "12 Margo Place, Trenton, NJ 08620",
        "price": 505900,
        "type": "seller_representation",
        "standard_status": "Closed",
        "days_on_market": 28,
        "date": "2025-10-14",
        "bedrooms": 4,
        "bathrooms": 1.5,
        "square_feet": 1423,
        "neighborhood": "Trenton",
        "property_type": "cape_cod",
        "client_type": None
    },
    {	
        "id": "tx-034",
        "listing_key": "L-PRIN-2025-001",
        "address": "28 Amherst Way, Princeton Junction, NJ 08550",
        "price": 970000,
        "type": "buyer_representation",
        "standard_status": "Closed",
        "days_on_market": 22,
        "date": "2025-09-04",
        "bedrooms": 4,
        "bathrooms": 2.5,
        "square_feet": 2820,
        "neighborhood": "Princeton Junction",
        "property_type": "colonial",
        "client_type": None
    }, 
    {
        "id": "tx-033",
        "listing_key": "L-PRIN-2024-001",
        "address": "24 Mccomb Rd, Princeton, NJ 08540",
        "price": 1050000,
        "type": "buyer_representation",
        "standard_status": "Closed",
        "days_on_market": 6,
        "date": "2024-06-17",
        "bedrooms": 3,
        "bathrooms": 2.5,
        "square_feet": 2729,
        "neighborhood": "Princeton",
        "property_type": "townhome",
        "client_type": None
    }, 
    {
        "id": "tx-001",
        "listing_key": "L-PRIN-2022-001",
        "address": "66 Line Rd, Princeton Junction, NJ 08550",
        "price": 595000,
        "type": "seller_representation",
        "standard_status": "Closed",
        "days_on_market": 25,
        "date": "2022-08-05",
        "bedrooms": 3,
        "bathrooms": 2.5,
        "square_feet": 2988,
        "neighborhood": "Princeton Junction",
        "property_type": "colonial",
        "client_type": None
    },
    {
        "id": "tx-032",
        "listing_key": "L-PRIN-2024-001",
        "address": "7 Kimberly Ct, Princeton, NJ 08540",
        "price": 1711500,
        "type": "buyer_representation",
        "standard_status": "Closed",
        "days_on_market": 12,
        "date": "2024-07-16",
        "bedrooms": 3,
        "bathrooms": 2.5,
        "square_feet": None,
        "neighborhood": "Princeton",
        "property_type": "colonial",
        "client_type": None
    },
    {
        "id": "tx-031",
        "listing_key": "L-ROBB-2025-001",
        "address": "2346 Route 33 Unit 308, Robbinsville, NJ 08691",
        "price": 383500,
        "type": "seller_representation",
        "standard_status": "Closed",
        "days_on_market": 81,
        "date": "2025-12-09",
        "bedrooms": 2,
        "bathrooms": 2.0,
        "square_feet": 1319,
        "neighborhood": "Robbinsville",
        "property_type": "condo",
        "client_type": None
    }


    # Add more transactions here...
    # Copy format above for each visible transaction
    # REMEMBER: Include listing_key, standard_status, and days_on_market for each!
]

# Instructions for data extraction:
# 1. Visit: https://www.homes.com/real-estate-agents/jeffrey-weber/kgce42c/
# 2. Look for "Recent Sales" or "Transaction History" section
# 3. For each transaction, note:
#    - Street address (full address if visible)
#    - Sale price (listed or estimated)
#    - Date (month/year at minimum)
#    - Was Jeff representing buyer or seller?
#    - Property details if visible (beds, baths, sqft)
# 4. Note active neighborhoods/areas from his profile
# 5. Note any specialties (luxury, first-time buyers, etc.)
# 6. Save this file and run the import script
