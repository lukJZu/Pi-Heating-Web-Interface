import platform, json, sys
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.template import loader
from django.views import View

from rest_framework.decorators import api_view
from rest_framework.response import Response

from home.constants import homePath, stateJsonPath

try:
    import RPi.GPIO as GPIO
except ImportError:
    operationStates = [True, False, True]
else:
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17, GPIO.OUT)
    GPIO.setup(18, GPIO.OUT)
    GPIO.setup(23, GPIO.IN)
    operationStates = []


#for debugging on PC
def setup_operation_states():
    if 'Windows' in platform.system():
        operationStates = [True, False, True]
    else:
        operationStates = []
    return operationStates

def loadStatesJSON():
    with open(stateJsonPath, 'r') as f:
        jsonStates = json.load(f)
    return jsonStates

def saveStatesJSON(jsonDict):
    with open(stateJsonPath, 'w') as f:
        json.dump(jsonDict, f)

@api_view(['POST'])
def setCurrentState(request, *args, **kwargs):
    data = request.data
    jsonStates = loadStatesJSON()
    jsonStates[data['device']]['state'] = data['state']
    if data['device'] == 'heating' and 'RPi.GPIO' in sys.modules:
        GPIO.output(18, data['state'])

    saveStatesJSON(jsonStates)

    return Response(jsonStates, status=201)

@api_view(['GET'])
def getJSONCurrentStates(request, *args, **kwargs):
    operationStates = setup_operation_states()
    control_states = loadStatesJSON()

    #storing state of the hotWater, heating and boiler
    if not operationStates:
        operationStates = [not GPIO.input(17),
                            bool(GPIO.input(18)),
                            not GPIO.input(23)]

    response_dict = dict(control = control_states,
                        operation = operationStates)

    return Response(response_dict, status=200)


