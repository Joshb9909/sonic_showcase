# Generated by Django 4.2.4 on 2023-08-10 20:23

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('comment_app', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='user_id',
            field=models.ManyToManyField(related_name='comment', to=settings.AUTH_USER_MODEL),
        ),
    ]
