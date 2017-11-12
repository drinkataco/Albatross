from django.http import HttpResponse
from django.template import loader


def index(request):
    return HttpResponse("Hello there. You're at the index")


def login(request):
    template = loader.get_template('dashboard/ui/login.html')
    context = {
        'pageTitle': 'Login',
        'bodyClass': 'hold-transition login-page'
    }
    return HttpResponse(template.render(context, request))
