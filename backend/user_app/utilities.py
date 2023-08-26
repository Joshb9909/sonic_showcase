from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class HttpOnlyToken(TokenAuthentication):

    def get_auth_token_from_cookie(self, request):
        return request.COOKIES.get('token')

    def authenticate(self, request):
        auth_token = self.get_auth_token_from_cookie(request)

        if not auth_token:
            return None

        return self.authenticate_credentials(auth_token)
