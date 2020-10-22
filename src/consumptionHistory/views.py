from django.shortcuts import render
from django.template import loader
from django.views import View
from rest_framework.decorators import api_view
from rest_framework.response import Response

from home.constants import consumptionDFPath
from home.views import move_build_static

import pandas as pd

@api_view(['GET'])
def getJSONLeccyUse(request, *args, **kwargs):
    
    df = pd.read_pickle(consumptionDFPath)
    df = df.dropna()
    df = df.sort_values('interval_start', ascending=False)
    use_dict = df.to_dict(orient='records')
    
    resp_dict = {
                'leccyUse':use_dict
                }

    return Response(resp_dict, status=200)


# Create your views here.
class ConsumptionPage(View):

    def get(self, request):


        context = {}
        context['title'] = "Electricity Use History"
        js_files = move_build_static()
        context['js_files'] = js_files

        return render(request, "consumptionPage.html", context)