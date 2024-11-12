from django.urls import path
from . import views

urlpatterns = [
    path('add_marker/', views.add_marker, name='add_marker'),
    path('all_markers/', views.get_all_markers, name='all_markers')
]
