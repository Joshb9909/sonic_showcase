from django.contrib import admin
from .models import Like
# Register your models here.

class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'post_id')
    search_fields = ('user_id__username', 'post_id__post_title')
    list_filter = ('user_id', 'post_id')

    fieldsets = (
        (None, {'fields': ('user_id', 'post_id')}),
    )

admin.site.register(Like, LikeAdmin)

