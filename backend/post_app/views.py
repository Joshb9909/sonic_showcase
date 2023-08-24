from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Post
from .serializers import PostSerializer
from comment_app.serializers import CommentSerializer
from like_app.serializers import LikeSerializer
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
from services.spotify import search_tracks, get_track_by_id

# Create your views here.

class New_post(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user=request.user
        post_data={
            'user_id' : user.id,
            'post_title' : request.data.get('post_title'),
            'post_file' : request.data.get('post_file'),
            'post_content' : request.data.get('post_content'),
            'created_at' : timezone.now(),
            'track_id' : request.data.get('track_id')
        }
        serializer = PostSerializer(data=post_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
class Delete_a_post(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):

        post_id = request.data.get('post_id')
        post = get_object_or_404(Post, pk=post_id)

        if request.user != post.user_id:
            return Response(status=HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response(status=HTTP_204_NO_CONTENT)
    
class Get_a_post(APIView):

    def get(self,request, pk):

        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    
class Get_all_comments(APIView):

    def get(self, request, post_id):

        post = Post.objects.get(pk=post_id)
        comments = post.comment.all().order_by('created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
class Get_all_likes(APIView):

    def get(self, request, post_id):

        post = Post.objects.get(pk = post_id)
        likes = post.likes.all()
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)

class Get_all_posts(APIView):

    def get(self, request):

        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
class SearchSpotifyTrack(APIView):
    
    def get(self, request):
        track_name = request.query_params.get('track_name', None)
        offset = int(request.query_params.get('offset', 0))
        
        if not track_name:
            return Response({'error': 'Query parameter is required.'}, status=HTTP_400_BAD_REQUEST)
            
        results = search_tracks(track_name, offset)
        return Response(results)
    
class GetSpotifyTrackDetails(APIView):

    def get(self, request, track_id):
        track_details = get_track_by_id(track_id)
        return Response(track_details)


