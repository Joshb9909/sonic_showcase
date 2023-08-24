from django.urls import path, include
from .views import Send_Message, Get_Conversation, Get_All_Conversations

urlpatterns = [
    path('send/', Send_Message.as_view(), name='sendmessage'),
    path('conversation/<int:other_user_id>/', Get_Conversation.as_view(), name='getconversation'),
    path('conversations/', Get_All_Conversations.as_view(), name='getallconversations')
]