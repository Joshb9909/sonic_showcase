# Generated by Django 4.2.4 on 2023-08-23 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post_app', '0004_remove_post_post_picture_post_post_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='track_id',
            field=models.TextField(blank=True, max_length=2000, null=True),
        ),
    ]
