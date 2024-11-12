from django.contrib import admin
from .models import Marker

@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
    list_display = ('marker_type', 'severity', 'latitude', 'longitude', 'created_at', 'commentar')
    list_filter = ('marker_type', 'severity')
    search_fields = ('marker_type', 'commentar')