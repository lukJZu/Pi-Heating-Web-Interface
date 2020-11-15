import React, {useEffect, useState} from 'react'
import {hideSpinner} from '../common'
import moment from 'moment';

import {APILookup} from '../lookup'

export function AgileRateRow(props){
    const {agileRate, todaysMin, tmrsMin} = props
    const startTime = moment(agileRate.valid_from)
    const endTime = moment(agileRate.valid_to)
    const rate = agileRate.rate
    const timeNow = moment()
    // var Tag = type === 1 ? 'h3' : 'h4'

    var rowColour = "", style
    if (todaysMin.indexOf(agileRate.valid_from) > -1){
        rowColour = 'info'
    } else if (tmrsMin.indexOf(agileRate.valid_from) > -1){
        rowColour = 'primary'
    } else if (rate > 15){
        rowColour = 'danger'
    } else if (rate < 0){
        rowColour = 'success'
    } else if (timeNow.isAfter(endTime)){
        rowColour = 'secondary'
    } 
    else if (timeNow.isBetween(startTime, endTime)){
        rowColour = 'light'
    }

    //setting font weight
    if (timeNow.isBetween(startTime, endTime)){
        style = {fontSize:'larger', fontWeight:'bold'}
    }

    return <tr className={`table-${rowColour}`}>
                <td style={style}>
                  {startTime.format("ddd DD MMM HH:mm")}
                </td>
                <td style={style}>{endTime.format("ddd DD MMM HH:mm")}</td>
                <td style={style}>{rate.toFixed(3)}p</td>
            </tr>
}


export function AgileRateList(prop){
    const [agileRatesInit, setAgileRatesInit] = useState([])
    const [todaysMin, setTodaysMin] = useState([])
    const [tmrsMin, setTmrsMin] = useState([])

    useEffect(() => {
      const myCallback = (response, status) =>{
        if (status === 200) {
            setAgileRatesInit(response.rates)
            setTodaysMin(response.todaysMin)
            setTmrsMin(response.tmrsMin)
        } else {
          alert("There was an error")
        }
        
        //hide the spinner
        hideSpinner('agile-rates-table-spinner')
      }
      APILookup('GET', 'agileRates', myCallback)
    }, [])

    return agileRatesInit.map((agileRates, index)=>{
        return <AgileRateRow agileRate={agileRates} 
                            todaysMin={todaysMin}
                            tmrsMin={tmrsMin}                    
                            key={`${index}`}/>
    })
  }

export function AgileRateCard(props){
    const [agileRatesInit, setAgileRatesInit] = useState([])
    const [todaysMin, setTodaysMin] = useState([])
    const [tmrsMin, setTmrsMin] = useState([])

    const {type} = props

    const populateCard = (type) => {
        //don't do anythin if no data has been received
        if (agileRatesInit.length < 1){ return ''}
        
        //setting the min rate time
        var todaysMinRateTime = moment(todaysMin[0])
        var tmrsMinRateTime = moment(tmrsMin[0])

        var timeNow = moment()
        var currentRate = 9999, nextTwoRates = [9999, 9999]
        for (var i = 0; i < agileRatesInit.length; i++){
            var startTime = moment(agileRatesInit[i].valid_from)
            var endTime = moment(agileRatesInit[i].valid_to)
            //getting the current rate
            if (timeNow.isBetween(startTime, endTime)){
                currentRate = agileRatesInit[i].rate
                var currentValidFrom = moment(agileRatesInit[i].valid_from)
                //storing the next two rates
                if (i < agileRatesInit.length - 1){
                    nextTwoRates[0] = agileRatesInit[i+1].rate
                }
                if (i < agileRatesInit.length - 2){
                    nextTwoRates[1] = agileRatesInit[i+2].rate
                }
            }

            //getting today's and tmr's min rates
            var todaysMinRate, tmrsMinRate
            if (startTime.isSame(todaysMinRateTime, 'm')){
                todaysMinRate = agileRatesInit[i].rate
            } else if (startTime.isSame(tmrsMinRateTime, 'm')){
                tmrsMinRate = agileRatesInit[i].rate
            }
        }
        
        return ( type === 'homepage' ?
        (<div>
            <div className="row">
                <div className='col-6'>
                    <h4 className="display-6">Current</h4>
                    <h5 className="lead">{currentRate.toFixed(3)}p</h5>
                    <span style={{fontSize:"95%"}}>
                        since {currentValidFrom.format("HH:mm")}</span>
                </div>
                <div className='col-6'>
                    <h4 className="display-6">Today's Lowest</h4>
                    <h5 className="lead">{typeof(todaysMinRate) === 'number' ? todaysMinRate.toFixed(3): ''}p</h5>
                    <span style={{fontSize:"95%"}}>
                        at {todaysMin.map((val) => {return moment(val).format("HH:mm")}).join()}</span>
                </div>
            </div>
            <hr className="alert-dark my-4"></hr>
            <div className="row">
                <div className='col-6'>
                    <h4 className="display-6">Next Two</h4>
                    { nextTwoRates[0] !== 9999 && <h5 className="lead">{nextTwoRates[0].toFixed(3)}p</h5>}
                    { nextTwoRates[1] !== 9999 && <h5 className="lead">{nextTwoRates[1].toFixed(3)}p</h5>}
                </div>
                {typeof(tmrsMinRate) === 'number' && <div className='col-6'>
                    <h4 className="display-6">Tomorrow's Lowest</h4>
                    <h5 className="lead">{tmrsMinRate.toFixed(3)}p</h5>
                    <span style={{fontSize:"95%"}}>at {tmrsMin.map((val) => {return moment(val).format("HH:mm")}).join()}</span>
                </div>}
            </div>
        </div>) : (
        <div className="row justify-content-center">
            <div className="col-md-4 col-sm-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Current Rate</h5>
                        <h3 className="font-weight-bold mb-3">{currentRate.toFixed(3)}p</h3>
                        <h5>since {currentValidFrom.format("HH:mm")}</h5>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-titl mb-3">Today's Lowest</h5>
                        <h3 className="font-weight-bold mb-3">{todaysMinRate ? todaysMinRate.toFixed(3) : ''}p</h3>
                        <h5>at {todaysMin.map((val) => {return moment(val).format("HH:mm")}).join()}</h5>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Tomorrow's Lowest</h5>
                        <h3 className="font-weight-bold mb-3">{tmrsMinRate ? tmrsMinRate.toFixed(3) : ''}{tmrsMinRate && `p`}</h3>
                        {tmrsMinRate && <h5>at {tmrsMin.map((val) => {return moment(val).format("HH:mm")}).join()}</h5>}
                    </div>
                </div>
            </div>
        </div>)
        )
        
    }

    useEffect(() => {
        const myCallback = (response, status) =>{
            if (status === 200) {
                setAgileRatesInit(response.rates)
                setTodaysMin(response.todaysMin)
                setTmrsMin(response.tmrsMin)
            } else {
                alert("There was an error")
            }
          
            //hide the spinner
            hideSpinner('agile-rates-card-spinner')
        }
        APILookup('GET', 'agileRates', myCallback)
    }, [])

    return populateCard(type)
}
