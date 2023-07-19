from django.db import models
from backend.settings import PRODUCTION


class Graph(models.Model):
    name = models.CharField(max_length=255)
    data = models.TextField()
    note = models.TextField(default="", null=True, blank=True)
    private = models.CharField(max_length=255, default="")
    preview = models.ImageField(upload_to='previews', null=True, blank=True)
    def __str__(self):
        return self.name
    def preview_url(self):
        if self.preview:
            if PRODUCTION:
                return '/previews/' + self.preview.url.split('/')[2]
            else:
                return '/static/' + self.preview.url.split('/')[2]
        else:
            return ""
            
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
