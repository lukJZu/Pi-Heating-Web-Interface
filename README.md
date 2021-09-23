# Pi-Heating-Web-Interface
The web interface for the custom Raspberry Pi controlled heating, works as the front-end of the <a href="https://github.com/lukJZu/Pi-Heating">Pi-Heating</a> repository.

<b>Desktop Homepage</b>
<p>The homepage includes different "cards". The first card shows the current state of the boiler, heating and hot water controls. The heating and hot water controls can be enabled and disabled by clicking the buttons</p>
<p>The second card allows the user to "boost" the hot water or the heating. Boosting is a typical function in most timers with immersion cylinder to heat up the water for a short period of time, as typically the immersion heater is not switched on 24/7 but only a few hours daily, especially overnight when electricity is cheaper</p>
<p>The third card shows the time the RPi has calculated to be the "cheapest" time slot to heat up the tank</p>
<br>
<img alt="Desktop Homepage View" src="./screenshots/Desktop_homepage.png?raw=true" width="80%" height="80%">

<br>
<b>Mobile Homepage</b>
<br>
<img alt="Mobile Homepage View" src="./screenshots/Mobile_Homepage.png?raw=true" width="20%" height="20%">
<img alt="Mobile Homepage View" src="./screenshots/history5.png?raw=true" width="20%" height="20%">

<br>
<b>Smart Meter Readings & Actual Cost</b>
<p>There is a page which plots your actual usage of electricity in both kWh and £, and you can adjust the time window for it as well, as well as the mean values for different time periods</p>
<img alt="Meter Reading History" src="./screenshots/history1.png?raw=true" width="75%" height="75%">
<img alt="Meter Reading History" src="./screenshots/history2.png?raw=true" width="75%" height="75%">
<img alt="Meter Reading History" src="./screenshots/history3.png?raw=true" width="75%" height="75%">

<br>
<b>Boiler Running Duration/b>
<p>There's a separate page that shows when and how long the boiler is running, and the average use. This value is then used for the daily calculation of when it's the best time to heat up the hot water tank.</p>
<img alt="Meter Reading History" src="./screenshots/history1.png?raw=true" width="75%" height="75%">
