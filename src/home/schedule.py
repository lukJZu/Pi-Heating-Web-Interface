import sys, os
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.template import loader
from django.views import View

from rest_framework.decorators import api_view
from rest_framework.response import Response

from home.constants import homePath, stateJsonPath
import pandas as pd


def load_schedule_file():
    scheduleDF = pd.read_csv(os.path.join(homePath, 'data', 'hotWaterSchedule.csv'))
    scheduleDict = scheduleDF.to_dict('records')
    return scheduleDict


@api_view(['GET'])
def getSchedule(request, *args, **kwargs):
    return Response(load_schedule_file(), status=200)

@api_view(['POST'])
def setSchedule(request, *args, **kwargs):
    data = request.data
    scheduleDF = pd.DataFrame.from_records(data)
    scheduleDF = scheduleDF.sort_values(by=['start_time'])
    scheduleDF.to_csv(os.path.join(homePath, 'data', 'hotWaterSchedule.csv'), index=False)
    
    return Response(load_schedule_file(), status=201)

