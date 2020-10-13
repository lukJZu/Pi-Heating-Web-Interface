from django.db import models

# Create your models here.
class BoilerState(models.Model):

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    hot_water_state = models.BooleanField()
    heating_state = models.BooleanField()

    class meta:
        ordering = ['-start_time']

    @classmethod
    def create(cls):
        hist = cls()
        # do something with the book
        return hist