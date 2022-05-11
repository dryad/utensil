from django.db import models


class Graph(models.Model):
    name = models.CharField(max_length=255)
    data = models.TextField()
    note = models.TextField(default="", null=True, blank=True)
    private = models.BooleanField(default=True)
    def __str__(self):
        return self.name

class Address(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, unique=True)
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    def __str__(self):
        return self.name or ''
    class Meta:
        verbose_name_plural = "Addresses"
    def avatar_url(self):
        if self.avatar:
            return '/static/' + self.avatar.url.split('/')[2]
        else:
            return ""
