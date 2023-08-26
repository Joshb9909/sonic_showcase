from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from .models import Message
from .serializers import MessageSerializer
from user_app.models import User
from django.db.models import Q
from user_app.utilities import HttpOnlyToken

class Send_Message(APIView):

    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipient_id = request.data.get('recipient_id')
        content = request.data.get('content')
        recipient = User.objects.get(pk=recipient_id)

        message = Message(sender=request.user, recipient=recipient, content=content)
        message.save()

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=HTTP_201_CREATED)

class Get_Conversation(APIView):

    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def get(self, request, other_user_id):
        sent_messages = Message.objects.filter(sender=request.user, recipient__id=other_user_id)
        received_messages = Message.objects.filter(sender__id=other_user_id, recipient=request.user)

        messages = sent_messages.union(received_messages).order_by('created_at')
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class Get_All_Conversations(APIView):
    
    authentication_classes = [HttpOnlyToken]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sent_conversations = Message.objects.filter(sender=request.user).distinct('recipient')
        received_conversations = Message.objects.filter(recipient=request.user).distinct('sender')

        conversations = sent_conversations.union(received_conversations)

        serializer = MessageSerializer(conversations, many=True)
        return Response(serializer.data)
