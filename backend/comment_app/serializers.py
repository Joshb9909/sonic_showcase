from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model=Comment
        fields = ('id','user_id','post_id','comment_content','created_at', 'user_username')