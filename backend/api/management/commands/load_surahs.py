# load_surahs.py - A management command that pulls all 114 surahs from the
# Al Quran Cloud API and saves them to our database. Run once to populate
# the surah table with trusted, verified data.

import requests
from django.core.management.base import BaseCommand
from api.models import Surah


class Command(BaseCommand):
    help = 'Load all 114 surahs from the Al Quran Cloud API'

    def handle(self, *args, **options):
        url = 'https://api.alquran.cloud/v1/surah'
        response = requests.get(url)
        data = response.json()

        if data['code'] != 200:
            self.stdout.write(self.style.ERROR('API request failed.'))
            return

        surahs = data['data']

        for surah in surahs:
            Surah.objects.update_or_create(
                number=surah['number'],
                defaults={
                    'name_arabic': surah['name'],
                    'name_english': surah['englishName'],
                    'english_translation': surah['englishNameTranslation'],
                    'number_of_ayahs': surah['numberOfAyahs'],
                    'revelation_type': surah['revelationType'],
                },
            )

        self.stdout.write(self.style.SUCCESS('Loaded all 114 surahs.'))