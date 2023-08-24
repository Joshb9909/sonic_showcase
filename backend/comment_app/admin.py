from django.contrib import admin
from .models import Comment
# Register your models here.

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'user_username', 'post_id', 'comment_content', 'created_at')
    search_fields = ('user_username', 'comment_content', 'user_id__username', 'post_id__post_title')
    list_filter = ('user_id', 'post_id', 'created_at')

    fieldsets = (
        (None, {'fields': ('user_id', 'user_username', 'post_id', 'comment_content', 'created_at')}),
    )

admin.site.register(Comment, CommentAdmin)

