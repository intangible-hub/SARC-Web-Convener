"""
Seed script - creates demo users, events for immediate demo.
Run: python manage.py shell < seed.py
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from events.models import Event
from datetime import datetime, timezone as dt_tz

User = get_user_model()

# Clear existing data
User.objects.filter(email__in=['admin@sarc.edu', 'student1@sarc.edu', 'student2@sarc.edu']).delete()

# Create users
admin = User.objects.create_user(
    email='admin@sarc.edu', password='admin123', name='SARC Admin', role='admin', is_staff=True
)
student1 = User.objects.create_user(
    email='student1@sarc.edu', password='student123', name='Arjun Sharma', role='student'
)
student2 = User.objects.create_user(
    email='student2@sarc.edu', password='student123', name='Priya Patel', role='student'
)

# Create events
Event.objects.all().delete()

events_data = [
    {
        'title': 'Tech Talk 2026',
        'description': 'Annual tech talk featuring alumni from top tech companies sharing their experiences and insights about the industry.',
        'instructor': 'Dr. Rahul Mehta (Google)',
        'date': datetime(2026, 6, 15, 15, 0, tzinfo=dt_tz.utc),
        'location': 'LT 001, Main Building',
        'capacity': 100,
        'status': 'published',
    },
    {
        'title': 'Alumni Networking Night',
        'description': 'Connect with SARC alumni from various fields. An exclusive networking evening with industry leaders and mentors.',
        'instructor': 'SARC Core Team',
        'date': datetime(2026, 7, 20, 18, 0, tzinfo=dt_tz.utc),
        'location': 'SAC Foyer, IIT Bombay',
        'capacity': 60,
        'status': 'published',
    },
    {
        'title': 'Leadership Workshop',
        'description': 'Interactive workshop on leadership, communication, and personal growth led by accomplished alumni.',
        'instructor': 'Ms. Neha Kapoor (McKinsey)',
        'date': datetime(2026, 8, 10, 14, 0, tzinfo=dt_tz.utc),
        'location': 'Seminar Hall 2',
        'capacity': 40,
        'status': 'published',
    },
    {
        'title': 'Career Fair 2026',
        'description': 'Meet recruiters from 50+ companies. Bring your resume and dress professionally. Open to all students.',
        'instructor': 'Placement Cell + SARC',
        'date': datetime(2026, 9, 5, 10, 0, tzinfo=dt_tz.utc),
        'location': 'Sports Complex Hall',
        'capacity': 500,
        'status': 'published',
    },
]

for data in events_data:
    Event.objects.create(created_by=admin, **data)

print("✓ Seed complete!")
print("  Admin:    admin@sarc.edu / admin123")
print("  Student1: student1@sarc.edu / student123")
print("  Student2: student2@sarc.edu / student123")
print(f"  Events:   {Event.objects.count()} created")
