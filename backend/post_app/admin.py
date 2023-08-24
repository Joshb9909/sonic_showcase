from django.contrib import admin
from .models import Post
# Register your models here.

class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'post_title', 'created_at', 'post_content', 'track_id')
    search_fields = ('post_title', 'user_id__username')
    readonly_fields = ('created_at',)
    list_filter = ('created_at', 'user_id')

    fieldsets = (
        (None, {'fields': ('user_id', 'post_title', 'post_content', 'post_file', 'track_id')}),
        ('Metadata', {'fields': ('created_at',)}),
    )

admin.site.register(Post, PostAdmin)

