from datetime import datetime, time, timedelta, date
from django.shortcuts import render
from django.views import View
from django.conf import settings
from django.utils import timezone
import pytz, json
import sys

from home.constants import stateJsonPath
from boilerHistory.models import BoilerState
from home.views import condenseTimes

# Create your views here.
class HistoryPage(View):

    def get(self, request):
        today = date.today()

        context = {}
        #getting all history object
        allStates = BoilerState.objects.all()
        if not allStates.exists():
            context['week'] = -1
            context['month'] = -1
            context['allTime'] = -1
            context['states'] = []
        else:
            #get the earliest date and find the number of days has passed
            earliestDate = allStates.earliest("start_time").start_time.astimezone(
                                pytz.timezone(settings.TIME_ZONE)).date()
            #include today
            totalDays = (today - earliestDate).days + 1
            #getting the daily use since start
            dailyUse = self.getDailyUse(allStates, earliestDate, totalDays)
            hot_water_daily_use = self.getDailyUse(allStates, 
                                                    date.today() - timedelta(days = 30),
                                                    30, hot_water_only=True)

            pastUse = dailyUse[-7:]
            context['week'] = sum(pastUse) / len(pastUse)

            pastUse = dailyUse[-30:]
            context['month'] = sum(pastUse) / len(pastUse)

            context['allTime'] = sum(dailyUse) / len(dailyUse)
            
            #saving the past month average to states.json
            with open(stateJsonPath, 'r') as f:
                states = json.load(f)
            with open(stateJsonPath, 'w') as f:
                hot_water_past_month = sum(hot_water_daily_use) / len(hot_water_daily_use)
                states['hotWater']['pastMonthAvg'] = hot_water_past_month
                json.dump(states, f)

            states = []
            for state in allStates:
                duration = (state.end_time - state.start_time).seconds / 60
                states.append((state, duration))
            context['states'] = list(reversed(states))

        context['title'] = "Boiler Usage History"
        return render(request, "boilerHistory.html", context)


    def getDailyUse(self, rangeQS, startDate, days, hot_water_only=False):
        dailyUse = []
        # startDate = weekAgo
        for addDate in range(days):
            queryDate = startDate + timedelta(days = addDate)
            dayQS = rangeQS.filter(start_time__date=queryDate.strftime("%Y-%m-%d"))
            if not dayQS.exists():
                #only add if the query day is not today
                if addDate != days - 1:
                    dailyUse.append(0)
                continue
            else:
                seconds = 0
                for state in dayQS:
                    if hot_water_only:
                        # print(queryDate)
                        if state.hot_water_state:
                            seconds += (state.end_time - state.start_time).seconds
                    else:
                        seconds += (state.end_time - state.start_time).seconds

                dailyUse.append(seconds/60)

        return dailyUse
        