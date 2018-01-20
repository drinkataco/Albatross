from django.conf.urls import url
from django.contrib.auth.views import logout

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login_form, name='login'),
    url(r'^logout/$', logout, {'next_page': '/login/?bye=✔'}, name='logout')
]
