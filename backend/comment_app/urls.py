from django.urls import path
from .views import Create_a_comment,Delete_a_comment,Get_a_comment

urlpatterns = [
    path('create-a-comment/', Create_a_comment.as_view(), name='createcomment'),
    path('delete_a_comment/<int:pk>/', Delete_a_comment.as_view(), name='deletecomment'),
    path('get-a-comment/<int:pk>/', Get_a_comment.as_view(), name='getcomment')
]