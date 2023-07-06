from graph.models import Graph, Address
from django.contrib import admin


class GraphAdmin(admin.ModelAdmin):
    list_display = ('name', 'note', 'private')

class AddressAdmin(admin.ModelAdmin):
    list_display = ('name', 'about', 'address')
# Register your models here.
admin.site.register(Graph, GraphAdmin)
admin.site.register(Address, AddressAdmin)