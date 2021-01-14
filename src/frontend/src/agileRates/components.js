import React, {useEffect, useState} from 'react'
import {hideSpinner} from '../common'
import { ResponsiveContainer, Bar, Cell,
        CartesianGrid, XAxis, YAxis, ComposedChart, 
        Tooltip, ReferenceLine, LabelList } from 'recharts';
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
        var currentRate = 9999, nextRates = [9999, 9999, 9999, 9999]
        for (var i = 0; i < agileRatesInit.length; i++){
            var startTime = moment(agileRatesInit[i].valid_from)
            var endTime = moment(agileRatesInit[i].valid_to)
            //getting the current rate
            if (timeNow.isBetween(startTime, endTime)){
                currentRate = agileRatesInit[i].rate
                var currentValidFrom = moment(agileRatesInit[i].valid_from)
                //storing the next two rates
                if (i < agileRatesInit.length - 1){
                    nextRates[0] = agileRatesInit[i+1].rate
                }
                if (i < agileRatesInit.length - 2){
                    nextRates[1] = agileRatesInit[i+2].rate
                }
                if (i < agileRatesInit.length - 3){
                    nextRates[2] = agileRatesInit[i+3].rate
                }
                if (i < agileRatesInit.length - 3){
                    nextRates[3] = agileRatesInit[i+3].rate
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
                <AgileRateChart data={agileRatesInit} minRates={[todaysMinRate, tmrsMinRate]}/>
            </div>
            <hr className="alert-dark my-3"></hr>
            <div className="ml-1 mt-3 row">
                {/* <div className='col-6'>
                    <h4 className="display-6">Min Today</h4>
                    <h5 className="lead">{typeof(todaysMinRate) === 'number' ? todaysMinRate.toFixed(3) : ''}p</h5>
                    <span style={{fontSize:"95%"}}>
                        at {todaysMin.map((val) => {return moment(val).format("HH:mm")}).join()}</span>
                </div> */}
                <div className='col-3'>
                    <h5>Next Rates</h5>
                </div>
                <div>
                    <h6 className="align-bottom">
                        {nextRates.map( (val) => {return `${val.toFixed(3)}p` + "\u2003\u2003"})}
                    </h6>
                </div>
            </div>
        </div>
        ) : (
        <div className="row justify-content-center mb-3">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Current Rate</h5>
                        <h3 className="font-weight-bold mb-3">{currentRate.toFixed(3)}p</h3>
                        <h5>since {currentValidFrom.format("HH:mm")}</h5>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-titl mb-3">Today's Lowest</h5>
                        <h3 className="font-weight-bold mb-3">{typeof(todaysMinRate) === 'number' ? todaysMinRate.toFixed(3) : ''}p</h3>
                        <h5>at {todaysMin.map((val) => {return moment(val).format("HH:mm")}).join()}</h5>
                    </div>
                </div>
            </div>
            { typeof(tmrsMinRate) === 'number' &&
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Tomorrow's Lowest</h5>
                        <h3 className="font-weight-bold mb-3">{typeof(tmrsMinRate) === 'number' ? tmrsMinRate.toFixed(3) : ''}
                            {typeof(tmrsMinRate) === 'number' && `p`}</h3>
                        {typeof(tmrsMinRate) === 'number' && <h5>at {tmrsMin.map((val) => {return moment(val).format("HH:mm")}).join()}</h5>}
                    </div>
                </div>
            </div>}
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

function AgileRateChart(props){
    
    const { data, minRates } = props
    
    //find the index of the data of current time
    var currentTimeIdx 

    // for (var ptObj of data){
    data.forEach( (ptObj, i) => {
        const startTime = moment(ptObj.valid_from)
        const endTime = moment(ptObj.valid_to)
        if (moment().isBetween(startTime, endTime)) {
            ptObj.color = "#ffffff"
            currentTimeIdx = i
        } else if (ptObj.rate > 34.9) {
            ptObj.color = "#ff0000"
        } else if (ptObj.rate > 30) {
            ptObj.color = "#ff7b00"
        } else if (ptObj.rate > 20) {
            ptObj.color = "#e09d00"
        } else if (ptObj.rate > 15) {
            ptObj.color = "#edea26"
        } else if ( minRates.includes(ptObj.rate)) {
            ptObj.color = "#00ff00"
        } else {
            ptObj.color = "#795ae090"
        }
    })

    const customLabel = (props) => {
        // console.log(props)
        const {
            x, y, width, height, value,
        } = props;
        const radius = 7;

        return (props.index === currentTimeIdx ?
            <g>
                <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle"
                        fontSize="small">
                    {props.value.toFixed(2)}
                </text>
            </g>
            : ""
        )

    }

    const chart = ( data ?
    <ResponsiveContainer width="100%" height={250} >
        <ComposedChart data={data} margin={{ left: -15, right: 15, top:18 }}>
            <CartesianGrid stroke="#aaaaaaaa"/>
            <XAxis dataKey="valid_from" tick={{fontSize:"small"}}
                    tickFormatter={ (tickObj) => {return moment(tickObj).format("HH:mm")}}/>
            <YAxis yAxisId="rate" orientation="left" type="number" tick={{fontSize:"small"}}
                    name="Rate" unit="p" //domain={[0, 35]} 
                    ticks={[0,5,10,15,20,25,30,35]}
                    interval="preserveStartEnd"/>
            <ReferenceLine y={35} yAxisId="rate" stroke="#f00" strokeWidth={1.25}/>
            <ReferenceLine y={0} yAxisId="rate" stroke="#8884d8" strokeWidth={1.25}/>
            <Bar yAxisId="rate" fill="#000000" name="Rate"
                    dataKey="rate" stroke="#8884d8">
                {
                data.map((entry, index) => (
                    <Cell key={`cell-${index}`} stroke={entry.color} />
                ))
                }
                <LabelList dataKey="rate" position="top" content={customLabel}/>
            </Bar>
            <ReferenceLine y={14.6} yAxisId="rate" stroke="#795ae09" strokeWidth={1}/>
            <Tooltip content={<CustomTooltip />}/>
        </ComposedChart >
    </ResponsiveContainer>
    : "");
    
    return chart
}


function CustomTooltip ({ active, payload, label }) {
    if (active && label && payload) {
        //checking whether each of the info is found
        // const avgCostValueObj = payload.find(e => e.dataKey ==='avgCost')
        // const mainValueObj = payload.find(e => (e.dataKey !== 'avgCost') && (e.dataKey !== 'rate'))
        const rateValueObj = payload.find(e => e.dataKey ==='rate')
        
        return (
        <div className="custom-tooltip">
            <p className="tooltip-x-value" style={{fontSize:"90%"}}>{`${moment(label).format("HH:mm")}`} </p>
            {/* { mainValueObj  && 
                <div className="tooltip-value-y">
                    <p>{`${chartPlotOptions[mainValueObj.dataKey].label}: `} 
                        {mainValueObj.value.toFixed(3)}{chartPlotOptions[mainValueObj.dataKey].unit}</p></div>}
            { avgCostValueObj &&
                <div className="tooltip-value-avgCost">
                    <p>{`${chartPlotOptions['avgCost'].label}: `}
                        {avgCostValueObj.value.toFixed(3)}{chartPlotOptions['avgCost'].unit}</p></div>} */}
            { rateValueObj &&
                <div className="tooltip-value-avgCost" style={{color:"#bbbbbb"}}>
                    <p>{rateValueObj.value.toFixed(3)}p</p></div>}
        </div>
        );
    } else {return ""}
}