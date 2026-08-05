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
    

class ListeningProgress(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    surah = models.ForeignKey(Surah, on_delete=models.CASCADE)
    listened_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'surah')

    def __str__(self):
        return f"{self.user.username} listened to {self.surah.name_english}"
    

class ListeningGoal(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    target_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} — finish by {self.target_date}"
    

class UserProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(max_length=300, blank=True)
    avatar_icon = models.CharField(max_length=10, default='🌙')
    avatar_color = models.CharField(max_length=7, default='#1A3C40')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
