import os, platform
from pathlib import Path


if 'Windows' in platform.system():
    homePath = Path.home()
else:
    homePath = "/home/pi"

stateJsonPath = os.path.join(homePath, 'data', 'states.json')
agileRatesPath = os.path.join(homePath, 'data', 'agileRates.csv')