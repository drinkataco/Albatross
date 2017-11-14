from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods

from .forms.login import *


@require_http_methods(["GET"])
def index(request):
    """
    Main Dashboard Index
    """
    template = loader.get_template('dashboard/pages/index.html')
    context = {
        'pageTitle': 'Index'
    }
    return HttpResponse(template.render(context, request))


@require_http_methods(["GET", "POST"])
def login_form(request):
    """
    Handle Login Requests
    """
    context = {}

    # For GET, we just need to render the form
    if request.method == 'GET':
        form = LoginForm(None)

    # For POST we need to validate and authenticate
    elif request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            user = authenticate(username=request.POST['username'],
                                password=request.POST['password'])

            if user is not None and user.is_active:
                login(request, user)
                next_page = (
                    request.POST['next'] if 'next' in request.POST.keys()
                    else '/')
                return HttpResponseRedirect(next_page)
            else:
                form.add_error('username', 'Authentication Error')

    template = loader.get_template('dashboard/pages/login.html')

    context['form'] = form

    return HttpResponse(template.render(context, request))
