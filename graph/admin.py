from graph.models import Graph
from django.contrib import admin


class GraphAdmin(admin.ModelAdmin):
    list_display = ('name', 'data', 'note')


# Register your models here.
admin.site.register(Graph, GraphAdmin)
