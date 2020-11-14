import os, sys, json, time, datetime
from django.shortcuts import redirect
from django.views import View
from django.template import loader

from rest_framework.decorators import api_view
from rest_framework.response import Response
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


@api_view(['GET'])
def get_boost_states(request, *args, **kwargs):
    #get the current boost state dict
    boostStates = checkState()
    return Response(boostStates, status=200)

@api_view(['POST'])
def set_boost_states(request, *args, **kwargs):
    #get the current boost state dict
    boostStates = checkState()
    data = request.data
    
    boostStates[data['boost']]['boost'] = data['value']
    if data['value']:
        boostStates[data['boost']]['endTime'] = (datetime.datetime.now().astimezone() + 
                datetime.timedelta(seconds = data['duration'] * 60)).isoformat()

    #store the states back to file
    with open(stateJsonPath, 'w') as f:
        json.dump(boostStates, f)

    return Response(boostStates, status=201)

