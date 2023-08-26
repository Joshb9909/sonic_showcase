from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from post_app.serializers import PostSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from datetime import datetime, timedelta
from .utilities import HttpOnlyToken
# Create your views here.

class Sign_up(APIView):
    def post(self, request):
        try:
            user = User.objects.create_user(
                email=request.data["email"],
                username=request.data["username"],
                password=request.data["password"],
                description=request.data.get("description", ""),
                profile_picture = request.data.get("profile_picture", None)
            )
            token = Token.objects.create(user=user)
            return Response(
                {"user": user.username, "token": token.key}, status=HTTP_201_CREATED
            )
        except:
            return Response(
                {"error": "User with this email or username already exists."},
                status=HTTP_400_BAD_REQUEST,
            )

class Log_in(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            life_time = datetime.now() + timedelta(days=30)
            format_life_time = life_time.strftime("%a, %d %b %Y %H:%M:%S CST")
            user_serializer = UserSerializer(user)
            response = Response({"user":{**user_serializer.data}})
            response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite="Lax", expires = format_life_time)
            return response
            # return Response({"token": token.key, **user_serializer.data})
        else:
            return Response("No user matching credentials", status=HTTP_404_NOT_FOUND)
        
class Log_out(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=HTTP_204_NO_CONTENT)

class Delete_Account(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        request.user.delete()
        return Response(status=HTTP_204_NO_CONTENT)
    
class Info(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class RecentUsers(APIView):
    def get(self, request):
        recent_users = User.objects.order_by('-created_at')[:10]
        
        serializer = UserSerializer(recent_users, many=True)
        
        return Response(serializer.data, status=HTTP_200_OK)
    
class GetUserByUsername(APIView):
    def get(self, request, username):

        user = get_object_or_404(User, username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=HTTP_200_OK)
    
class GetUserById(APIView):
    def get(self, request, id):

        user = get_object_or_404(User, pk=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=HTTP_200_OK)
    

class SearchUsers(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        matching_users = User.objects.filter(username__istartswith=query)[:50]
        serializer = UserSerializer(matching_users, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

class Follow_User(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        user = request.user
        user_to_follow = get_object_or_404(User, pk=user_id)
        is_following = user.following.filter(id=user_to_follow.id).exists()

        if is_following:
            user.following.remove(user_to_follow)
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            user.following.add(user_to_follow)
            return Response(status=HTTP_201_CREATED)


class Edit_Description(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        description = request.data['description']
        request.user.description = description
        request.user.save()
        return Response({'status': 'success'}, status=HTTP_201_CREATED)
    
class Edit_Username(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        username = request.data['username']
        request.user.username = username
        request.user.save()
        return Response({'status': 'success'}, status=HTTP_201_CREATED)
    
class Edit_Email(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        email = request.data['email']
        request.user.email = email
        request.user.save()
        return Response({'status': 'success'}, status=HTTP_201_CREATED)
    
class Edit_Password(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        password = request.data['password']
        request.user.set_password(password)
        request.user.save()
        return Response({'status': 'success'}, status=HTTP_201_CREATED)
    
class EditProfilePicture(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        profile_picture = request.FILES.get('profile_picture', None)

        if not profile_picture:
            return Response({"error": "Profile picture is required."}, status=HTTP_400_BAD_REQUEST)

        user.profile_picture = profile_picture
        user.save()
        return Response({"message": "Profile picture updated successfully."}, status=HTTP_200_OK)
    
class UpdateProfilePictureURL(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile_picture_url = request.data.get('profile_picture_url', None)

        if not profile_picture_url:
            return Response({"error": "Profile picture URL is required."}, status=HTTP_400_BAD_REQUEST)

        user = request.user
        user.profile_picture_url = profile_picture_url
        user.save()
        return Response({"profile_picture_url": profile_picture_url}, status=HTTP_200_OK)


class View_Followers(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        followers = list(request.user.followers.values('username'))
        return Response({'followers': followers})
    
class View_Following(APIView):
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        following = list(request.user.following.values('username'))
        return Response({'following': following})
    
class Get_all_posts(APIView):

    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        posts = user.post.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

