from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'description', 'followers','following', 'created_at', 'profile_picture', 'profile_picture_url', 'id']
