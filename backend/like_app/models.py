from django.db import models
from user_app.models import User
from post_app.models import Post

class Like(models.Model):
    user_id = models.ForeignKey(User, related_name='likes', on_delete=models.CASCADE, default=None)
    post_id = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE, default=None)

    
