from django import forms

class boostHotWaterForm(forms.Form):
    boostMinutes = forms.IntegerField(max_value=120, min_value=20)