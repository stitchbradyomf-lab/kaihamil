#!/usr/bin/env python3
"""
Ansel Print Request Handler
Processes natural language print requests from Telegram.
"""

import json
import re
import os
from datetime import datetime
from pathlib import Path

DATA_DIR = Path("/Users/openclaw-stitch/.openclaw/workspace/photo-flow/data")

def parse_print_request(text):
    """Parse natural language print request."""
    text_lower = text.lower()
    
    # Extract size (e.g., "20x30", "8x10", "16x20")
    size_match = re.search(r'(\d+)\s*x\s*(\d+)', text)
    size = f"{size_match.group(1)}x{size_match.group(2)}" if size_match else None
    
    # Extract format/material
    formats = {
        'metal print': 'metal',
        'metal': 'metal',
        'canvas': 'canvas',
        'acrylic': 'acrylic',
        'framed': 'framed',
        'photo print': 'photo',
        'print': 'photo'
    }
    format_type = None
    for fmt_key, fmt_val in formats.items():
        if fmt_key in text_lower:
            format_type = fmt_val
            break
    
    # Extract style
    style = 'black and white' if 'black and white' in text_lower or 'b&w' in text_lower else 'color'
    
    # Extract subject/location
    # Look for "of X" or "from X" patterns
    subject_match = re.search(r'(?:of|from)\s+([^,.]+)', text_lower)
    subject = subject_match.group(1).strip() if subject_match else None
    
    return {
        'original_text': text,
        'parsed': {
            'subject': subject,
            'style': style,
            'size': size or '16x20',  # Default
            'format': format_type or 'metal'  # Default
        }
    }

def find_photo(subject, style):
    """Find matching photo from bradyvisuals inventory."""
    # Load albums
    albums_file = DATA_DIR / "albums.json"
    if not albums_file.exists():
        return None
    
    with open(albums_file) as f:
        data = json.load(f)
    
    # Search for matching album
    for album in data.get('albums', []):
        album_name_lower = album['name'].lower()
        if subject and subject.lower() in album_name_lower:
            return {
                'album': album['name'],
                'album_slug': album['slug'],
                'url': album['url'],
                'photo_id': 'best-match',  # Would need SmugMug API to get actual photo
                'thumbnail': None
            }
    
    return None

def search_vendors(size, format_type):
    """Generate vendor options (would search APIs in production)."""
    # Vendor database with estimated pricing
    base_prices = {
        'metal': {'20x30': 189.99, '16x20': 129.99, '11x14': 79.99, '8x10': 49.99},
        'canvas': {'20x30': 149.99, '16x20': 99.99, '11x14': 59.99, '8x10': 39.99},
        'acrylic': {'20x30': 249.99, '16x20': 179.99, '11x14': 119.99, '8x10': 79.99},
        'framed': {'20x30': 299.99, '16x20': 219.99, '11x14': 149.99, '8x10': 99.99},
        'photo': {'20x30': 29.99, '16x20': 19.99, '11x14': 12.99, '8x10': 8.99}
    }
    
    # Get base price for size/format, default to 20x30 if size not found
    price_map = base_prices.get(format_type, base_prices['metal'])
    base_price = price_map.get(size, price_map['20x30'])
    
    vendors = [
        {
            'vendor': 'MPix',
            'product': f'{format_type.title()} Print',
            'size': size,
            'price': base_price * 0.92,  # Competitive pricing
            'shipping': 12.50,
            'total': (base_price * 0.92) + 12.50,
            'turnaround': '7-10 days',
            'rating': 4.6,
            'specialty': 'Consumer-friendly, good quality'
        },
        {
            'vendor': 'Shutterfly',
            'product': f'{format_type.title()} Wall Art',
            'size': size,
            'price': base_price * 0.85,  # Often has sales
            'shipping': 14.99,
            'total': (base_price * 0.85) + 14.99,
            'turnaround': '5-8 days',
            'rating': 4.3,
            'specialty': 'Frequent discounts, easy ordering'
        },
        {
            'vendor': 'AdoramaPix',
            'product': f'Pro {format_type.title()}',
            'size': size,
            'price': base_price * 1.05,  # Pro pricing
            'shipping': 15.00,
            'total': (base_price * 1.05) + 15.00,
            'turnaround': '4-6 days',
            'rating': 4.7,
            'specialty': 'Professional quality, color accuracy'
        },
        {
            'vendor': 'Royal Canvas',
            'product': f'Gallery {format_type.title()}',
            'size': size,
            'price': base_price * 0.95,
            'shipping': 18.00,
            'total': (base_price * 0.95) + 18.00,
            'turnaround': '6-9 days',
            'rating': 4.5,
            'specialty': 'Canvas and metal specialists'
        },
        {
            'vendor': 'Bay Photo',
            'product': f'{format_type.title()} Print - Gloss',
            'size': size,
            'price': base_price * 1.10,  # Premium
            'shipping': 15.00,
            'total': (base_price * 1.10) + 15.00,
            'turnaround': '5-7 days',
            'rating': 4.8,
            'specialty': 'Highest quality, pro labs'
        }
    ]
    
    # Sort by total price, recommend cheapest
    vendors.sort(key=lambda x: x['total'])
    
    return vendors, vendors[0]['vendor']

def create_proposal(request_data, photo, vendors, recommended_vendor):
    """Create and save print proposal."""
    proposals_file = DATA_DIR / "print-proposals.json"
    
    # Load existing
    if proposals_file.exists():
        with open(proposals_file) as f:
            data = json.load(f)
    else:
        data = {'proposals': []}
    
    # Generate ID
    proposal_id = f"print-{len(data['proposals']) + 1:03d}"
    
    proposal = {
        'id': proposal_id,
        'status': 'pending',
        'requested_at': datetime.now().isoformat(),
        'request': request_data,
        'selected_photo': photo or {
            'album': 'TBD - Ansel to select',
            'photo_id': 'TBD',
            'url': '#',
            'thumbnail': None
        },
        'vendor_options': vendors,
        'recommended': {
            'vendor': recommended_vendor,
            'reason': 'Best price with good quality rating'
        },
        'notes': f"{request_data['parsed']['style'].title()} conversion will be handled by vendor"
    }
    
    data['proposals'].append(proposal)
    data['generated_at'] = datetime.now().isoformat()
    
    # Save
    with open(proposals_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    return proposal

def handle_request(text):
    """Main handler for print requests."""
    print(f"Processing print request: {text}")
    
    # Parse request
    request_data = parse_print_request(text)
    print(f"Parsed: {request_data['parsed']}")
    
    # Find photo
    photo = find_photo(
        request_data['parsed']['subject'],
        request_data['parsed']['style']
    )
    
    if photo:
        print(f"Found photo: {photo['album']}")
    else:
        print("No matching photo found - will need manual selection")
    
    # Get vendor options
    vendors, recommended = search_vendors(
        request_data['parsed']['size'],
        request_data['parsed']['format']
    )
    
    # Create proposal
    proposal = create_proposal(request_data, photo, vendors, recommended)
    
    print(f"\n✓ Created proposal: {proposal['id']}")
    print(f"View at: https://bradyvisuals.netlify.app/print-proposals.html")
    
    return proposal

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        request_text = ' '.join(sys.argv[1:])
    else:
        # Test request
        request_text = "I need a black and white photo of Death Valley printed as a 20x30 metal print"
    
    handle_request(request_text)
