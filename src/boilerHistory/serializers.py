from django.conf import settings
from rest_framework import serializers
from .models import BoilerState


class BoilerStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoilerState
        fields = ('start_time', 'end_time', "hot_water_state", "heating_state")