import React, {useEffect, useState, Component, Tooltip } from 'react'
import { ResponsiveContainer, BarChart, Bar, Line, CartesianGrid, XAxis, YAxis, ComposedChart, Legend } from 'recharts';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import moment from 'moment';
import * as d3 from 'd3-array';

// import { DateRangePicker } from 'rsuite';

import { APILookup } from '../lookup'
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;


const chartTypeOptions = {
    'avg': {'value': 'avg', 'label': 'Average'},
    "actl": {'value': 'actl', 'label': 'Actual'}
}

const chartViewOptions = {
    "hour": {'label': 'Hourly', 'avgStringFormat': "HH:mm", 'actlStringFormat': "DD MMM HH:mm"},
    "day": {'label': 'Daily', "avgStringFormat": "dddd", 'actlStringFormat': "YYYY-MM-DD"},
    "week": {'label': 'Weekly', "avgStringFormat": "WW YYYY", 'actlStringFormat': "WW YYYY"},
    "month": {'label': 'Monthly', "avgStringFormat": "MMMM", 'actlStringFormat': "MMM YYYY"},
    // "dates": {'label': 'Dates', "datetimeStringFormat": "LL"}
}


function ChartButtonGroup(props) {
    const {btnType, stateVar, onValueChange} = props
    
    var btnOptions
    if (btnType === 'type'){
        btnOptions = chartTypeOptions
    } else if (btnType === 'view'){
        btnOptions = chartViewOptions
    }

    const handleChange = (val, event) => {
        const source = event.target;
        //defocus the button
        source.blur()
        //callback to parent component as the state is changed
        onValueChange([btnType, val])
    };

    return (
      <ToggleButtonGroup size="lg" type="radio" name="options" defaultValue={stateVar} onChange={handleChange}>
          {Object.keys(btnOptions).map((key)=>{
            return <ToggleButton value={key}>{btnOptions[key].label}</ToggleButton>})}
      </ToggleButtonGroup>
    );
  }


function getAvgDayTimeArray(){
    var hours = []
    //generate the array of 30min block
    for (let hour = 0; hour < 24; hour++) {
        hours.push(moment({ hour }).format(chartViewOptions['hour']['avgStringFormat']));
        hours.push(moment({
                hour,
                minute: 30
            }).format(chartViewOptions['hour']['avgStringFormat'])
        );
    }
    return hours
}

function getActlDateRangeArray(startEndArray, viewRange){
    var times = []
    //generate the array of day block
    var endDate = moment(startEndArray[1]).endOf(viewRange)
    for (let time = moment(startEndArray[0]); time.isBefore(endDate); time.add(1, viewRange)) {
        times.push(time.format(chartViewOptions[viewRange]['actlStringFormat']));
    }
    return times
}

// function getWeeklyDateRangeArray(startEndArray){
//     var times = []
//     var endDate = moment(startEndArray[1]).endOf('week')
//     //generate the array of month blocks
//     for (let time = moment(startEndArray[0]).start; time.isBefore(endDate); time.add(1, 'week')) {
//         times.push(time.format(chartViewOptions['week']['actlStringFormat']));
//     }
//     return times
// }

// function getMonthlyDateRangeArray(startEndArray){
//     var times = []
//     var endDate = moment(startEndArray[1]).endOf('month')
//     //generate the array of month blocks
//     for (let time = moment(startEndArray[0]); time.isBefore(endDate); time.add(1, 'month')) {
//         times.push(time.format(chartViewOptions['month']['actlStringFormat']));
//     }
//     return times
// }


export default class Consumption extends Component{

    constructor(props){
        super(props);
        //getting the locally stored date range
        var dateRange = localStorage.getItem('consumptionPage/dateRange')
        dateRange = dateRange ? dateRange.split(',').map(val=>moment(val, "L")) : [moment(), moment()]
        this.state={
            useBlocks:[],
            dataPlot:[],
            dateRange: dateRange
        }
        //getting the locally stored chart type and view
        var chartView = localStorage.getItem('consumptionPage/chartView')
        this.chartView = chartView ? chartView : 'hour'
        var chartType = localStorage.getItem('consumptionPage/chartType')
        this.chartType = chartType ? chartType : 'avg'
        this.datesLimit = [moment(), moment()]

        this.datesChanged = this.datesChanged.bind(this)
    }
    
    chartOptionChanged = (stateArr) => {
        //assigning selection to class variable
        if (stateArr[0] === 'type'){
            this.chartType = stateArr[1] 
            localStorage.setItem('consumptionPage/chartType', stateArr[1]);
            // this.processAnyViewTypeChange()
        } else if (stateArr[0] === 'view'){
            this.chartView = stateArr[1]
            localStorage.setItem('consumptionPage/chartView', stateArr[1]);
        }
        this.processAnyViewTypeChange()
    }

    datesChanged = (value) => {
        if (value){
            // this.dateRange = value
            localStorage.setItem('consumptionPage/dateRange', 
                        value.map((val) => val.format("L")).join(','))
            this.setState({dateRange:value}, this.processAnyViewTypeChange)
        }
    }

    processAnyViewTypeChange(){
        const chartView = this.chartView
        //getting the array of time to plot
        var xArray = []
        if (this.chartType === 'avg'){
            if (chartView === 'day'){
                xArray = moment.weekdays()
            } else if (chartView === 'week'){
                xArray = getActlDateRangeArray(this.state.dateRange, chartView)
            } else if (chartView === 'month'){
                xArray = moment.months()
            }
        } else {
            if (chartView !== 'hour'){
                xArray = getActlDateRangeArray(this.state.dateRange, chartView)
            }
        }
        // console.log("xARRAY", xArray)
        var data = xArray.map((time) => {return {x:time}})

        // console.time('someFunction')
        if (this.chartType === 'avg'){
            data = this.processAvgView(data)
        } else {
            data = this.processActlView(data)
        }

        // console.log(data)

        // console.timeEnd('someFunction')
        //assigning the data back to plot
        this.setState({dataPlot:data})
    }

    processAvgView(data){
        if (this.chartView === 'hour'){
            //forming the array of time with 30min block
            var hours = []
            //generate the array of 30min block
            for (let hour = 0; hour < 24; hour++) {
                hours.push(moment({ hour }).format(chartViewOptions['hour']['avgStringFormat']));
                hours.push(moment({ hour, minute: 30}).format(chartViewOptions['hour']['avgStringFormat']));
            }
            //group them into half hour block
            var grouped3 = d3.group(this.state.useBlocks, d => d.time.format(
                            chartViewOptions[this.chartView]['avgStringFormat']))
            
            data = hours.map((blockTime) => {
                var groupedArr = grouped3.get(blockTime)
                return { x:blockTime, 
                    rate: d3.mean(groupedArr, v => v.rate),
                    consumption: d3.mean(groupedArr, val => val.consumption),
                    cost: d3.mean(groupedArr, val => val.rate*val.consumption)
                }
            })
        }
        else if (this.chartView === 'day' || 'week' || 'month'){
            //group the useblocks into dates
            var grouped = d3.groups(this.state.useBlocks, d => d.time.format("LL"))
            //turn the grouped array into sum of each day
            grouped = grouped.map(
                (val) => { 
                    return {
                        'x': val[0], 
                        //for rate, take the mean of each day
                        'rate': d3.mean(val[1], v => v.rate),
                        'use': d3.sum(val[1], v => v.consumption),
                        'cost': d3.sum(val[1], v => v.consumption * v.rate),
                        //store the count for the day so in the next step whether to calc mean or not
                        'count': d3.count(val[1], d => d.consumption)
                    }
                } 
            )
            
            var dateFormat = chartViewOptions[this.chartView]['avgStringFormat']
            for (var dataBlock of data){
                //filtering the dates which match the day of week/day in month
                var filteredDates = d3.filter(grouped, obj => moment(obj.x, "LL").format(dateFormat) === dataBlock.x)
                //storing different names for week view
                if (this.chartView === 'week'){
                    dataBlock.x = `${moment(dataBlock.x, dateFormat).startOf('week').format("DD")
                                    }-${moment(dataBlock.x, dateFormat).endOf('week').format("DD MMM YYYY")}`
                }
                //only return a value if that day has more than 45 blocks of consumption defined
                dataBlock.rate = d3.mean(filteredDates, val => val.count > 45 ? val.rate: null)
                dataBlock.consumption = d3.mean(filteredDates, val => val.count > 45 ? val.use: null)
                dataBlock.cost = d3.mean(filteredDates, val => val.count > 45 ? val.cost: null)
            }
        }

        return data
    }

    processActlView(data){
        if (this.chartView === 'hour'){
            //getting the range of dates to filter
            var startTime = moment(this.state.dateRange[0])
            var endTime = moment(this.state.dateRange[1]).add(1, 'd')
            //set a 10 day limit to the view
            var dateLimit = moment(startTime).add(11, 'd')
            var filteredBlocks = d3.filter(this.state.useBlocks, 
                            (val) => val.time.isBetween(
                                startTime, endTime, 'minute', "[)") && val.time.isBefore(dateLimit))
            //turning the useBlocks into array of dicts for plotting
            data = filteredBlocks.map((obj) => {return {x:obj.time.format("DD MMM HH:mm"),
                                                        rate: obj.rate,
                                                        consumption: obj.consumption,
                                                        cost: obj.rate*obj.consumption}
                                            })
            data.reverse()
        }
        else if (this.chartView === 'day' || 'week' || 'month'){
            const dateFormat = chartViewOptions[this.chartView]['actlStringFormat']
            //group the useblocks into dates
            var grouped = d3.groups(this.state.useBlocks, d => d.time.format(dateFormat))
            console.log(grouped)
            //turn the grouped array into sum of each day
            grouped = grouped.map(
                (val) => { 
                    return {
                        'x': val[0], 
                        //for rate, take the mean of each day
                        'rate': d3.mean(val[1], v => v.rate),
                        'use': d3.sum(val[1], v => v.consumption),
                        'cost': d3.sum(val[1], v => v.consumption * v.rate)
                    }
                } 
            )
            
            for (var dataBlock of data){
                //filtering the dates which match the day of week/day in month
                var filteredDates = d3.filter(grouped, obj => obj.x === dataBlock.x)
                //storing different names for week view
                if (this.chartView === 'week'){
                    dataBlock.x = `${moment(dataBlock.x, dateFormat).startOf('week').format("DD")
                                    }-${moment(dataBlock.x, dateFormat).endOf('week').format("DD MMM YYYY")}`
                }
                dataBlock.rate = d3.mean(filteredDates, val => val.rate)
                dataBlock.consumption = d3.sum(filteredDates, val => val.use)
                dataBlock.cost = d3.sum(filteredDates, val => val.cost)
            }
        }
        
        return data
    }


    componentDidMount(){
        //callback for when the use history has been loaded
        const myCallback = (response, status) =>{
            if (status === 200) {
                var leccyUse = response.leccyUse
                leccyUse = leccyUse.map((val) => {return {"time":moment(val.interval_start), 
                                "rate":val.rate, "consumption":val.consumption}})
                this.setState({useBlocks:leccyUse}, 
                                this.processAnyViewTypeChange)
                //calculating the max and min date
                var dates = leccyUse.map((val) => {return val.time})
                this.datesLimit = [moment.min(dates).subtract(1, 'd'), moment.max(dates)]
          } else {
              alert("There was an error")
          }
        }
        //api call to retrieve the history
        APILookup('GET', `consumptionHistory`, myCallback)
    }
    

    render(){
        
        return ( this.state.useBlocks ?
        (<div>
            <div>
                <LeccyUseChart data={this.state.dataPlot} />
            </div>
            <div className="row justify-content-center my-3">
                <div className="col-lg-3 my-1" align="center">
                    <ChartButtonGroup btnType={'type'} stateVar={this.chartType} 
                                        onValueChange={this.chartOptionChanged}/>
                </div>
                <div className="col-lg-5 my-1" align="center">
                    <ChartButtonGroup btnType={'view'} stateVar={this.chartView} 
                                        onValueChange={this.chartOptionChanged}/>
                </div>
                <div className="col-lg-4 my-1" align="center">
                    <RangePicker size="large" 
                                    defaultValue={this.state.dateRange}
                                    onChange={this.datesChanged}
                                    disabledDate={(current) => {
                                        return current && !current.isBetween(this.datesLimit[0], this.datesLimit[1])}}/>
                </div>
            </div>
            <LeccyUseTable dataPlots={this.state.dataPlot}/>
        </div>) :(
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>)
        )
    }

}

function LeccyUseChart(prop){
    // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
    const {data} = prop
    // console.log(data)
    const chart = ( data ?
    <ResponsiveContainer width="100%" height={500}>
    <ComposedChart data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" />
        <YAxis yAxisId="left" type="number" dataKey="consumption" name="Use" unit="kWh" />
        <YAxis yAxisId="right" orientation="right" type="number" dataKey="rate" name="Rate" unit="p" />
        <Bar yAxisId="left" type="monotone" dataKey="consumption" stroke="#8884d8" />
        <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#8884d8" />
        <Legend />
        <Tooltip />
    </ComposedChart >
    </ResponsiveContainer>
    : "");
    
    return chart
}

function LeccyUseRow(props){
    const {dataPlot} = props
    
    return ( dataPlot.rate ? (<tr>
              <td>{dataPlot.x}</td>
              {/* <td>{endTime.toLocaleDateString('en-gb', dateOptions)} {endTime.toLocaleTimeString('en-gb', timeOptions)}</td> */}
              <td>{dataPlot.rate && `${dataPlot.rate.toFixed(3)}p`}</td>
              <td>{dataPlot.consumption && dataPlot.consumption.toFixed(3)}</td>
              <td>{dataPlot.cost !== 0 && `${(dataPlot.consumption * dataPlot.rate).toFixed(2)}p`}</td>
            </tr>) : "" )
}


function LeccyUseTable(props){
    const { dataPlots } = props
    
    return ( dataPlots ?
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                <table className="table table-striped" style={{"width":"100%"}}>
                    <thead className="thead-dark">
                        <tr>
                            <th>Time</th>
                            <th>Rate</th>
                            <th>Units Used (kWh)</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                    {dataPlots.map((dataPlot, index)=>{
                        return <LeccyUseRow dataPlot={dataPlot} key={`${index}`}/>
                    })}
                    </tbody>
                </table> 
                </div>
            </div>
        </div>
    </div> : ""
    )
  }