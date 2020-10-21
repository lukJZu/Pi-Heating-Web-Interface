import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BoilerStateList } from './boilerStates'
import { AgileRateCard, AgileRateList } from './agileRates'
import { populateCurrentStates } from './currentStates';
import { APILookup } from './lookup'
import { NestCard } from './googleNest'
import * as serviceWorker from './serviceWorker';

const appEl = document.getElementById('root')
if (appEl){
  ReactDOM.render(<React.StrictMode><App/></React.StrictMode>, appEl);
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
