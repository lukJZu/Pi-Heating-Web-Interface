import sys, os
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.template import loader
from django.views import View

from rest_framework.decorators import api_view
from rest_framework.response import Response

from home.constants import homePath, stateJsonPath
import pandas as pd


#for debugging on PC
# def setup_operation_states():
#     if 'Windows' in platform.system():
#         operationStates = [True, False, True]
#     else:
#         operationStates = []
#     return operationStates

# def loadStatesJSON():
#     with open(stateJsonPath, 'r') as f:
#         jsonStates = json.load(f)
#     return jsonStates

# def saveStatesJSON(jsonDict):
#     with open(stateJsonPath, 'w') as f:
#         json.dump(jsonDict, f)

# @api_view(['POST'])
# def setCurrentState(request, *args, **kwargs):
#     data = request.data
#     jsonStates = loadStatesJSON()
#     jsonStates[data['device']]['state'] = data['state']
#     if data['device'] == 'heating' and 'RPi.GPIO' in sys.modules:
#         GPIO.output(18, data['state'])

#     saveStatesJSON(jsonStates)

#     return Response(jsonStates, status=201)

@api_view(['GET'])
def getSchedule(request, *args, **kwargs):
    scheduleDF = pd.read_csv(os.path.join(homePath, 'data', 'hotWaterSchedule.csv'))
    response_dict = scheduleDF.to_dict('records')
        # with open(os.path.join(homePath, 'data', 'hotWaterSchedule.csv'), 'r') as f:
        #     lines = list(csv.reader(f))[1:]
    return Response(response_dict, status=200)


