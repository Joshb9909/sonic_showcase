from django.contrib import admin
from .models import User
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'created_at', 'description')
    search_fields = ('username', 'email')
    readonly_fields = ('created_at',)
    list_filter = ('created_at',)

    filter_horizontal = ('followers',)
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Profile Info', {'fields': ('description', 'profile_picture', 'profile_picture_url', 'followers')}),
        ('Metadata', {'fields': ('created_at',)}),
    )

admin.site.register(User, UserAdmin)
