from django.db import models


class Graph(models.Model):
    name = models.CharField(max_length=255)
    data = models.TextField()
    note = models.TextField(default="", null=True, blank=True)
    private = models.BooleanField(default=True)
    def __str__(self):
        return self.name

class Address(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural = "Addresses"