# Generated by Django 3.1.3 on 2023-07-06 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph', '0008_auto_20220511_0413'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='about',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]