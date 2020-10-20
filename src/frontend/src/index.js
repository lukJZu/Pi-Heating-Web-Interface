import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BoilerStateList } from './boilerStates'
import { AgileRateList } from './agileRates'
import { populateCurrentStates } from './currentStates';
import { APILookup } from './lookup'
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
