import os, csv
from datetime import datetime, timedelta
from django.shortcuts import render
from django.template import loader
from django.views import View
from tzlocal import get_localzone

from home.constants import agileRatesPath

# Create your views here.
class agileRatesView(View):

    def get(self, request, count = 0):
        #read in the agile rates stored in csv
        with open(agileRatesPath, 'r') as f:
            rates = list(csv.reader(f))[1:]
            
        #getting time now
        timeNow = datetime.now().astimezone()
        #iterate over the rows to determine the currentRate
        if count:
            for no, rate in enumerate(rates):
                if datetime.fromisoformat(rate[0]) <= timeNow < datetime.fromisoformat(rate[1]):
                    currentRate = (datetime.fromisoformat(rate[0]), datetime.fromisoformat(rate[1]), rate[2])
                    break
            
            nextRates = []
            for a in range(no+1, len(rates)):
                nextRates.append(
                    (datetime.fromisoformat(rates[a][0]), 
                        datetime.fromisoformat(rates[a][1]), 
                        rates[a][2])
                )
            context = {"current": currentRate, "next": nextRates}
            return loader.render_to_string("homepage/agileRatesCard.html", context)
        else:
            for no, rate in enumerate(rates):
                if datetime.fromisoformat(rate[0]) <= timeNow < datetime.fromisoformat(rate[1]):
                    currentRate = (datetime.fromisoformat(rate[0]), datetime.fromisoformat(rate[1]), rate[2])
                    break
            dispRates = []
            for no, rate in enumerate(rates):
                startTime = datetime.fromisoformat(rate[0])
                if startTime < timeNow.replace(hour=0, minute = 0, second=0, microsecond=0):
                    continue
                dispRates.append((startTime, datetime.fromisoformat(rate[1]), float(rate[2])))
            
            context = {"rates": dispRates}

            #finding lowest rate for today
            todayMin = 9999
            tmrMin = 9999
            for rate in dispRates:
                if rate[0].astimezone(get_localzone()).date() == timeNow.date():
                    todayMin = min(todayMin, rate[2])
                elif rate[0].astimezone(get_localzone()).date() == timeNow.date() + timedelta(days=1):
                    tmrMin = min(tmrMin, rate[2])

            todayMinTimes = [rate[0] for rate in dispRates if rate[2] == todayMin \
                                and rate[0].astimezone(get_localzone()).date() == timeNow.date()] 
            tmrMinTimes = [rate[0] for rate in dispRates if rate[2] == tmrMin and \
                            rate[0].astimezone(get_localzone()).date() == timeNow.date() + timedelta(days=1)] 

            context["current"] = currentRate
            context["todayMin"] = {"rate":todayMin, "times":todayMinTimes}
            context["tmrMin"] = {"rate": tmrMin if tmrMin != 9999 else None, 
                                    "times": tmrMinTimes}

            return render(request, "agileRates.html", context)

