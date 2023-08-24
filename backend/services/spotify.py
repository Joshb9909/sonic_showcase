import requests
from django.conf import settings
import base64

def get_spotify_token():
    auth_url = 'https://accounts.spotify.com/api/token'

    headers = {
        'Authorization': 'Basic ' + base64.b64encode(f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}".encode()).decode('utf-8')
    }
    data = {
        'grant_type': 'client_credentials'
    }

    response = requests.post(auth_url, headers=headers, data=data)
    response_data = response.json()

    return response_data.get('access_token')

def get_spotify_data(endpoint, query_params=None):
    base_url = 'https://api.spotify.com/v1/'
    headers = {
        'Authorization': f"Bearer {get_spotify_token()}"
    }

    response = requests.get(base_url + endpoint, headers=headers, params=query_params)
    return response.json()

def search_tracks(query, offset=0):
    endpoint = 'search'
    query_params = {
        'q': query,
        'type': 'track',
        'limit': 10,
        'offset': offset
    }
    return get_spotify_data(endpoint, query_params)

def get_track_by_id(track_id):
    endpoint = f'tracks/{track_id}'
    return get_spotify_data(endpoint)


