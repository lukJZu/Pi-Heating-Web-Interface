import React, {useEffect, useState} from 'react'

import {getBoilerStates} from '../lookup'

export function BoilerStateRow(props){
    const {boilerState} = props
    // const className = props.className ? props.className : "col-10 mx-auto col-md-6"
    const startTime = new Date(boilerState.start_time)
    const endTime = new Date(boilerState.end_time)

    var diff = endTime.getTime() - startTime.getTime()
    diff = diff / 1000 / 60
    diff = diff.toFixed(0)

    let dateOptions = {'day':'numeric', 'month': 'short'}
    let timeOptions = {'hour':'numeric', 'minute': 'numeric'}

    return <tr>
              <td>{startTime.toLocaleDateString('en-gb', dateOptions)} {startTime.toLocaleTimeString('en-gb', timeOptions)}</td>
              <td>{endTime.toLocaleDateString('en-gb', dateOptions)} {endTime.toLocaleTimeString('en-gb', timeOptions)}</td>
              <td>{diff}</td>
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
      }
      getBoilerStates(myCallback, limit)
      }, [])
      

      return boilerStatesInit.map((boilerState, index)=>{
        return <BoilerStateRow boilerState={boilerState} key={`${index}`}/>
      })
  }