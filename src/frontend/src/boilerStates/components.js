import React, {useEffect, useState } from 'react'
import moment from 'moment';

import {APILookup} from '../lookup'

export function BoilerStateRow(props){
    const {boilerState} = props
    const startTime = moment(boilerState.start_time)
    const endTime = moment(boilerState.end_time)

    return <tr>
              <td>{startTime.format("ddd DD MMM HH:mm")}</td>
              <td>{endTime.format("ddd DD MMM HH:mm")}</td>
              <td>{endTime.diff(startTime, 'm')}</td>
              <td>{boilerState.hot_water_state ? "ON":"OFF"}</td>
              <td>{boilerState.heating_state ? "ON":"OFF"}</td>
            </tr>
}


export function BoilerStateList(prop){
    const [boilerStatesInit, setBoilerStatesInit] = useState([])
    const {limit} = prop
    
    useEffect(() => {
      const myCallback = (response, status) =>{
        if (status === 200) {
            setBoilerStatesInit(response)
        } else {
            alert("There was an error")
        }
        //hide the spinner
        const spinnerEl = document.getElementById('history-table-spinner')
        if (spinnerEl){
          spinnerEl.innerHTML = ""
        }
      }
      APILookup('GET', `boilerStates/${limit}`, myCallback, limit)
    }, [])
      

      return boilerStatesInit.map((boilerState, index)=>{
        return <BoilerStateRow boilerState={boilerState} key={`${index}`}/>
      })
  }