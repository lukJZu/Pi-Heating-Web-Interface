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
from home.boostAPIs import get_boost_states, set_boost_states
from boilerHistory.views import HistoryPage, BoilerStateListCreate
from agileRates.views import agile_rates_view_page, getJSONAgileRates
from googleNest.views import GoogleNestPage#get_nest_view
from consumptionHistory.views import ConsumptionPage, getJSONLeccyUse

urlpatterns = [
    path('', HomePage.as_view()),
    # path('', include('boilerHistory.urls')),
    path('react/', TemplateView.as_view(template_name='react.html')),
    path('admin/', admin.site.urls),
    path('history/', HistoryPage.as_view()), 
    path('agile_rates/', agile_rates_view_page), 
    path('consumption-history/', ConsumptionPage.as_view()), 
]


#add the APIs
urlpatterns += [
    path('api/boilerStates/<int:limit>', BoilerStateListCreate.as_view()),
    path('api/consumptionHistory/', getJSONLeccyUse),
    path('api/currentStates/', getJSONCurrentStates),
    path('api/currentStates/change', setCurrentState),
    path('api/agileRates/', getJSONAgileRates),
    path('api/googleNest/', GoogleNestPage.as_view()),
    path('api/boost/', get_boost_states),
    path('api/boost/set', set_boost_states),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#             document_root=settings.STATIC_ROOT)