from django.db import models


class Graph(models.Model):
    name = models.CharField(max_length=255)
    data = models.TextField()
    note = models.TextField(default="")

    def _str_(self):
        return self.name
