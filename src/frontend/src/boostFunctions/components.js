import React, { useState, useEffect, Component } from 'react'
import Button from 'react-bootstrap/Button';
import RangeSlider from 'react-bootstrap-range-slider';
import moment from 'moment';

import {hideSpinner} from '../common'
import { APILookup } from '../lookup'

// function CategoryStatesBlock(props){

//     const {controlState, operationState, 
//                           boostState, cat} = props
//     //setting colours depending on boost states
//     var colour
//     if (boostState || operationState){
//         colour = 'danger'
//     } else if (controlState){
//         colour = 'warning'
//     } else{
//         colour = 'success'
//     }

//     var catText = cat === "heating" ? "Heating":'Water' 
//     var controlText
//     if(boostState){
//         controlText = "Boost\nOn"
//     } else if (!controlState){
//         controlText = 'Control\nOff'
//     } else if (cat === 'hotWater'){
//         controlText = 'Scheduled\nControl'
//     } else {
//         controlText = 'Thermostat\nControl'
//     }

//     const buttonOnClickEvent = (event) =>{
//         event.preventDefault()
//         // remove focus on button
//         event.target.blur()
//         var data = {'device': cat, 'state': !controlState}
//         //callback for then the state change POST method has returned
//         const returnCallBack = (response, status) =>{
//             if (status === 201){
//                 APILookup('GET', 'currentStates', populateCurrentStates, {})
//             } else {
//                 alert('State change failed')
//             }
//         }

//         APILookup('POST', 'currentStates/change', 
//                             returnCallBack, data)

//     }

//     return (
//         <div>
//             <button className={`btn btn-block btn-${colour}`} style={{maxWidth:130, whiteSpace: "pre-wrap"}}
//                     onClick={buttonOnClickEvent}> 
//                 <h4 class="font-weight-bold alert-heading text-center pt-1">{catText}</h4>
//                 <hr className={`alert-${colour}`} />
//                 <h6 className="text-center">{controlText}</h6>
//                 <hr className={`alert-${colour}`} />
//                 <OperationStateOnOffText state={operationState} type={0}/>
//             </button>
//         </div>
//     )

// }

// function OperationStateOnOffText(props){
//     const { state, type } = props
//     var text = state ? "ON" : "OFF"
//     var Tag = type === 1 ? 'h3' : 'h4'

//     const className = "font-weight-bold text-center"
//     return <Tag className={className}>{text}</Tag>
// }

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
        // event.target.blur()
        //get the button click and the boost type
        const boostType = event.target.title
        //turn the state to opposite
        const setValue = boostType === 'hotWater' ? 
                        !hotWaterBoostState.boost                
                        : !heatingBoostState

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