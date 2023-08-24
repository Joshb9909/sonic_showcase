from django.urls import path
from .views import New_post, Delete_a_post, Get_a_post, Get_all_comments, Get_all_likes, Get_all_posts, SearchSpotifyTrack, GetSpotifyTrackDetails

urlpatterns = [
    path('new-post/', New_post.as_view(), name='newpost'),
    path('delete-a-post/', Delete_a_post.as_view(), name='deletepost'),
    path('get-post/<int:pk>/', Get_a_post.as_view(), name='getpost'),
    path('<int:post_id>/comments/', Get_all_comments.as_view(), name='getcomments'),
    path('<int:post_id>/likes/', Get_all_likes.as_view(), name='getlikes'),
    path('all/', Get_all_posts.as_view(), name='allposts'),
    path('search-for-track/', SearchSpotifyTrack.as_view(), name='searchtracks'),
    path('get-track-by-id/<str:track_id>/', GetSpotifyTrackDetails.as_view(), name='gettrack')
]