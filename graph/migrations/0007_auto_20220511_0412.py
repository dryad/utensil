# Generated by Django 3.1.3 on 2022-05-11 04:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph', '0006_address_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='images'),
        ),
    ]
