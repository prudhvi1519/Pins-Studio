import os
import django
from django.contrib.auth.models import User
from decouple import config

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pins_studio.settings')
django.setup()

def create_superuser():
    username = config('SUPERUSER_USERNAME', default='admin')
    email = config('SUPERUSER_EMAIL', default='admin@example.com')
    password = config('SUPERUSER_PASSWORD', default='admin123')
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print('Superuser created successfully.')
    else:
        print('Superuser already exists.')

if __name__ == '__main__':
    create_superuser()
