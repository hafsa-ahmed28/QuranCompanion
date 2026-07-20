# urls.py (backend) - The project's main address book. It sends anything starting
# with "api/" to the api app's own urls.py, and keeps the built-in admin site.

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # hands all /api/... requests to the api ap
]