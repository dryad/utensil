# Generated by Django 3.1.3 on 2023-09-07 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph', '0014_sharedgraphs'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='creator',
            field=models.CharField(default='', max_length=255),
        ),
    ]
