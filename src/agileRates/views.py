import os, csv, json
from datetime import datetime, timedelta, date
from tzlocal import get_localzone
import pandas as pd

from django.shortcuts import render
from django.template import loader
from django.views import View

from rest_framework.decorators import api_view
from rest_framework.response import Response

from home.constants import agileRatesPath, agileRatesDFPath
from home.views import move_build_static

def loadRatesList():
    #read in the agile rates stored in csv
    with open(agileRatesPath, 'r') as f:
        rates = list(csv.reader(f))

    return rates

def loadRatesDF():
    df = pd.read_pickle(agileRatesDFPath)

    return df

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
class agileRatesView(View):

    def get(self, request, count = 0):
        # #read in the agile rates stored in csv            
        # rates = loadRatesList()

        # #getting time now
        # timeNow = datetime.now().astimezone()
        # #iterate over the rows to determine the currentRate
        # if count:
        #     currentRate = None
        #     for no, rate in enumerate(rates):
        #         if datetime.fromisoformat(rate[0]) <= timeNow < datetime.fromisoformat(rate[1]):
        #             currentRate = (datetime.fromisoformat(rate[0]), datetime.fromisoformat(rate[1]), rate[2])
        #             break
            
        #     nextRates = []
        #     for a in range(no+1, len(rates)):
        #         nextRates.append(
        #             (datetime.fromisoformat(rates[a][0]), 
        #                 datetime.fromisoformat(rates[a][1]), 
        #                 rates[a][2])
        #         )
        #     context = {"current": currentRate, "next": nextRates}
        #     return loader.render_to_string("homepage/agileRatesCard.html", context)
        # else:
        #     currentRate = None
        #     for no, rate in enumerate(rates):
        #         if datetime.fromisoformat(rate[0]) <= timeNow < datetime.fromisoformat(rate[1]):
        #             currentRate = (datetime.fromisoformat(rate[0]), datetime.fromisoformat(rate[1]), rate[2])
        #             break
        #     dispRates = []
        #     for no, rate in enumerate(rates):
        #         startTime = datetime.fromisoformat(rate[0])
        #         if startTime < timeNow.replace(hour=0, minute = 0, second=0, microsecond=0):
        #             continue
        #         dispRates.append((startTime, datetime.fromisoformat(rate[1]), float(rate[2])))
            
        #     # context = {"rates": dispRates}
            context = {'title':'Agile Rates'}

        #     #finding lowest rate for today
        #     todayMin = 9999
        #     tmrMin = 9999
        #     for rate in dispRates:
        #         if rate[0].astimezone(get_localzone()).date() == timeNow.date():
        #             todayMin = min(todayMin, rate[2])
        #         elif rate[0].astimezone(get_localzone()).date() == timeNow.date() + timedelta(days=1):
        #             tmrMin = min(tmrMin, rate[2])

        #     todayMinTimes = [rate[0] for rate in dispRates if rate[2] == todayMin \
        #                         and rate[0].astimezone(get_localzone()).date() == timeNow.date()] 
        #     tmrMinTimes = [rate[0] for rate in dispRates if rate[2] == tmrMin and \
        #                     rate[0].astimezone(get_localzone()).date() == timeNow.date() + timedelta(days=1)] 

        #     context["current"] = currentRate
        #     context["todayMin"] = {"rate":todayMin, "times":todayMinTimes}
        #     context["tmrMin"] = {"rate": tmrMin if tmrMin != 9999 else None, 
        #                             "times": tmrMinTimes}
            js_files = move_build_static()
            context['js_files'] = js_files

            return render(request, "agileRates.html", context)

