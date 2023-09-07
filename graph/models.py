from django.db import models
from backend.settings import PRODUCTION


class Graph(models.Model):
    name = models.CharField(max_length=255)
    data = models.TextField()
    note = models.TextField(default="", null=True, blank=True)
    private = models.CharField(max_length=255, default="")
    def __str__(self):
        return self.name

class SharedGraphs(models.Model):
    address = models.TextField()
    graphId = models.IntegerField()
    def __str__(self):
        return self.address
            
class Address(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    about = models.TextField(default="", null=True, blank=True)
    address = models.CharField(max_length=255, unique=True)
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    def __str__(self):
        return self.name or ''
    class Meta:
        verbose_name_plural = "Addresses"
    def avatar_url(self):
        if self.avatar:
            if PRODUCTION:
                return '/avatars/' + self.avatar.url.split('/')[2]
            else:
                return '/static/' + self.avatar.url.split('/')[2]
        else:
            return ""
