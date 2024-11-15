from rest_framework import status
from rest_framework.decorators import api_view
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Marker
from .serializers import MarkerSerializer
from dotenv import load_dotenv
import requests
import os

load_dotenv()
captcha_secret = os.getenv("RECAPTCHA_SECRET_KEY")

def validate_captcha(captcha_token):
    url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {"secret": captcha_secret, "response": captcha_token}
    response = requests.post(url, data=payload)
    result = response.json()
    return result.get("success", False)

@api_view(['POST'])
def add_marker(request):
    try:
        CsrfViewMiddleware().process_view(request, None, (), {})
    except:
        return JsonResponse({'error': 'Invalid CSRF token'}, status=403)
    captcha_token = request.data.get('captcha')
    if not captcha_token:
        return JsonResponse({'error': 'CAPTCHA token is missing'}, status=400)
    if not validate_captcha(captcha_token):
        return JsonResponse({'error': 'Invalid CAPTCHA'}, status=403)
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
