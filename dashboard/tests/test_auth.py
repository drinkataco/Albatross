from django.contrib.auth.models import AnonymousUser, User
from django.test import Client, RequestFactory, TestCase

from dashboard.middleware.required_login_middleware \
    import RequiredLoginMiddleware


class AuthTest(TestCase):
    """
    Tests for authentication and login methods
    """

    def setUp(self):
        # GIVEN A Request, Routed through middleware
        self.factory = RequestFactory()
        self.response = Client()
        self.middleware = RequiredLoginMiddleware(self.response)
        self.view = lambda x: None
        self.request = self.factory.get('/')

    def test_it_should_redirect_anon_to_login(self):
        # GIVEN A unauthenticated user
        self.request.user = AnonymousUser()

        # WHEN A request/response is processed
        response = self.middleware.process_view(
            self.request,
            self.view,
            [],
            {}
        )

        # THEN The user shouldn't be authenticated, and the request
        # should be redirected
        self.assertEqual(self.request.user.is_authenticated(), False)
        self.assertEqual(response.status_code, 302)

    def test_it_shouldnt_redirect_anon_from_login(self):
        # GIVEN A unauthenticated user at the login page
        self.request = self.factory.get('/login')
        self.request.user = AnonymousUser()

        # WHEN A request/response is processed
        response = self.middleware.process_view(
            self.request,
            self.view,
            [],
            {}
        )

        # THEN The user shouldn't be authenticated, and the request
        # should be redirected
        self.assertEqual(self.request.user.is_authenticated(), False)
        self.assertEqual(response, None)

    def test_it_shouldnt_redirect_user_to_login(self):
        # GIVEN A authenticated user
        self.request.user = User()

        # WHEN A request/response is processed
        response = self.middleware.process_view(
            self.request,
            self.view,
            [],
            {}
        )

        # THEN The user should be authenticated and no redirect returned
        self.assertEqual(self.request.user.is_authenticated(), True)
        self.assertEqual(response, None)
