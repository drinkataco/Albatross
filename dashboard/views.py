from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods

from .forms.login import *


@require_http_methods(["GET"])
def index(request):
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
    form = LoginForm(request.POST)

    if (request.method == 'POST'):
        if form.is_valid():
            user = authenticate(username=request.POST['username'],
                                password=request.POST['password'])

            if user is not None and user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                # show errors
                form.add_error('username','Authentication Error')
    else:
        form = LoginForm(None)


    template = loader.get_template('dashboard/pages/login.html')

    context = {
        'form': form
    }

    return HttpResponse(template.render(context, request))
