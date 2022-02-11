from .serializers import GraphSerializer
from .models import Graph
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from django.core import serializers

def graphs(request):
    graphs = Graph.objects.all()
    serializer = GraphSerializer(graphs, many=True)
    return JsonResponse(serializer.data, safe=False)