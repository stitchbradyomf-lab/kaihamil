# Jeff Weber Data Backfill - Instructions

## Goal
Pre-populate Jeff's Knowledge Graph with his actual transaction history from homes.com profile.

## What You'll Need
1. URL: https://www.homes.com/real-estate-agents/jeffrey-weber/kgce42c/
2. 10-15 minutes to extract transaction data
3. This script will handle the rest

## Step-by-Step Process

### Step 1: Extract Data from Homes.com

Visit Jeff's profile and collect:

**A. Profile Overview**
- [ ] Years active as agent
- [ ] Total transactions/sales count
- [ ] Active neighborhoods/areas
- [ ] Specialties (luxury, first-time buyers, etc.)

**B. Transaction History**
Look for "Recent Sales," "Sold Listings," or similar section.

For each transaction, collect:
- Street address (full address if visible)
- Sale price
- Date (month/year minimum)
- Property type (Colonial, Cape Cod, Ranch, etc.)
- Bedrooms/Bathrooms (if visible)
- Square footage (if visible)
- Was Jeff representing buyer or seller?

**Target:** 10-20 transactions for compelling demo

### Step 2: Fill in the Template

Edit: `clients/jeff/jeff_data_template.py`

Replace the SAMPLE data with Jeff's actual data:

```python
CLIENT_DATA = {
    "years_active": 5,  # Jeff's actual years
    "total_transactions": 47,  # Jeff's actual count
    "neighborhoods": [
        "Westfield",
        "Cranford",
        # ... add all neighborhoods from his profile
    ],
    # ... etc
}

TRANSACTIONS = [
    {
        "id": "tx-001",  # Just number sequentially
        "address": "123 Maple Street, Westfield, NJ 07090",  # Actual address
        "price": 725000,  # Actual sale price
        "type": "buyer_representation",  # or "seller_representation"
        "date": "2024-01-15",  # Actual date
        "bedrooms": 4,  # If visible
        "bathrooms": 2.5,
        "square_feet": 2400,
        "neighborhood": "Westfield",
        "property_type": "colonial",
        "client_type": "family_upgrading"  # Infer from context
    },
    # ... add all transactions
]
```

### Step 3: Run the Import Script

```bash
cd ~/.openclaw/workspace/kaihamil-content/scripts
python3 import_realtor_data.py
```

**What happens:**
1. ✅ Saves raw data to `clients/jeff/raw/`
2. ✅ Generates RDF triples to `clients/jeff/triples/`
3. ✅ Creates summary to `clients/jeff/extracted/`
4. ✅ Knowledge Graph now has Jeff's full history

### Step 4: Verify the Data

Check generated files:
```
clients/jeff/
├── raw/           # Original imported data
├── triples/       # RDF files for knowledge graph
├── extracted/     # Summary JSON for web view
└── views/         # (Generated dynamically)
```

### Step 5: Test the Web View

Open in browser:
```
https://content.kaihamil.com/prototypes/realtor-client.html?user=jeff&token=demo123
```

**You should see:**
- Knowledge Graph with Jeff's transactions as nodes
- Connections between neighborhoods, properties, clients
- Dashboard showing: "47 transactions across 4 neighborhoods"
- Sample query results

## What the Demo Will Show

**Scenario:** Jeff sends new note about "Johnson Family at 123 Maple"

**System response:**
> "✅ Note stored. Interesting connection: You've sold 3 other Colonials in Westfield in the past year. Average sale price: $685K. [View your graph]"

**Web view reveals:**
- Johnson Family node connects to 123 Maple
- 123 Maple connects to "Westfield" area
- Westfield connects to 12 other Jeff transactions
- Pattern: "4-bedroom Colonials in Westfield avg 18 days on market"

**The Aha Moment:**
Jeff sees he's unconsciously specialized in Westfield Colonials — insight he never articulated but the graph reveals.

## Troubleshooting

**Missing data on homes.com?**
- Some data may be private
- Use whatever is visible
- Estimate missing details (bedrooms, sqft) if needed
- Focus on address + price + date (most important)

**Script errors?**
- Check JSON syntax in template file
- Ensure all quotes are closed
- Dates must be YYYY-MM-DD format
- Prices should be numbers (no commas)

**Want to add more transactions later?**
- Just add to TRANSACTIONS list
- Re-run import script
- New triples will be appended

## Data Privacy Note

This is for demo purposes only:
- Client names should be anonymized ("Family A", "Investor B")
- Addresses can be real (public record) or slightly modified
- Jeff will have full visibility that this is a prototype

## Time Estimate

- Extracting data: 10-15 minutes
- Filling template: 5-10 minutes
- Running script: 30 seconds
- Testing web view: 5 minutes

**Total: ~30 minutes for compelling demo data**

## Questions?

Ask Stitch if anything is unclear!
