import React, { useState, useEffect, Component } from 'react'
import Button from 'react-bootstrap/Button';
import RangeSlider from 'react-bootstrap-range-slider';
import moment from 'moment';

import {hideSpinner} from '../common'
import { APILookup } from '../lookup'


export function ScheduleCard(props){
    const [schedule, setSchedule] = useState([])


    const getScheduleCallback = (response, status) =>{
        if (status === 200 || status === 201) {
            setSchedule(response)
        } else {
            alert("There was an error")
        }
      
    }


    useEffect(() => {
        APILookup('GET', 'schedule', getScheduleCallback)
    }, [])

    return (
        <table className="table table-striped" style={{width:"100%"}}>
            <thead class="thead-dark">
            <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Hot Water</th>
                <th>Heating</th>
            </tr>
            </thead>
            <tbody>
                {schedule.map((schedule, index)=>{
                    return <ScheduleRow schedule={schedule} key={index}/>})}
            </tbody>
        </table> 
    )
}


function ScheduleRow(props){
    const {schedule, key} = props

    const startTime = moment(schedule.start_time)
    const endTime = moment(schedule.end_time)
    return ( 
        <tr className={moment().isBetween(startTime, endTime)
            ? "table-danger"
            :""}>
            <td>{startTime.format("DD MMM HH:mm")}</td>
            <td>{endTime.format("DD MMM HH:mm")}</td>
            <td>{schedule.hot_water_state?"ON":"OFF"}</td>
            <td>{schedule.heating_state?"ON":"OFF"}</td>
        </tr>
        
    )

}