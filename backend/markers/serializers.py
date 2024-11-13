from rest_framework import serializers
from .models import Marker

class MarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marker
        fields = ['id', 'marker_type', 'severity', 'commentar', 'latitude', 'longitude']