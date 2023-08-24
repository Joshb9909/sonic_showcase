from django.db import models
from user_app.models import User

# Create your models here.

class Post(models.Model):

    user_id = models.ForeignKey(User, related_name='post', on_delete=models.CASCADE, blank=False, null=False)
    post_title = models.CharField(max_length=50, blank=False,null=False)
    post_file = models.FileField(upload_to='profile_pics/',blank=True,null=True)
    post_content = models.TextField(max_length=2500, blank=False,null=False)
    created_at = models.DateTimeField(blank=False,null=False)
    track_id = models.TextField(max_length=2000, blank=True, null=True)