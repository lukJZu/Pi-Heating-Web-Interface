import os, platform
from pathlib import Path


if 'Windows' in platform.system():
    homePath = Path.home()
else:
    homePath = "/mnt/"

boilerStatePath = os.path.join(homePath, 'data', "boilerState.csv")
stateJsonPath = os.path.join(homePath, 'data', 'states.json')
agileRatesPath = os.path.join(homePath, 'data', 'agileRates.csv')
consumptionDFPath = os.path.join(homePath, 'data', 'consumptionHistory.df')