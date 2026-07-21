# models.py - This file defines what data we store in the database.
# Each class here becomes a table. Right now we have Surah - all 114 surahs,
# loaded from a trusted source so the Qur'anic text is always accurate.
# from django.db import models

from django.db import models

class Surah(models.Model):
    number = models.IntegerField(unique=True)
    name_arabic = models.CharField(max_length=100)
    name_english = models.CharField(max_length=100)
    english_translation = models.CharField(max_length=200, default='')
    number_of_ayahs = models.IntegerField()
    revelation_type = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.number}. {self.name_english} ({self.name_arabic})"