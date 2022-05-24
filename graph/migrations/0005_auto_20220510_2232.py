# Generated by Django 3.1.3 on 2022-05-10 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph', '0004_address'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='address',
            options={'verbose_name_plural': 'Addresses'},
        ),
        migrations.AlterField(
            model_name='address',
            name='address',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='address',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
