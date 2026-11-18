from django.urls import path
from . import views

urlpatterns = [
    path('sectors/', views.sector_list_view, name='sector_list'),
    path('sectors/add/', views.sector_add, name='sector_add'),
    path('residents/', views.resident_list_view, name='resident_list'),
    path('residents/add/', views.resident_add, name='resident_add'),
    path('checkins/', views.checkin_list_view, name='checkin_list'),
    path('checkins/add/', views.checkin_add, name='checkin_add'),
    path('hazard-reports/', views.hazard_report_list_view, name='hazard_report_list'),
    path('hazard-reports/add/', views.hazard_report_add, name='hazard_report_add'),
]