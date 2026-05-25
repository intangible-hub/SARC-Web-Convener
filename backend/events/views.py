"""
Views for events: list, detail, create, update, delete.
Role-based: admins can create/edit/delete, students can only view.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.response import Response

from .models import Event
from .serializers import EventSerializer, EventCreateSerializer
from registrations.models import Registration


@api_view(['GET'])
@permission_classes([AllowAny])
def events_list(request):
    events = Event.objects.all()
    event_status = request.query_params.get('status')
    if event_status:
        events = events.filter(status=event_status)
    return Response(EventSerializer(events, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def event_detail(request, pk: int):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    data = EventSerializer(event).data

    if request.user.is_authenticated:
        reg = Registration.objects.filter(user=request.user, event=event).first()
        data['user_registration'] = {
            'id': reg.id,
            'status': reg.status,
            'registered_at': reg.registered_at
        } if reg else None

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_event(request):
    if request.user.role != 'admin':
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = EventCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    event = serializer.save(created_by=request.user)
    return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_update_delete_event(request, pk: int):
    if request.user.role != 'admin':
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        event.delete()
        return Response({'message': 'deleted'})

    partial = request.method == 'PATCH'
    serializer = EventCreateSerializer(event, data=request.data, partial=partial)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    event = serializer.save()
    return Response(EventSerializer(event).data)
