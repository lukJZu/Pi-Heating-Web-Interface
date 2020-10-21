from django.shortcuts import render
from django.shortcuts import redirect
from django.views import View
from django.http import HttpResponse, Http404, JsonResponse
import logging, sys, traceback

import json, requests
from home.constants import homePath, stateJsonPath
from .token_request import get_access_token

logger = logging.getLogger(__name__)

# Create your views here.
class GoogleNestPage(View):
    
    def get_nest_response(self):
        with open(f'{homePath}/data/oauth_secret_web.json', 'r') as f:
            json_dict = json.load(f)['web']
        device_id = json_dict['device_id']
        project_id = json_dict['device_access_project_ID']

        access_token = get_access_token()
        url = f"https://smartdevicemanagement.googleapis.com/v1/enterprises/{project_id}/devices/{device_id}"

        # setData = {
        #     "command" : "sdm.devices.commands.ThermostatTemperatureSetpoint.SetHeat",
        #     "params" : {
        #         "heatCelsius" : 20.5
        #     }
        # }
        
        resp = requests.get(url, headers={"Content-Type": "application/json", 
                                "Authorization": f"Bearer {access_token}"})
        
        if resp.status_code != 200:
            raise ConnectionRefusedError

        # x = requests.post(url+':executeCommand', headers={"Content-Type": "application/json", 
        #                 "Authorization": f"Bearer {access_token}"},
        #                 data=json.dumps(setData))
        # print(x.json())

        return resp.json()


    def get(self, request):
        try:
            json_resp = self.get_nest_response()
            status = 200
        except ConnectionRefusedError:
            json_resp = {'message': 'GOOGLE API ERROR'}
            status = 401
        except:
            error = sys.exc_info()
            json_resp = {'message': f'{error[0]}', 'details':traceback.extract_tb(error[2]).format() }
            status = 400

        return JsonResponse(json_resp, status=status)