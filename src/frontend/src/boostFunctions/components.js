import React, { useState, useEffect, Component } from 'react'
import Button from 'react-bootstrap/Button';
import RangeSlider from 'react-bootstrap-range-slider';
import moment from 'moment';

import {hideSpinner} from '../common'
import { APILookup } from '../lookup'


export function BoostStatesCard(props){
    const [hotWaterBoostState, setHotWaterBoostState] = useState([])
    const [heatingBoostState, setHeatingBoostState] = useState([])
    const [sliderValue, setSliderValue] = useState(20); 

    const sliderOnChange = (event) => {
        setSliderValue(event.target.value)
    }    
    const sliderTooltip = (value) => {
        return `${value}mins`
    }
    const boostClicked = (event) => {
        //defocus the button
        event.target.blur()
        //get the button click and the boost type
        const boostType = event.target.title
        //turn the state to opposite
        const setValue = boostType === 'hotWater' ? 
                        !hotWaterBoostState.boost                
                        : !heatingBoostState.boost

        const postBoostData = { 'boost': boostType,
                                "value": setValue,
                                'duration': sliderValue}

        APILookup('POST', 'boost/set', getBoostStatesCallback, postBoostData)
    }

    const getBoostStatesCallback = (response, status) =>{
        if (status === 200 || status === 201) {
            setHotWaterBoostState(response.hotWater)
            setHeatingBoostState(response.heating)
        } else {
            alert("There was an error")
        }
      
        //hide the spinner
        hideSpinner('boost-states-card-spinner')
    }


    useEffect(() => {
        APILookup('GET', 'boost', getBoostStatesCallback)
    }, [])

    return (
        <div>
            <div className="mx-5">
                <RangeSlider value={sliderValue} onChange={sliderOnChange} 
                                min={20} max={100} variant='primary' size='lg'
                                tooltip='on' tooltipLabel={sliderTooltip}/>
            </div>
            <div className="row justify-content-center mt-5 mx-3">
                <div className='col-6' align="center">
                    <BoostButton value="hotWater" onClickCallback={boostClicked} 
                                    boostState={hotWaterBoostState}/>
                </div>
                <div className='col-6' align="center">
                    <BoostButton value="heating" onClickCallback={boostClicked} 
                                    boostState={heatingBoostState}/>
                </div>
            </div>
            
        </div>
    )
}


function BoostButton(props){
    const {value, onClickCallback, boostState} = props
    const [ hoverActive, setHoverActive ] = useState(false)
    
    const hoverIn = (event) => {
        setHoverActive(true)
    }
    const hoverOut = (event) => {
        setHoverActive(false)
    }

    var buttonText = value === 'hotWater' ? "Hot Water" : "Heating"
    const endTime = moment(boostState.endTime)

    var buttonLowerText = hoverActive ? 
        <h5 title={value}>Stop<br/>Boost</h5>
        :
        <h5 className="text-center" title={value}>
            Boosting till {endTime.format("HH:mm")}<br/>
            ({`${endTime.diff(moment(), 'm')}min${endTime.diff(moment(), 'm')>1?'s':''} remaining`})
        </h5>


    return ( boostState.boost ?
        <Button size='lg' block variant="danger"
                onClick={onClickCallback} 
                title={value}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}>
                <h5 className="font-weight-bold alert-heading text-center pt-1" title={value}>
                    {buttonText} 
                </h5>
                <hr className="alert-danger" />
                {buttonLowerText}
        </Button>
        : 
        <Button size='lg' block onClick={onClickCallback} title={value}>
            <h5 className="font-weight-bold alert-heading text-center pt-1" title={value}>
                {buttonText} 
            </h5>
            <hr className="alert-primary" />
            <h5 title={value}>Boost</h5>
        </Button>
    )
}