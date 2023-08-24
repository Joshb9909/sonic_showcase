from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Comment
from post_app.models import Post
from .serializers import CommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class Create_a_comment(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        post_id = request.data.get('post_id')
        post = get_object_or_404(Post, pk=post_id)
        comment_data = {
            'user_id' : user.id,
            'user_username' : user.username,
            'post_id' : post.id,
            'comment_content' : request.data.get('comment_content'),
            'created_at' : timezone.now(),
        }
        serializer = CommentSerializer(data=comment_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
class Delete_a_comment(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        comment = get_object_or_404(Comment, pk=pk)

        if request.user != comment.user_id:
            return Response(status=HTTP_403_FORBIDDEN)

        comment.delete()
        return Response(status=HTTP_204_NO_CONTENT)

class Get_a_comment(APIView):

    def get(self, request, pk):

        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
