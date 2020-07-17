import os, sys, subprocess, json, time, datetime
# from pathlib import Path
from django.shortcuts import redirect
from django.views import View
from django.template import loader
from .forms import boostHotWaterForm
from home.constants import homePath, stateJsonPath


def checkState():
    with open(stateJsonPath, 'r') as f:
        states = json.load(f)

    return states

def stop_boost(request):
    states = checkState()

    states['hotWater']['boost'] = False
    states['hotWater']['endTime'] = (datetime.datetime.now().astimezone()).isoformat()

    with open(stateJsonPath, 'w') as f:
        json.dump(states, f)

    return redirect('/')


# Create your views here.
class BoostView(View):

    def get(self, request):
        #get the current boost state dict
        boostState = checkState()
        #if hot water boost is on
        if boostState['hotWater']['boost']:
            # get the end boost time
            endTime = datetime.datetime.fromisoformat(boostState['hotWater']['endTime'])
            #calculate time left
            timeLeft = (endTime - datetime.datetime.now().astimezone()).seconds / 60
            #pass to context to be rendered
            context = {'state':True, 'endTime':endTime, 'timeLeft': timeLeft}
        #if hot water boost is not on, then render the boost form
        else:
            context = None

        return loader.render_to_string("homepage/hotWaterBoost.html", context, request)

    def post(self, request):
        form = boostHotWaterForm(request.POST or None)

        if form.is_valid():
            #get the boost minutes sent through POST
            boostMinutes = form.cleaned_data['boostMinutes']
            #get the existing boost states json
            states = checkState()

            states['hotWater']['boost'] = True
            states['hotWater']['endTime'] = (datetime.datetime.now().astimezone() + datetime.timedelta(seconds = boostMinutes * 60)).isoformat()
            
            with open(stateJsonPath, 'w') as f:
                json.dump(states, f)
            return redirect('/')


