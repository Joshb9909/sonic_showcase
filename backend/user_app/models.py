from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):

    email = models.EmailField(blank=False, null=False,unique=True)
    username = models.CharField(max_length=30, blank=False, null=False, unique=True)
    followers = models.ManyToManyField('self', related_name='following', blank=True, symmetrical=False)
    description = models.TextField(blank=True,null=True,max_length=1000)
    created_at = models.DateField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    profile_picture_url = models.TextField(blank=True,null=True)

