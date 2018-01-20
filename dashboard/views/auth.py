from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib.auth import authenticate, login
from django.views import View

from dashboard.forms.login import *


class Login(View):
    """
    Handle the main Login
    """

    response = {}
    """Response Object for View"""

    login_template = loader.get_template('dashboard/pages/login.html')
    """The Login Form Template"""


    def get(self, request):
        """
            Load Login Form
        """
        self.response['form'] = LoginForm(None)

        return HttpResponse(self.login_template.render(self.response, request))

    def post(self, request):
        """
            Authenticate User
        """
        form = LoginForm(request.POST)

        if form.is_valid():
            user = authenticate(username=request.POST['username'],
                                password=request.POST['password'])

            if user is not None and user.is_active:
                login(request, user)

                next_page = (
                    request.POST['next'] if 'next' in request.POST.keys()
                    else '/')

                # Set expiration if remember_me not set
                if ('remember_me' not in request.POST or
                        request.POST['remember_me'] != 'on'):
                    request.session.set_expiry(0)

                return HttpResponseRedirect(next_page)
            else:
                form.add_error('username', 'Authentication Error')

        self.response['form'] = form

        return HttpResponse(
            self.login_template.render(self.response, request),
            status=401
        )
