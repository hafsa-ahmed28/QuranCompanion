# urls.py (api) - The address book for the api app. Maps each URL path to the
# view that should handle it. When a request comes to one of these paths, Django
# runs the matching function in views.py.

from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup), # POST /api/signup/  ->  creates an account
    path ('login/', views.login), # POST /api/login/ ->  logs a user in
    path('surahs/', views.surah_list), # GET /api/surahs/ -> returns all 114 surahs
]