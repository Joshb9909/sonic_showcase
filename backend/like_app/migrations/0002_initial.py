# Generated by Django 4.2.4 on 2023-08-10 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('post_app', '0001_initial'),
        ('like_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='like',
            name='post_id',
            field=models.ManyToManyField(to='post_app.post'),
        ),
    ]
