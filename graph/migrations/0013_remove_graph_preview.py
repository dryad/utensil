# Generated by Django 3.1.3 on 2023-07-25 13:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graph', '0012_graph_preview'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='graph',
            name='preview',
        ),
    ]