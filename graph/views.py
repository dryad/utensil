from .serializers import GraphSerializer
from .models import Graph
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from django.core import serializers
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def graphs(request):
    if request.method == 'GET':
        search_query = "test3"
        graphs = Graph.objects.filter(
            Q(name__icontains=search_query) |
            Q(data__icontains=search_query) |
            Q(note__icontains=search_query)
        )
        serializer = GraphSerializer(graphs, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        json_data = json.loads(request.body)
        try:
            name = json_data['name']
            note = json_data['note']
            data = json_data['data']
            Graph.objects.create(name=name, note=note, data=data)
            return HttpResponse(status=201)
        except KeyError:
            return HttpResponse(status=400) 