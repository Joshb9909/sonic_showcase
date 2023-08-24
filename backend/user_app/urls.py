from django.urls import path
from .views import Sign_up, Log_in, Log_out, Delete_Account, Info, Follow_User, Edit_Description, View_Followers, Get_all_posts, Edit_Username, Edit_Email, Edit_Password, EditProfilePicture, UpdateProfilePictureURL, RecentUsers, GetUserByUsername, SearchUsers, GetUserById

urlpatterns = [
    path('signup/', Sign_up.as_view(), name='signup'),
    path('login/', Log_in.as_view(), name='login'),
    path('logout/', Log_out.as_view(), name='logout'),
    path('deleteacc/', Delete_Account.as_view(), name='deleteacc'),
    path('info/', Info.as_view(), name='info'),
    path('follow-user/<int:user_id>/', Follow_User.as_view(), name='followuser'),
    path('edit-description/', Edit_Description.as_view(), name='editdescription'),
    path('edit-username/', Edit_Username.as_view(), name='editusername'),
    path('edit-email/', Edit_Email.as_view(), name='editemail'),
    path('edit-password/', Edit_Password.as_view(), name='editpassword'),
    path('edit-profile-picture/', EditProfilePicture.as_view(), name='editprofilepicture'),
    path('edit-profile-picture-url/', UpdateProfilePictureURL.as_view(), name='editprofilepictureurl'),
    path('view-followers/', View_Followers.as_view(), name='viewfollowers'),
    path('<int:user_id>/all-posts/', Get_all_posts.as_view(), name='allposts'),
    path('recent-users/', RecentUsers.as_view(), name='recentusers'),
    path('get-user-by-username/<str:username>/', GetUserByUsername.as_view(), name='getuserbyusername'),
    path('search-users/', SearchUsers.as_view(), name='searchusers'),
    path('get-user-by-id/<int:id>/', GetUserById.as_view(), name='getuserbyid')
]