from .serializers import GraphSerializer, AddressSerializer, SharedGraphsSerializer
from .models import Graph, Address, SharedGraphs
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from django.core import serializers
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json, base64
from django.core.files.base import ContentFile
from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
def address(request, addressId=None):
    if request.method == 'GET':
        if addressId is not None:
            address, created = Address.objects.get_or_create(address=addressId)
        # print (address)
        if address:
            serializer = AddressSerializer(address, many=False)
            return JsonResponse(serializer.data, safe=False)
        else:
            return HttpResponseNotFound()
    elif request.method == 'POST':
        data = json.loads(request.body)
        address, created = Address.objects.get_or_create(address=addressId)
        # print('DATA:', data)
        address.name = data['editAddress']['name']
        address.about = data['editAddress']['about']
            # save avatar image from post request
        if 'avatar' in data['editAddress']:
            avatar = data['editAddress']['avatar']
            print('avatar length:', len(avatar))
            if len(avatar) > 0:
                format, imgstr = avatar.split(';base64,') 
                ext = format.split('/')[-1] 
                data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext) # You can save this as file instance.
                address.avatar.save(address.address + '.png', data, save=True)
                # address.avatar = address.address + '.png'
            # address.avatar.save(avatar.name, avatar)

        address.save()

        serializer = AddressSerializer(address, many=False)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def graphs(request, graphId=None):
    if request.method == 'GET':
        search_query = request.GET.get('q', None)
        private_query = request.GET.get('private', None)
        # if search_query is not None:
        #     graphs = Graph.objects.filter(
        #         Q(name__icontains=search_query) |
        #         # Q(data__icontains=search_query) |
        #         Q(note__icontains=search_query)
        #     )
        # else:
        #     graphs = Graph.objects.all()
        if private_query is not None:
            if search_query is not None:
                graphs = Graph.objects.filter(
                    Q(private__exact=private_query) |
                    Q(private__in=['', 1])
                ).filter(
                    Q(name__icontains=search_query) |
                    Q(note__icontains=search_query)
                )
            else:
                graphs = Graph.objects.filter(
                    Q(private__exact=private_query) |
                    Q(private__in=['', 1])
                )
        else:
            if search_query is not None:
                graphs = Graph.objects.filter(
                    private__in=['', 1]
                ).filter(
                    Q(name__icontains=search_query) |
                    Q(note__icontains=search_query)
                )
            else:
                graphs = Graph.objects.filter(private__in=['', 1])

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
            private = json_data['private']
            
            if id is not None:
                graph = Graph.objects.get(id=id)
                graph.name = name
                graph.note = note
                graph.data = data
                graph.private = private
                graph.save()
            else:
                graph = Graph.objects.create(name=name, note=note, data=data, private=private)
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

@csrf_exempt
def privateGraphs(request):
    if request.method == 'GET':
        private_query = request.GET.get('private')
        graphs = Graph.objects.filter(private__exact=private_query)
        serializer = GraphSerializer(graphs, many=True)
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def publicGraphs(request):
    if request.method == 'GET':
        graphs = Graph.objects.filter(private__in=["", 1])
        serializer = GraphSerializer(graphs, many=True)
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def sharedGraphs(request):
    if request.method == 'GET':
        address_query = request.GET.get('address')
        graph_ids = SharedGraphs.objects.filter(address__exact=address_query).values_list('graphId', flat=True)
        shared_graphs = Graph.objects.filter(id__in=graph_ids)
        serializer = GraphSerializer(shared_graphs, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        json_data = json.loads(request.body)
        try:
            address = json_data['address']
            graphId = json_data['graphId']
            ob = SharedGraphs.objects.get(address=address, graphId=graphId)            
        except ObjectDoesNotExist:
            sharedGraph = SharedGraphs.objects.create(address=address, graphId=graphId)
            return HttpResponse(json.dumps({'id': sharedGraph.id}) ,status=201)
        return HttpResponse(status=202)
    else:
        return HttpResponse(status=405)