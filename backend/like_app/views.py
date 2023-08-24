from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate
from .models import Like
from user_app.models import User
from post_app.models import Post
from post_app.serializers import PostSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class Like_a_post(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        post = get_object_or_404(Post, pk=post_id)
        like = Like.objects.filter(user_id=user, post_id=post).first()

        if like:
            like.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            like = Like(user_id=user, post_id=post)
            like.save()
            return Response(status=HTTP_201_CREATED)

