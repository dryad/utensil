import os, django, json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
from graph.models import Graph

# This script removes invalid edges that were left behind by vis-network delete. Uncomment the last line for safety.

print(f"Loading {str(Graph.objects.count())} Graphs...")

graphs = Graph.objects.all()

for graph in graphs:
    print(f"Graph {graph.id}: {graph.name}")

    try:
        data = json.loads(graph.data)
    except json.decoder.JSONDecodeError:
        print(f"Graph {graph.id}: {graph.name} has invalid JSON data")
        continue
    nodes = [node['id'] for node in data['nodes']]
    valid_edges = []
    for edge in data['edges']:
        try:
            eventual = edge['eventual']
        except KeyError:
            continue
        if edge['from'] in nodes and edge['to'] in nodes and edge['eventual'] in nodes:
            valid_edges.append(edge)

    
    print (f"Graph {graph.id}: {graph.name} has {len(data['edges'])} edges")
    print (f"Graph {graph.id}: {graph.name} has {len(valid_edges)} valid edges")
    print ("-----------------------------------------------------")
    data['edges'] = valid_edges
    graph.data = json.dumps(data)
    #graph.save()