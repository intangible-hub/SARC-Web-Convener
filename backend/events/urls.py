"""URL patterns for events endpoints."""

from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.events_list, name='events-list'),
    path('events/<int:pk>/', views.event_detail, name='event-detail'),
    path('admin/events/', views.admin_create_event, name='admin-create-event'),
    path('admin/events/<int:pk>/', views.admin_update_delete_event, name='admin-update-delete-event'),
]
