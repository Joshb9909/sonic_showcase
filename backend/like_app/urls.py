from django.urls import path
from .views import Like_a_post

urlpatterns = [
    path('like-a-post/<int:post_id>/', Like_a_post.as_view(), name='likeapost')
]