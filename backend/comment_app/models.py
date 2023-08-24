from django.db import models
from user_app.models import User
from post_app.models import Post
# Create your models here.

class Comment(models.Model):

    user_id = models.ForeignKey(User, related_name='comment', blank=False, on_delete=models.CASCADE)
    user_username = models.CharField(blank=False, max_length=255)
    post_id = models.ForeignKey(Post, related_name='comment', blank=False, on_delete=models.CASCADE)
    comment_content = models.TextField(blank=False,null=False, max_length=1000)
    created_at = models.DateTimeField(blank=False,null=False)