from graph.models import Graph
from django.contrib import admin


class GraphAdmin(admin.ModelAdmin):
    list_display = ('name', 'note', 'private')


# Register your models here.
admin.site.register(Graph, GraphAdmin)
