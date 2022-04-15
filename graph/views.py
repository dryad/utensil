from .serializers import GraphSerializer
from .models import Graph
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from django.core import serializers
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def graphs(request, graphId=None):
    if request.method == 'GET':
        search_query = request.GET.get('q', None)
        if search_query is not None:
            graphs = Graph.objects.filter(
                Q(name__icontains=search_query) |
                Q(data__icontains=search_query) |
                Q(note__icontains=search_query)
            )
        else:
            graphs = Graph.objects.all()
        serializer = GraphSerializer(graphs, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        json_data = json.loads(request.body)
        try:
            try:
                id = json_data['id']
            except KeyError:
                id = None
            name = json_data['name']
            note = json_data['note']
            data = json_data['data']
            if id is not None:
                graph = Graph.objects.get(id=id)
                graph.name = name
                graph.note = note
                graph.data = data
                graph.save()
            else:
                graph = Graph.objects.create(name=name, note=note, data=data)
            return HttpResponse(json.dumps({'id': graph.id}) ,status=201)
        except KeyError:
            return HttpResponse(status=400) 
    elif request.method == 'DELETE':
        if graphId is not None:
            graph = Graph.objects.get(id=graphId)
            graph.delete()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=400)
    else:
        return HttpResponse(status=405)
