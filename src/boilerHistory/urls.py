from django.urls import path
from . import views

urlpatterns = [
    path('api/boilerStates/<int:limit>', views.BoilerStateListCreate.as_view()),
]