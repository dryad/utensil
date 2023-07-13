# Need serializers to convert model instances to JSON so that the frontend
# can work with the received data easily.

# We will create a graph/serializers.py file:

from rest_framework import serializers
from .models import Graph, Address

#  Specify the model to work with and the fields we want to be converted to JSON.


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = ('id', 'name', 'data', 'note', 'private')

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'name', 'about', 'address', 'avatar_url')

class GraphFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = ('id', 'name')        
