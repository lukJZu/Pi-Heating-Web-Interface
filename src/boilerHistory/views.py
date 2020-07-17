from datetime import datetime, time, timedelta, date
from django.shortcuts import render
from django.views import View
from django.conf import settings
from django.utils import timezone
import pytz

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
            totalDays = (today - earliestDate).days
            #getting the daily use since start
            dailyUse = self.getDailyUse(allStates, earliestDate, totalDays+1)

            pastUse = dailyUse[-7:]
            context['week'] = sum(pastUse) / len(pastUse)

            pastUse = dailyUse[-30:]
            context['month'] = sum(pastUse) / len(pastUse)

            context['allTime'] = sum(dailyUse) / len(dailyUse)
            
            states = []
            for state in allStates:
                duration = (state.end_time - state.start_time).seconds / 60
                states.append((state, duration))
            context['states'] = states

        context['title'] = "Boiler Usage History"
        return render(request, "boilerHistory.html", context)


    def getDailyUse(self, rangeQS, startDate, days):
        dailyUse = []
        # startDate = weekAgo
        for addDate in range(days):
            queryDate = startDate + timedelta(days = addDate)
            # print(queryDate)
            dayQS = rangeQS.filter(start_time__date=queryDate.strftime("%Y-%m-%d"))
            if not dayQS.exists():
                dailyUse.append(0)
                continue
            else:
                seconds = 0
                for state in dayQS:
                    seconds += (state.end_time - state.start_time).seconds
                dailyUse.append(seconds/60)

        return dailyUse
        