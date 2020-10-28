import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BoilerStateList } from './boilerStates'
import { AgileRateCard, AgileRateList } from './agileRates'
import { populateCurrentStates } from './currentStates';
import { APILookup } from './lookup'
import { NestCard } from './googleNest'
import Consumption from './consumptionHistory'
import { BoostStatesCard } from './boostFunctions'
import * as serviceWorker from './serviceWorker';

import "./main.css"
import "./darkly.min.css"

const appEl = document.getElementById('root')
if (appEl){
  ReactDOM.render(<Consumption />, appEl);
}

const boilerStateRows = document.getElementById('boilerStateRows')
if (boilerStateRows){
  ReactDOM.render(<BoilerStateList limit={0}/>, boilerStateRows);
  
}

const boilerStateEl = document.getElementById('boilerStateCard')
if (boilerStateEl){
  ReactDOM.render(<BoilerStateList limit={5}/>, boilerStateEl);
}

const agileRatesEl = document.getElementById('agileRateTable')
if (agileRatesEl){
  ReactDOM.render(<AgileRateList />, agileRatesEl);
}

var agileRatesCardEl = document.getElementById('agile-rates-card')
if (agileRatesCardEl){
    ReactDOM.render(<AgileRateCard type={'homepage'}/>, agileRatesCardEl);
}
agileRatesCardEl = document.getElementById('agile-rates-page-cards')
if (agileRatesCardEl){
    ReactDOM.render(<AgileRateCard type={'top'}/>, agileRatesCardEl);
}
const nestCardEl = document.getElementById('nest-card-content')
if (nestCardEl){
    ReactDOM.render(<NestCard />, nestCardEl);
}

const currentStatesEl = document.getElementById('current-states-card-body')
if (currentStatesEl){
    APILookup('GET', 'currentStates', populateCurrentStates, {})
}

const consumptionTableEl = document.getElementById('consumption-page')
if (consumptionTableEl){
    ReactDOM.render(<Consumption />, consumptionTableEl);
}

const boostStatesCard = document.getElementById('boost-states-card-content')
if (boostStatesCard){
    ReactDOM.render(<BoostStatesCard />, boostStatesCard);
}

// const chartEl = document.getElementById('consumption-page-chart')
// if (chartEl){
//     ReactDOM.render(<LeccyUseChart />, chartEl);
// }

// const currentStatesEl = document.getElementById('current-states-card-body')
// if (boilerStateEl){
//   ReactDOM.render(<CurrentStatesCard />, currentStatesEl);
// }

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
