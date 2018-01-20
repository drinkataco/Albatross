from django.http import HttpResponse
from django.template import loader
from django.views import View


class Dashboard(View):
    """
        Main Dashboard
    """

    def get(self, request):
        """
        Main Index
        """
        template = loader.get_template('dashboard/pages/index.html')
        context = {
            'pageTitle': 'Index'
        }
        return HttpResponse(template.render(context, request))
