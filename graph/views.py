from django.shortcuts import render
from rest_framework import viewsets
from .serializers import GraphSerializer
from .models import Graph
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
import os
# The viewsets base class provides the implementation for CRUD operations by default,
# what we had to do was specify the serializer class and the query set.


class GraphView(viewsets.ModelViewSet):
    serializer_class = GraphSerializer
    queryset = Graph.objects.all()
