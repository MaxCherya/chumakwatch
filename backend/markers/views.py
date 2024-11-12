from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Marker
from .serializers import MarkerSerializer
import logging

@api_view(['POST'])
def add_marker(request):
    serializer = MarkerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_all_markers(request):
    markers = Marker.objects.all()
    serializer = MarkerSerializer(markers, many=True)
    return Response(serializer.data)
