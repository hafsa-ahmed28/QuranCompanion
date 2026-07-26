# views.py - The backend's logic. Each function here ("view") handles one type of
# request from the frontend: it reads the incoming data, does the work (check input,
# talk to the database), and sends a response back. Currently handles: signup, login.

# These imports pull in the tools this file needs:
from django.contrib.auth.models import User          # Django's built-in user (handles password hashing for us)
from django.contrib.auth import authenticate         # Checks if a username + password combo is valid
from rest_framework.decorators import api_view        # Marks a function as an API endpoint
from rest_framework.response import Response           # Lets us send JSON responses back to the frontend
from rest_framework import status                      # Named HTTP status codes (200, 400, etc.) for readability
from rest_framework.authtoken.models import Token      # The login "wristband" token system
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from api.models import Surah, ListeningProgress

# SIGNUP: creates a new account. Only accepts POST because the user is SENDING us data.
@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Don't let someone sign up with a blank username or password.
    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Usernames must be unique, so reject one that already exists.
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'That username is already taken.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # create_user automatically hashes the password, so the real password is never stored.
    user = User.objects.create_user(username=username, password=password)

    # Give the new user a token they'll use to prove they're logged in from now on.
    token = Token.objects.create(user=user)

    # Send the token and username back to the frontend. 201 = "created successfully".
    return Response(
        {'token': token.key, 'username': user.username},
        status=status.HTTP_201_CREATED
    )


# LOGIN: checks an existing account's credentials. Also POST, since we're sending login details.
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # authenticate returns the user if the password is correct, or None if it's wrong.
    user = authenticate(username=username, password=password)

    # Wrong username or password -> reject. 401 = "not authorized".
    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Fetch the user's existing token, or make one if they somehow don't have it yet.
    token, created = Token.objects.get_or_create(user=user)

    # Send the token back so the frontend can store it and stay logged in. 200 = "OK".
    return Response(
        {'token': token.key, 'username': user.username},
        status=status.HTTP_200_OK
    )


# SURAH LIST: returns all 114 surahs. Requires the user to be logged in.
@api_view(['GET'])
def surah_list(request):
    # Check the user sent a valid token
    auth = TokenAuthentication()
    try:
        user, token = auth.authenticate(request)
    except:
        return Response(
            {'error': 'You must be logged in.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    surahs = Surah.objects.all().order_by('number')

    surah_data = []
    for surah in surahs:
        surah_data.append({
            'number': surah.number,
            'name_arabic': surah.name_arabic,
            'name_english': surah.name_english,
            'english_translation': surah.english_translation,
            'number_of_ayahs': surah.number_of_ayahs,
            'revelation_type': surah.revelation_type,
        })

    return Response(surah_data, status=status.HTTP_200_OK)


# MARK LISTENED: saves that the logged-in user has listened to a specific surah.
@api_view(['POST'])
def mark_listened(request):
    auth = TokenAuthentication()
    try:
        user, token = auth.authenticate(request)
    except:
        return Response(
            {'error': 'You must be logged in.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    surah_number = request.data.get('surah_number')

    try:
        surah = Surah.objects.get(number=surah_number)
    except Surah.DoesNotExist:
        return Response(
            {'error': 'Surah not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    progress, created = ListeningProgress.objects.get_or_create(user=user, surah=surah)

    if not created:
        return Response(
            {'message': 'Already marked as listened.'},
            status=status.HTTP_200_OK
        )

    return Response(
        {'message': f'Marked {surah.name_english} as listened.'},
        status=status.HTTP_201_CREATED
    )


# LISTENING PROGRESS: returns which surahs the logged-in user has listened to.
@api_view(['GET'])
def listening_progress(request):
    auth = TokenAuthentication()
    try:
        user, token = auth.authenticate(request)
    except:
        return Response(
            {'error': 'You must be logged in.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    listened = ListeningProgress.objects.filter(user=user).values_list('surah__number', flat=True)

    return Response(
        {'listened': list(listened)},
        status=status.HTTP_200_OK
    )

