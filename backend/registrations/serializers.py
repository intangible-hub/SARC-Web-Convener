"""
Serializers for the registrations app.
"""

from rest_framework import serializers
from .models import Registration
from events.serializers import EventSerializer
from users.serializers import UserSerializer


class RegistrationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    event_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Registration
        fields = [
            'id', 'user', 'event', 'event_id', 'status',
            'registered_at', 'reviewed_at', 'reviewed_by'
        ]
        read_only_fields = ['user', 'status', 'reviewed_at', 'reviewed_by']


class RegistrationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['status']
