import React from 'react'
import ReactDOM from 'react-dom';

import { APILookup } from '../lookup'


function CategoryStatesBlock(props){

    const {controlState, operationState, 
                          boostState, cat} = props
    //setting colours depending on boost states
    var colour
    if (boostState || operationState){
        colour = 'danger'
    } else if (controlState){
        colour = 'warning'
    } else{
        colour = 'success'
    }

    var catText = cat === "heating" ? "Heating":'Water' 
    var controlText
    if(boostState){
        controlText = "Boost\nOn"
    } else if (!controlState){
        controlText = 'Control\nOff'
    } else if (cat === 'hotWater'){
        controlText = 'Scheduled\nControl'
    } else {
        controlText = 'Thermostat\nControl'
    }

    const buttonOnClickEvent = (event) =>{
        event.preventDefault()
        // remove focus on button
        event.target.blur()
        var data = {'device': cat, 'state': !controlState}
        //callback for then the state change POST method has returned
        const returnCallBack = (response, status) =>{
            if (status === 201){
                APILookup('GET', 'currentStates', populateCurrentStates, {})
            } else {
                alert('State change failed')
            }
        }

        APILookup('POST', 'currentStates/change', 
                            returnCallBack, data)

    }

    return (
        <div>
            <button className={`btn btn-block btn-${colour}`} style={{maxWidth:130, whiteSpace: "pre-wrap"}}
                    onClick={buttonOnClickEvent}> 
                <h4 class="font-weight-bold alert-heading text-center pt-1">{catText}</h4>
                <hr className={`alert-${colour}`} />
                <h6 className="text-center">{controlText}</h6>
                <hr className={`alert-${colour}`} />
                <OperationStateOnOffText state={operationState} type={0}/>
            </button>
        </div>
    )

}

function OperationStateOnOffText(props){
    const { state, type } = props
    var text = state ? "ON" : "OFF"
    var Tag = type === 1 ? 'h3' : 'h4'

    const className = "font-weight-bold text-center"
    return <Tag className={className}>{text}</Tag>
}


function setBoilerBlock(state){
    //change the colour
    var colour = state ? "danger" : "success"
    const boilerStateEl = document.getElementById("boiler-operation-block")
    boilerStateEl.className = `alert alert-${colour}`
    ReactDOM.render(<OperationStateOnOffText state={state} type={1}/>, 
                    document.getElementById("boiler-on-off-text"))
}


export function populateCurrentStates(response, status){
    setBoilerBlock(response.operation[2])
    ReactDOM.render(<CategoryStatesBlock controlState={response.control.hotWater.state} 
                                        operationState={response.operation[0]} 
                                        boostState={response.control.hotWater.boost} 
                                        cat={"hotWater"}/>, 
                        document.getElementById("hotWater-states-block"));
    ReactDOM.render(<CategoryStatesBlock controlState={response.control.heating.state} 
                                        operationState={response.operation[1]} 
                                        boostState={false} 
                                        cat={"heating"}/>, 
                        document.getElementById("heating-states-block"));
    
    // useEffect(() => {
    //   const myCallback = (response, status) =>{
    //     if (status === 200) {
    //       setBoilerBlock()
    //       // setBoilerStatesInit(response)
    //     } else {
    //       alert("There was an error")
    //     }
    //     const spinnerEl = document.getElementById('current-states-spinner')
    //     if (spinnerEl){
    //       spinnerEl.innerHTML = ""
    //     }
    //   }
    //   getCurrentStates(myCallback)
    //   }, [])
      
  }