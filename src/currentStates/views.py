import platform, json
from django.shortcuts import render, redirect
from django.template import loader
from django.views import View
from home.constants import homePath, stateJsonPath

#for debugging on PC
if 'Windows' in platform.system():
    operationStates = [True, False, True]
else:
    import RPi.GPIO as GPIO

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17, GPIO.OUT)
    GPIO.setup(18, GPIO.OUT)
    GPIO.setup(23, GPIO.IN)
    operationStates = []

def loadStatesJSON():
    with open(stateJsonPath, 'r') as f:
        jsonStates = json.load(f)
    return jsonStates

def saveStatesJSON(jsonDict):
    with open(stateJsonPath, 'w') as f:
        json.dump(jsonDict, f)


def toggleStates(request, device):
    jsonStates = loadStatesJSON()
    jsonStates[device]['state'] = not jsonStates[device]['state']
    saveStatesJSON(jsonStates)
    return redirect('/')




# Create your views here.
class CurrentStateView(View):

    def getCurrentStates(self):
        #getting the control JSON
        jsonStates = loadStatesJSON()

        hotWater, heating = {}, {}
        #setting hot water text and background colour
        hotWaterState = jsonStates['hotWater']['state']
        boostState = jsonStates['hotWater']['boost']
        if boostState:
            hotWater['control'] = "Boost\nON"
            hotWater['background'] = "danger"
        elif hotWaterState:
            hotWater['control'] = "Scheduled\nControl"
            hotWater['background'] = "warning"
        else:
            hotWater['control'] = "Control\nOFF"
            hotWater['background'] = "success"
        #setting heating text and background colour
        if jsonStates['heating']['state']:
            heating['control'] = "Thermostat\nControl"
            heating['background'] = "warning"
        else:
            heating['control'] = "Control\nOFF"
            heating['background'] = "success"

        #storing state of the hotWater, heating and boiler
        if not operationStates:
            hotWaterState = not GPIO.input(17)
            heatingState  = bool(GPIO.input(18))
            boilerState   = not GPIO.input(23)
        else:
            hotWaterState = operationStates[0]
            heatingState  = operationStates[1]
            boilerState   = operationStates[2]

        #set operation state and override colours
        hotWater['operation'] = hotWaterState
        if hotWater['operation']:
            hotWater['background'] = "danger"
        heating['operation'] = heatingState
        if heating['operation']:
            heating['background'] = "danger"

        return (hotWater, heating, boilerState)

    def get(self, request):
        states = self.getCurrentStates()
        context = {
                "hotWater": states[0],
                "heating": states[1],
                "boiler": states[2]
        }
        return loader.render_to_string("currentStates.html", context, request)