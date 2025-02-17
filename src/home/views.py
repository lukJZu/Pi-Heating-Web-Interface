import os, csv, sys, re, glob, shutil
from datetime import datetime
from dateutil.tz import tzlocal

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.apps import apps
from django.views import View
from django.utils.decorators import method_decorator
# from django.contrib.auth.decorators import login_required
# from django.contrib.admin.views.decorators import staff_member_required

from home.constants import homePath

# @method_decorator(staff_member_required, name = 'get')
class HomePage(View):

    def get(self, request):
        #checking for new states to be updated into the DB
        updateHistoryDB()

        js_files = move_build_static()
        title = "Pi-Heating Dashboard"
        context = {"title":title,
                    "js_files":js_files}

        return render(request, "homepage/homepage.html", context)


def move_build_static():
    if not settings.DEBUG:
        return None

    build_js_path = os.path.join(settings.BASE_DIR, 'frontend/build/static/js')
    build_css_path = os.path.join(settings.BASE_DIR, 'frontend/build/static/css')
    try:
        build_js_dir = os.listdir(build_js_path)
        build_css_dir = os.listdir(build_css_path)
    except FileNotFoundError:
        build_js_dir = []
        build_css_dir = []

    r1 = re.compile('^main.*js$')
    r2 = re.compile('^2.*chunk.{1}js$')
    css_filter = re.compile('^main.*css$')
    static_js_path = os.path.join(settings.STATICFILES_DIRS[0], 'react/js')
    static_css_path = os.path.join(settings.STATICFILES_DIRS[0], 'react/css')
    static_js_dir = os.listdir(static_js_path)
    static_css_dir = os.listdir(static_css_path)

    if build_js_dir:
        #clear the static js and css folder
        for file_name in static_js_dir:
            os.remove(os.path.join(static_js_path, file_name))

        for file_name in static_css_dir:
            os.remove(os.path.join(static_css_path, file_name))

        #move all files from build to static js+css folder
        for file_name in build_js_dir:
            shutil.move(os.path.join(build_js_path, file_name), 
                        os.path.join(static_js_path, file_name))
        for file_name in build_css_dir:
            shutil.move(os.path.join(build_css_path, file_name), 
                        os.path.join(static_css_path, file_name))
        
    #re-fetch new file names
    static_js_dir = os.listdir(static_js_path)
    static_main_file = list(filter(r1.match, static_js_dir))[0]
    static_sub_file = list(filter(r2.match, static_js_dir))[0]
    static_css_file = list(filter(css_filter.match, static_css_dir))[0]
    # raise EnvironmentError
    return (static_main_file, static_sub_file, static_css_file)

    # if not settings.DEBUG:
    #     return None

    # build_js_path = os.path.join(settings.BASE_DIR, 'frontend/build/static/js')
    # try:
    #     build_js_dir = os.listdir(build_js_path)
    # except FileNotFoundError:
    #     build_js_dir = []

    # r1 = re.compile('^main.*js$')
    # r2 = re.compile('^2.*chunk.{1}js$')
    # static_js_path = os.path.join(settings.STATICFILES_DIRS[0], 'js')
    # static_js_dir = os.listdir(static_js_path)

    # if build_js_dir:
    #     #clear the static js folder
    #     for file_name in static_js_dir:
    #         os.remove(os.path.join(static_js_path, file_name))
    #     #move all files from build to static js folder
    #     for file_name in build_js_dir:
    #         shutil.move(os.path.join(build_js_path, file_name), 
    #                     os.path.join(static_js_path, file_name))
        
    # #re-fetch new file names
    # static_js_dir = os.listdir(static_js_path)
    # static_main_file = list(filter(r1.match, static_js_dir))[0]
    # static_sub_file = list(filter(r2.match, static_js_dir))[0]
    
    # return (static_main_file, static_sub_file)



#function that checks for existing data in the csv file saved from the measureBoiler.py script
def updateHistoryDB():
    csvFile = os.path.join(homePath, 'data', 'boilerState.csv')
    if not os.path.isfile(csvFile):
        return

    with open(csvFile, 'r') as f:
        lines = list(csv.reader(f))
        
    states = condenseTimes(lines)
    #get all items in the database to check for existing
    models = apps.get_model('boilerHistory', 'BoilerState')

    for state in states:
        #check whether the time is present in the database
        exist = models.objects.filter(start_time = state[0]).count()
        if not exist:
            #only save the state if the duration is more than 3min
            if (state[1] - state[0]).seconds < 180:
                continue
            
            histObj = apps.get_model('boilerHistory', 'BoilerState').create()
            histObj.start_time = state[0]
            histObj.end_time = state[1]
            histObj.hot_water_state = state[2][0]
            histObj.heating_state = state[2][1]
            histObj.save()

    # clear the existing csv file
    with open(csvFile, 'w') as f:
        #check if the last item in the csv is saying boiler is on
        #then write that line back into the csv
        values = ''
        for no in range(len(lines)-1, -1, -1):
            if not len(lines[no]):
                continue
            elif no == len(lines)-1 or lines[no][-1] == 'True':
                value = lines[no][0] + ","
                value += ",".join(str(v) for v in lines[no][1:])
                value += "\n"
                values = value + values
            else:
                break

        f.write(values)



def condenseTimes(timeStates:list):
    condensedTimes = []
    #return empty list if nothing is passed in
    if not timeStates:
        return condensedTimes

    #initialise previous states
    prevStates = [0] * (len(timeStates[0]) - 1)
    #iterate over each row in the csv
    for timeState in timeStates:
        #if no states passed, then do nothing
        if len(timeState) <= 1:
            continue
        #convert strings to bool
        currentStates = [False if a == 'False' else True for a in timeState[1:]]
        #if boiler state is true
        if currentStates[-1]:
            #if previous boiler state is false then record the start time
            if not prevStates[-1]:
                startTime = datetime.fromisoformat(timeState[0])
            #if any of the previous state has since changed, record new entry
            elif currentStates != prevStates:
                endTime = datetime.fromisoformat(timeState[0])
                condensedTimes.append((startTime, endTime, prevStates))            
                startTime = endTime
        #if boiler is off
        elif not currentStates[-1]:
            #if boiler was on, then record new entry
            if prevStates[-1]:
                endTime = datetime.fromisoformat(timeState[0])
                condensedTimes.append((startTime, endTime, prevStates))
        #store current states as previous
        prevStates = currentStates

    return condensedTimes