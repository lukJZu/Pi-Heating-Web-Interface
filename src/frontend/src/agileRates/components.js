import React, {useEffect, useState} from 'react'
import {hideSpinner} from '../common'

import {APILookup} from '../lookup'

export function AgileRateRow(props){
    const {agileRate, todaysMin, tmrsMin} = props
    const startTime = new Date(agileRate.valid_from)
    const endTime = new Date(agileRate.valid_to)
    const rate = agileRate.rate
    const timeNow = new Date()

    let dateOptions = {'weekday': 'short', 'day':'numeric', 'month': 'short'}
    let timeOptions = {'hour':'numeric', 'minute': 'numeric'}
    var rowColour, fontWeight
    if (todaysMin.indexOf(agileRate.valid_from) > -1){
        rowColour = 'info'
    } else if (tmrsMin.indexOf(agileRate.valid_from) > -1){
        rowColour = 'primary'
    } else if (rate > 15){
        rowColour = 'danger'
    } else if (rate < 0){
        rowColour = 'success'
    } else if (timeNow > endTime){
        rowColour = 'secondary'
    } else if (timeNow < endTime && timeNow > startTime){
        rowColour = 'light'
        fontWeight = 'font-weight-bold'
    }

    return <tr className={`table-${rowColour}`}>
                <td className={fontWeight}>
                  {startTime.toLocaleDateString('en-gb', dateOptions)} {startTime.toLocaleTimeString('en-gb', timeOptions)}
                </td>
                <td className={fontWeight}>{endTime.toLocaleDateString('en-gb', dateOptions)} {endTime.toLocaleTimeString('en-gb', timeOptions)}</td>
                <td className={fontWeight}>{rate.toFixed(3)}p</td>
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
        var todaysMinRateTime = new Date(todaysMin[0])
        var tmrsMinRateTime = new Date(tmrsMin[0])

        var timeNow = new Date()
        var currentRate = 9999, validFrom, nextTwoRates = [9999, 9999]
        for (var i = 0; i < agileRatesInit.length; i++){
            var startTime = new Date(agileRatesInit[i].valid_from)
            var endTime = new Date(agileRatesInit[i].valid_to)
            //getting the current rate
            if (startTime < timeNow && timeNow < endTime){
                currentRate = agileRatesInit[i].rate
                validFrom = new Date(agileRatesInit[i].valid_from)
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
            if (startTime.getTime() === todaysMinRateTime.getTime()){
                todaysMinRate = agileRatesInit[i].rate
            } else if (startTime.getTime() === tmrsMinRateTime.getTime()){
                tmrsMinRate = agileRatesInit[i].rate
            }
        }

        let timeOptions = {'hour':'numeric', 'minute': 'numeric'}
        const convertToDate = (value) => {
            const time = new Date(value)
            return time.toLocaleTimeString('en-gb', timeOptions)
        }

        return ( type === 'homepage' ?
        (<div>
            <div className="row">
                <div className='col-6'>
                    <h4 className="display-6">Current</h4>
                    <h5 className="lead">{currentRate.toFixed(3)}p</h5>
                    <span style={{fontSize:"95%"}}>
                        since {validFrom.toLocaleTimeString('en-gb', timeOptions)}</span>
                </div>
                <div className='col-6'>
                    <h4 className="display-6">Today's Lowest</h4>
                    <h5 className="lead">{todaysMinRate ? todaysMinRate.toFixed(3): ''}p</h5>
                    <span style={{fontSize:"95%"}}>
                        at {todaysMin.map(convertToDate).join()}</span>
                </div>
            </div>
            <hr className="alert-dark my-4"></hr>
            <div className="row">
                <div className='col-6'>
                    <h4 className="display-6">Next Two</h4>
                    { nextTwoRates[0] !== 9999 && <h5 className="lead">{nextTwoRates[0].toFixed(3)}p</h5>}
                    { nextTwoRates[1] !== 9999 && <h5 className="lead">{nextTwoRates[1].toFixed(3)}p</h5>}
                </div>
                {tmrsMinRate && <div className='col-6'>
                    <h4 className="display-6">Tomorrow's Lowest</h4>
                    <h5 className="lead">{tmrsMinRate.toFixed(3)}p</h5>
                    <span style={{fontSize:"95%"}}>at {tmrsMin.map(convertToDate).join()}</span>
                </div>}
            </div>
        </div>) : (
        <div className="row justify-content-center">
            <div className="col-md-4 col-sm-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Current Rate</h5>
                        <h3 className="font-weight-bold mb-3">{currentRate.toFixed(3)}p</h3>
                        <h5>since {validFrom.toLocaleTimeString('en-gb', timeOptions)}</h5>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-titl mb-3">Today's Lowest</h5>
                        <h3 className="font-weight-bold mb-3">{todaysMinRate ? '':todaysMinRate.toFixed(3)}p</h3>
                        <h5>at {todaysMin.map(convertToDate).join()}</h5>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Tomorrow's Lowest</h5>
                        {tmrsMinRate !== 9999 && <h3 className="font-weight-bold mb-3">{tmrsMinRate.toFixed(3)}p</h3>}
                        {tmrsMinRate !== 9999 &&  <h5>at {tmrsMin.map(convertToDate).join()}</h5>}
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
                // populateCard()
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
