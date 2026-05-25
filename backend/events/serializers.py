"""
Serializers for the events app.
"""

from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'instructor', 'date',
            'location', 'capacity', 'registered_count', 'status',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'registered_count']


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'instructor', 'date', 'location', 'capacity', 'status']
