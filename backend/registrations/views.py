"""
Views for registrations: user registration for events, admin management.
"""

from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Registration
from .serializers import RegistrationSerializer, RegistrationStatusSerializer
from events.models import Event


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_for_event(request):
    event_id = request.data.get('event_id')
    if not event_id:
        return Response({'detail': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        event = Event.objects.get(pk=event_id, status='published')
    except Event.DoesNotExist:
        return Response({'detail': 'Event not found or not published'}, status=status.HTTP_404_NOT_FOUND)

    if Registration.objects.filter(user=request.user, event=event).exists():
        return Response({'detail': 'Already registered'}, status=status.HTTP_400_BAD_REQUEST)

    registration = Registration.objects.create(user=request.user, event=event)
    return Response(RegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_registrations(request):
    registrations = Registration.objects.filter(user=request.user).select_related('event')
    return Response(RegistrationSerializer(registrations, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_registrations_list(request):
    if request.user.role != 'admin':
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    registrations = Registration.objects.select_related('user', 'event').all()
    event_id = request.query_params.get('event_id')
    reg_status = request.query_params.get('status')

    if event_id:
        registrations = registrations.filter(event_id=event_id)
    if reg_status:
        registrations = registrations.filter(status=reg_status)

    return Response(RegistrationSerializer(registrations, many=True).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_registration(request, pk: int):
    if request.user.role != 'admin':
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        registration = Registration.objects.get(pk=pk)
    except Registration.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in ['accepted', 'rejected', 'pending', 'cancelled']:
        return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    registration.status = new_status
    registration.reviewed_at = timezone.now()
    registration.reviewed_by = request.user
    registration.save()

    registration.event.update_registered_count()

    return Response(RegistrationSerializer(registration).data)
