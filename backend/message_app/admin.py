from django.contrib import admin
from .models import Message
# Register your models here.

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'content', 'created_at')
    search_fields = ('sender__username', 'recipient__username', 'content')
    readonly_fields = ('created_at',)
    list_filter = ('created_at', 'sender', 'recipient')

    fieldsets = (
        (None, {'fields': ('sender', 'recipient', 'content')}),
        ('Metadata', {'fields': ('created_at',)}),
    )

admin.site.register(Message, MessageAdmin)

