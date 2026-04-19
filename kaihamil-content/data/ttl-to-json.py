#!/usr/bin/env python3
"""
Convert knowledge-graph.ttl (RDF/Turtle) to graph.json for visual rendering.
Usage: python3 ttl-to-json.py
"""

import json
import re
from pathlib import Path

# Color scheme matching existing graph
COLORS = {
    "system": "#58a6ff",
    "self": "#f97583",
    "both": "#a371f7",
    "meta": "#8b949e",
    "root": "#f4d03f",
    "kcaase": "#e67e22"  # Orange for KCAASE
}

# Node type sizes
NODE_TYPES = {
    "root": {"size": 40, "shape": "star"},
    "paradigm": {"size": 35, "shape": "hexagon"},
    "collection": {"size": 25, "shape": "circle"},
    "content": {"size": 15, "shape": "circle"},
    "cognition": {"size": 20, "shape": "diamond"},
    "pathway": {"size": 18, "shape": "triangle"},
    "gap": {"size": 12, "shape": "circle"}
}

# Edge type styles
EDGE_TYPES = {
    "contains": {"style": "solid", "strength": 1.0},
    "related": {"style": "dashed", "strength": 0.5},
    "deepens": {"style": "solid", "strength": 0.8},
    "applies": {"style": "dotted", "strength": 0.4},
    "explores": {"style": "dotted", "strength": 0.4},
    "inspires": {"style": "dashed", "strength": 0.3},
    "contrasts": {"style": "dashed", "strength": 0.6},
    "implements": {"style": "solid", "strength": 0.7},
    "opens": {"style": "solid", "strength": 0.9},
    "prerequisiteFor": {"style": "solid", "strength": 0.9, "label": "requires"},
    "leadsTo": {"style": "solid", "strength": 1.0, "label": "→"},
    "primaryLevel": {"style": "dashed", "strength": 0.6, "label": "teaches"},
    "secondaryLevel": {"style": "dotted", "strength": 0.4, "label": "also teaches"}
}

def parse_ttl(filepath):
    """Parse TTL file and extract entities and relationships."""
    content = Path(filepath).read_text()
    
    # Extract prefixes
    prefixes = {}
    for match in re.finditer(r'@prefix (\w+):\s*<([^>]+)>', content):
        prefixes[match.group(1)] = match.group(2)
    
    # Extract entities (subject with type declaration)
    entities = {}
    entity_pattern = r'^(\w+:\w+)\s+a\s+([\w:]+)\s*;'
    
    for match in re.finditer(entity_pattern, content, re.MULTILINE):
        entity_id = match.group(1).replace('kh:', '').replace('kcaase:', 'kcaase-')
        type_uri = match.group(2)
        
        # Determine node type
        if 'CognitionLevel' in type_uri:
            node_type = 'cognition'
        elif 'Paradigm' in type_uri:
            node_type = 'paradigm'
        elif 'Collection' in type_uri:
            node_type = 'collection'
        elif 'Tool' in type_uri:
            node_type = 'content'
        elif 'Framework' in type_uri:
            node_type = 'content'
        elif 'Post' in type_uri:
            node_type = 'content'
        elif 'pathway' in entity_id:
            node_type = 'pathway'
        elif 'gap' in entity_id:
            node_type = 'gap'
        else:
            node_type = 'content'
        
        entities[entity_id] = {
            'id': entity_id,
            'type': node_type,
            'properties': {}
        }
    
    # Extract properties for each entity
    # Match entity blocks
    block_pattern = r'^(\w+:\w+)\s+a\s+[\w:]+\s*;\s*((?:\s+\w+:\w+\s+[^;]+;\s*)*)\s*\.'
    
    for match in re.finditer(block_pattern, content, re.MULTILINE | re.DOTALL):
        entity_id = match.group(1).replace('kh:', '').replace('kcaase:', 'kcaase-')
        props_block = match.group(2)
        
        if entity_id not in entities:
            continue
        
        # Parse properties
        prop_pattern = r'(\w+:\w+)\s+([^;]+)'
        for prop_match in re.finditer(prop_pattern, props_block):
            prop_name = prop_match.group(1).replace('kh:', '').replace('rdfs:', 'rdfs_')
            prop_value = prop_match.group(2).strip()
            
            # Clean up value
            if prop_value.startswith('"') and prop_value.endswith('"'):
                prop_value = prop_value[1:-1]
            elif prop_value.startswith('kcaase:'):
                prop_value = prop_value.replace('kcaase:', 'kcaase-')
            elif prop_value.startswith('kh:'):
                prop_value = prop_value.replace('kh:', '')
            
            entities[entity_id]['properties'][prop_name] = prop_value
    
    return entities

def extract_relationships(content):
    """Extract relationships from TTL content."""
    edges = []
    
    # Pattern for relationships: subject predicate object
    rel_pattern = r'^(\w+:\w+)\s+(\w+:\w+)\s+(\w+:\w+)\s*;?'
    
    for match in re.finditer(rel_pattern, content, re.MULTILINE):
        source = match.group(1).replace('kh:', '').replace('kcaase:', 'kcaase-')
        predicate = match.group(2).replace('kh:', '')
        target = match.group(3).replace('kh:', '').replace('kcaase:', 'kcaase-')
        
        if predicate in EDGE_TYPES:
            edge_info = EDGE_TYPES[predicate]
            edges.append({
                'source': source,
                'target': target,
                'type': predicate,
                'label': edge_info.get('label', predicate),
                'style': edge_info['style'],
                'strength': edge_info['strength']
            })
    
    return edges

def build_graph_json(entities, edges):
    """Build the final graph.json structure."""
    nodes = []
    
    for entity_id, entity in entities.items():
        props = entity['properties']
        
        node = {
            'id': entity_id,
            'label': props.get('label', entity_id),
            'type': entity['type'],
            'branch': props.get('branch', 'system'),
            'url': props.get('url', ''),
            'description': props.get('description', '')
        }
        
        # Add optional fields
        if 'tagline' in props:
            node['tagline'] = props['tagline']
        if 'acronymLetter' in props:
            node['acronymLetter'] = props['acronymLetter']
        if 'acronymWord' in props:
            node['acronymWord'] = props['acronymWord']
        if 'appPrompt' in props:
            node['appPrompt'] = props['appPrompt']
        
        nodes.append(node)
    
    # Build edge list in graph.json format
    graph_edges = []
    for edge in edges:
        graph_edge = {
            'source': edge['source'],
            'target': edge['target'],
            'type': edge['type'],
            'label': edge['label']
        }
        graph_edges.append(graph_edge)
    
    return {
        'meta': {
            'version': '2.0.0',
            'created': '2026-04-19',
            'description': 'Kai Hamil knowledge graph with KCAASE cognition levels',
            'nodeCount': len(nodes),
            'edgeCount': len(graph_edges),
            'sourceFormat': 'RDF/Turtle',
            'sourceFile': 'knowledge-graph.ttl'
        },
        'nodes': nodes,
        'edges': graph_edges,
        'config': {
            'colors': COLORS,
            'nodeTypes': NODE_TYPES,
            'edgeTypes': EDGE_TYPES
        }
    }

def main():
    ttl_path = Path(__file__).parent / 'knowledge-graph.ttl'
    json_path = Path(__file__).parent / 'graph.json'
    
    print(f"Parsing {ttl_path}...")
    entities = parse_ttl(ttl_path)
    print(f"Found {len(entities)} entities")
    
    content = ttl_path.read_text()
    edges = extract_relationships(content)
    print(f"Found {len(edges)} relationships")
    
    graph = build_graph_json(entities, edges)
    
    with open(json_path, 'w') as f:
        json.dump(graph, f, indent=2)
    
    print(f"Written to {json_path}")
    print(f"Nodes: {graph['meta']['nodeCount']}")
    print(f"Edges: {graph['meta']['edgeCount']}")

if __name__ == '__main__':
    main()
