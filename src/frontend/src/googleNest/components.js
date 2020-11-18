import React, {useEffect, useState} from 'react'
import {APILookup} from '../lookup'
// import InputSpinner from "react-native-input-spinner";

export function NestCard(props){
    const [ambientTemp, setAmbientTemp] = useState([])
    const [thermostatTemp, setThermostatTemp] = useState([])

    // const {type} = props

    useEffect(() => {
        const myCallback = (response, status) =>{
            if (status === 200) {
                // console.log(response.traits["sdm.devices.traits.ThermostatTemperatureSetpoint"]["heatCelsius"])
                if ("heatCelsius" in response.traits["sdm.devices.traits.ThermostatTemperatureSetpoint"]){
                    setThermostatTemp(response.traits["sdm.devices.traits.ThermostatTemperatureSetpoint"]["heatCelsius"])
                }
                setAmbientTemp(response.traits["sdm.devices.traits.Temperature"]["ambientTemperatureCelsius"])
            } else {
                alert("Error in retrieving Nest Data")
            }
          
            //hide the spinner
            
        }
        APILookup('GET', 'googleNest', myCallback)
    }, [])

    return ( typeof(ambientTemp) === 'number' ?
        <div>
            <h5>Ambient Temp:  {ambientTemp.toFixed(2)} </h5>
            <h5>Thermostat Set Temp: {typeof(thermostatTemp) === 'number' && thermostatTemp.toFixed(2)}</h5>
        </div>
        : 
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}
