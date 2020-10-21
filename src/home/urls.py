"""home URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

from home.views import HomePage
from home.currentStates import getJSONCurrentStates, setCurrentState
from HotWaterBoost.views import stop_boost
from boilerHistory.views import HistoryPage
from agileRates.views import agileRatesView, getJSONAgileRates
from googleNest.views import GoogleNestPage#get_nest_view

urlpatterns = [
    path('', HomePage.as_view()),
    path('', include('boilerHistory.urls')),
    path('react/', TemplateView.as_view(template_name='react.html')),
    path('admin/', admin.site.urls),
    path('stop_boost/', stop_boost),
    path('history/', HistoryPage.as_view()), 
    path('agile_rates/', agileRatesView.as_view()), 
]


#add the APIs
urlpatterns += [
    path('api/currentStates/', getJSONCurrentStates),
    path('api/currentStates/change', setCurrentState),
    path('api/agileRates/', getJSONAgileRates),
    path('api/googleNest/', GoogleNestPage.as_view()),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#             document_root=settings.STATIC_ROOT)