from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from pins.models import Pin
import requests
from decouple import config

class Command(BaseCommand):
    help = 'Fetches random pins from Unsplash API'

    def handle(self, *args, **options):
        access_key = config('UNSPLASH_ACCESS_KEY')
        count = 10
        url = f'https://api.unsplash.com/photos/random?client_id={access_key}&count={count}'
        try:
            response = requests.get(url)
            response.raise_for_status()
            photos = response.json()
            admin = User.objects.get(username=config('SUPERUSER_USERNAME', default='admin'))
            for photo in photos:
                title = (photo['description'] or 'Untitled')[:200]  # Truncate title
                Pin.objects.get_or_create(
                    user=admin,
                    title=title,
                    defaults={
                        'image_url': photo['urls']['regular'],
                        'description': f"Photo by {photo['user']['name']} on Unsplash",
                    }
                )
                # Trigger download event
                download_url = photo['links']['download_location']
                requests.get(download_url, params={'client_id': access_key})
            self.stdout.write(self.style.SUCCESS(f'Successfully fetched {count} pins'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
