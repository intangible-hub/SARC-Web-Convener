"""URL patterns for registration endpoints."""

from django.urls import path
from . import views

urlpatterns = [
    path('events/register/', views.register_for_event, name='register-for-event'),
    path('user/registrations/', views.my_registrations, name='my-registrations'),
    path('admin/registrations/', views.admin_registrations_list, name='admin-registrations'),
    path('admin/registrations/<int:pk>/', views.admin_update_registration, name='admin-update-registration'),
]
