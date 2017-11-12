import re

from django.conf import settings
from django.contrib.auth.decorators import login_required


class RequiredLoginMiddleware(object):
    """
    Middleware component that wraps the login_required decorator around
    matching URL patterns. To use, add the class to MIDDLEWARE_CLASSES and
    define LOGIN_REQUIRED_URLS and LOGIN_REQUIRED_URLS_EXCEPTIONS in your
    settings.py. For example:
    ------
    LOGIN_REQUIRED_URLS = (
        r'/topsecret/(.*)$',
    )
    LOGIN_REQUIRED_URLS_EXCEPTIONS = (
        r'/topsecret/login(.*)$',
        r'/topsecret/logout(.*)$',
    )
    ------
    LOGIN_REQUIRED_URLS is where you define URL patterns; each pattern must
    be a valid regex.

    LOGIN_REQUIRED_URLS_EXCEPTIONS is, conversely, where you explicitly
    define any exceptions (like login and logout URLs).
    """

    def __init__(self, get_response):
        """
        Initiate Middleware, fetch routed URLs
        """
        self.get_response = get_response

        # Get URLs which require a log in
        if hasattr(settings, 'LOGIN_REQUIRED_URLS'):
            required = settings.LOGIN_REQUIRED_URLS
            self.required = (
                tuple(re.compile(url) for url in required))
        else:
            self.required = ()

        # Get URLs which do not require a login
        if hasattr(settings, 'LOGIN_REQUIRED_URLS_EXCEPTIONS'):
            exceptions = settings.LOGIN_REQUIRED_URLS_EXCEPTIONS
            self.exceptions = (
                tuple(re.compile(url) for url in exceptions))
        else:
            self.exceptions = ()

    def __call__(self, request):
        """
        """
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Process view request, check whether to require login or not
        """
        # No need to process URLs if user already logged in
        if request.user.is_authenticated():
            return None

        # An exception match should immediately return None
        for url in self.exceptions:
            if url.match(request.path):
                return None

        # Requests matching a restricted URL pattern are returned
        # wrapped with the login_required decorator
        for url in self.required:
            if url.match(request.path):
                return login_required(view_func)(request,
                                                 *view_args,
                                                 **view_kwargs)

        # Explicitly return None for all non-matching requests
        return None
