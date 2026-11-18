from django.urls import path
from . import views, api

urlpatterns = [
    path('sectors/', views.sector_list_view, name='sector_list'),
    path('sectors/add/', views.sector_add, name='sector_add'),
    path('residents/', views.resident_list_view, name='resident_list'),
    path('residents/add/', views.resident_add, name='resident_add'),
    path('checkins/', views.checkin_list_view, name='checkin_list'),
    path('checkins/add/', views.checkin_add, name='checkin_add'),
    path('hazard-reports/', views.hazard_report_list_view, name='hazard_report_list'),
    path('hazard-reports/add/', views.hazard_report_add, name='hazard_report_add'),
    path('api/sectors/', api.sectors_api, name='sectors_api'),
    path('api/sectors/<int:pk>/', api.sector_api, name='sector_api'),
    path('api/residents/', api.residents_api, name='residents_api'),
    path('api/residents/<int:pk>/', api.resident_api, name='resident_api'),
    path('api/checkins/', api.checkins_api, name='checkins_api'),
    path('api/checkins/<int:pk>/', api.checkin_api, name='checkin_api'),
    path('api/hazards/', api.hazards_api, name='hazards_api'),
    path('api/hazards/<int:pk>/', api.hazard_api, name='hazard_api'),

]