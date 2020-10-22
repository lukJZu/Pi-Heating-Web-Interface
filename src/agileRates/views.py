import os, csv, json
from datetime import datetime, timedelta, date
from tzlocal import get_localzone
import pandas as pd

from django.shortcuts import render
from django.template import loader
from django.views import View

from rest_framework.decorators import api_view
from rest_framework.response import Response

from home.constants import agileRatesPath
from home.views import move_build_static

def loadRatesList():
    #read in the agile rates stored in csv
    with open(agileRatesPath, 'r') as f:
        rates = list(csv.reader(f))

    return rates

@api_view(['GET'])
def getJSONAgileRates(request, *args, **kwargs):

    df = pd.read_csv(agileRatesPath)

    df['valid_from'] = pd.to_datetime(df['valid_from']).dt.tz_convert(get_localzone())
    df['valid_to']   = pd.to_datetime(df['valid_to']).dt.tz_convert(get_localzone())
    
    #get tz-aware 12am today and tmr
    today12am = pd.Timestamp('today', tz=get_localzone()).normalize()
    tmr12am = today12am + pd.Timedelta('1 days')
    
    #converting datetime column to local timezone and compare
    #only returning rates from today onwards
    df = df[df['valid_from'] >= today12am]

    #getting today's min rate
    todaysDF = df[df['valid_from'] < tmr12am]
    todaysMin = todaysDF[todaysDF['rate'] == todaysDF['rate'].min()]['valid_from']
    # todayMinTimes = todaysMin['valid_from']
    
    tmrsDF = df[df['valid_from'] >= tmr12am]
    tmrsMin = tmrsDF[tmrsDF['rate'] == tmrsDF['rate'].min()]['valid_from']
    # tmrMinTimes = tmrsDF['valid_from']


    rates = df.to_dict(orient='records')
    resp_dict = {
                'rates':rates, 'todaysMin': todaysMin.tolist(),
                'tmrsMin': tmrsMin.tolist()
                }

    return Response(resp_dict, status=200)

# Create your views here.
def agile_rates_view_page(request):
    context = {'title':'Agile Rates'}
    js_files = move_build_static()
    context['js_files'] = js_files

    return render(request, "agileRates.html", context)

