from django.conf.urls import url
from django.contrib.auth.views import logout

from dashboard.views.dashboard import *
from dashboard.views.auth import *

urlpatterns = [
    url(r'^$', Dashboard.as_view(), name='index'),
    url(r'^login/$', Login.as_view(), name='login'),
    url(r'^logout/$', logout, {'next_page': '/login/?bye=✔'}, name='logout')
]
