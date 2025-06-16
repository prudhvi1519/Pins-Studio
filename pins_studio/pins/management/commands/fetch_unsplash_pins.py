import requests
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from pins.models import Pin
from pins_studio.settings import UNSPLASH_ACCESS_KEY
from django.utils.text import Truncator
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Fetch 150 pins from Unsplash and save them to the database'

    def handle(self, *args, **kwargs):
        if not UNSPLASH_ACCESS_KEY:
            logger.error("UNSPLASH_ACCESS_KEY not set in settings")
            self.stdout.write(self.style.ERROR("UNSPLASH_ACCESS_KEY not set"))
            return

        try:
            user = User.objects.get(username='prudhvi1519')
        except User.DoesNotExist:
            logger.error("User 'prudhvi1519' does not exist")
            self.stdout.write(self.style.ERROR("User 'prudhvi1519' does not exist"))
            return

        headers = {'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'}
        url = 'https://api.unsplash.com/photos'
        pins_to_fetch = 150
        pins_per_page = 25
        pages = (pins_to_fetch + pins_per_page - 1) // pins_per_page
        fetched_pins = 0
        existing_urls = set(Pin.objects.filter(source_url__isnull=False).values_list('source_url', flat=True))

        for page in range(1, pages + 1):
            params = {
                'per_page': pins_per_page,
                'page': page,
                'order_by': 'latest',
            }
            try:
                response = requests.get(url, headers=headers, params=params, timeout=10)
                response.raise_for_status()
                photos = response.json()

                for photo in photos:
                    if fetched_pins >= pins_to_fetch:
                        break

                    image_url = photo.get('urls', {}).get('regular')
                    if not image_url or image_url in existing_urls:
                        continue

                    title = Truncator(photo.get('description') or photo.get('alt_description') or 'Untitled').chars(200)
                    description = f"Photo by {photo['user']['name']} on Unsplash"
                    pin = Pin(
                        title=title,
                        source_url=image_url,  # Changed from image_url to source_url
                        description=description,
                        user=user,
                    )
                    pin.save()
                    existing_urls.add(image_url)
                    fetched_pins += 1

                self.stdout.write(self.style.SUCCESS(f"Fetched {len(photos)} photos from page {page}"))

            except requests.exceptions.RequestException as e:
                logger.error(f"Failed to fetch photos from Unsplash on page {page}: {e}")
                self.stdout.write(self.style.ERROR(f"Failed to fetch photos on page {page}: {e}"))
                continue

        self.stdout.write(self.style.SUCCESS(f"Successfully fetched {fetched_pins} pins from Unsplash"))
