import React, {useEffect, useState} from 'react'

import {APILookup} from '../lookup'

export function AgileRateRow(props){
    const {agileRate, todaysMin, tmrsMin} = props
    const startTime = new Date(agileRate.valid_from)
    const endTime = new Date(agileRate.valid_to)
    const rate = agileRate.rate
    const timeNow = new Date()

    //return None if rates are from yesterday
    // if (timeNow.getDate() > startTime.getDate() || 
    //         timeNow.getMonth() > startTime.getMonth() ||
    //         timeNow.getFullYear() > startTime.getFullYear()){
    //     return ''
    // }

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
        const spinnerEl = document.getElementById('agile-rates-table-spinner')
        if (spinnerEl){
          spinnerEl.innerHTML = ""
        }
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