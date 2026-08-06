# urls.py (api) - The address book for the api app. Maps each URL path to the
# view that should handle it. When a request comes to one of these paths, Django
# runs the matching function in views.py.

from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('surahs/', views.surah_list),
    path('mark-listened/', views.mark_listened),
    path('listening-progress/', views.listening_progress),
    path('set-goal/', views.set_goal),
    path('get-goal/', views.get_goal),
    path('profile/', views.get_profile),
    path('profile/update/', views.update_profile),
    path('reflections/', views.list_reflections),              # GET — all user's reflections
    path('reflections/create/', views.create_reflection),      # POST — new reflection
    path('reflections/<int:reflection_id>/delete/', views.delete_reflection),  # DELETE — remove one
]