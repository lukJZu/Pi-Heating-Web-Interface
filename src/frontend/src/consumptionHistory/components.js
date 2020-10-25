import React, {useEffect, useState, Component} from 'react'
import { ResponsiveContainer, Bar, Line, 
        CartesianGrid, XAxis, YAxis, ComposedChart, 
        Legend, Tooltip, ReferenceLine } from 'recharts';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import * as d3 from 'd3-array';

// import { DateRangePicker } from 'rsuite';

import { APILookup } from '../lookup'
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const chartPlotOptions = {
    'consumption': {"key":"consumption", 'label': 'Consumption', "unit":"kWh"},
    "cost": {"key":"cost", 'label': 'Cost', "unit":"p"},
    "rate": {"key":"rate", 'label': 'Rate', "unit":"p"}
}

const chartTypeOptions = {
    'avg': {'label': 'Average'},
    "actl": { 'label': 'Actual'}
}

const chartViewOptions = {
    "hour": {'label': 'Hourly', 'avgStringFormat': "HH:mm", 'actlStringFormat': "DD MMM HH:mm"},
    "day": {'label': 'Daily', "avgStringFormat": "dddd", 'actlStringFormat': "YYYY-MM-DD"},
    "week": {'label': 'Weekly', "avgStringFormat": "WW YYYY", 'actlStringFormat': "WW YYYY"},
    "month": {'label': 'Monthly', "avgStringFormat": "MMMM", 'actlStringFormat': "MMM YYYY"}
}


function ChartButtonGroup(props) {
    const {btnType, stateVar, onValueChange} = props
    
    var btnOptions
    if (btnType === 'type'){
        btnOptions = chartTypeOptions
    } else if (btnType === 'view'){
        btnOptions = chartViewOptions
    } else if (btnType === 'plot'){
        var options = {}
        for (var [key, value] of Object.entries(chartPlotOptions)){
            if (key !== 'rate'){
                options[key] = value
            }
        }
        btnOptions = options
    }

    const handleChange = (val, event) => {
        const source = event.target;
        //defocus the button
        source.blur()
        //callback to parent component as the state is changed
        onValueChange([btnType, val])
    };

    return (
      <ToggleButtonGroup type="radio" name="options" defaultValue={stateVar} onChange={handleChange}>
          {Object.keys(btnOptions).map((key)=>{
            return <ToggleButton value={key}>{btnOptions[key].label}</ToggleButton>})}
      </ToggleButtonGroup>
    );
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



export default class Consumption extends Component{

    constructor(props){
        super(props);
        //getting the locally stored date range
        var dateRange = localStorage.getItem('consumptionPage/dateRange')
        dateRange = dateRange ? dateRange.split(',').map(val=>moment(val, "L")) : [moment(), moment()]
        
        var chartPlot = localStorage.getItem('consumptionPage/chartPlot')
        this.state={
            useBlocks:[],
            dataPlot:[],
            dateRange: dateRange,
            chartBarPlot: chartPlot ? chartPlot : 'cost',
            datesLimit: [moment(), moment()]
        }
        //getting the locally stored chart type and view
        var chartView = localStorage.getItem('consumptionPage/chartView')
        this.chartView = chartView ? chartView : 'hour'
        var chartType = localStorage.getItem('consumptionPage/chartType')
        this.chartType = chartType ? chartType : 'avg'
        
        //set limits to disable the range on date picker
        this.datesLimit = [moment(), moment()]

        //create ref to the daterangepicker
        this.dateRangeElement = React.createRef();

        this.datesChanged = this.datesChanged.bind(this)
    }
    
    chartOptionChanged = (stateArr) => {
        //assigning selection to class variable
        if (stateArr[0] === 'type'){
            this.chartType = stateArr[1] 
            localStorage.setItem('consumptionPage/chartType', stateArr[1]);
            this.processAnyViewTypeChange()
        } else if (stateArr[0] === 'view'){
            this.chartView = stateArr[1]
            localStorage.setItem('consumptionPage/chartView', stateArr[1]);
            this.processAnyViewTypeChange()
        } else if (stateArr[0] === 'plot'){
            localStorage.setItem('consumptionPage/chartPlot', stateArr[1]);
            this.setState({chartBarPlot: stateArr[1]})
        }
    }

    prevNextClicked = (event) => {
        var dateRange = this.state.dateRange
        const btnID = event.target.id
        
        //add/subtract the hourly view by 1 day, same as daily view
        const addSubtractTime = this.chartView === 'hour' ? 'days' : this.chartView
        
        if (btnID === "prev-date-range"){
            //subtract both start and end date by 1 period
            var newDateRange = dateRange.map((date) => moment(date).subtract(1, addSubtractTime))
            //make sure new date range is not before date limit
            if (newDateRange[0].isBefore(this.state.datesLimit[0])){
                var newMaxDate = moment.min(moment(this.state.datesLimit[0]).add({[addSubtractTime]:1}), this.state.datesLimit[1])
                newDateRange = [this.state.datesLimit[0], newMaxDate]
            }
        } else {
            var newDateRange = dateRange.map((date) => moment(date).add(1, addSubtractTime))
            //make sure new date range is not after date limit
            if (newDateRange[1].isAfter(this.state.datesLimit[1])){
                var newMinDate = moment.max(moment(this.state.datesLimit[1]).subtract({[addSubtractTime]:1}), this.state.datesLimit[0])
                newDateRange = [newMinDate, this.state.datesLimit[1]]
            }
        }
        
        this.dateRangeElement.current.datesChanged(newDateRange)
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
        
        var data = xArray.map((time) => {return {x:time}})

        // console.time('someFunction')
        if (this.chartType === 'avg'){
            data = this.processAvgView(data)
        } else {
            data = this.processActlView(data)
        }

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
                this.setState({datesLimit: [moment.min(dates).set({'hour':0, 'minute':0, 'second':0, 'millisecond':0}).subtract(1, 'd'), 
                                            moment.max(dates).set({'hour':0, 'minute':0, 'second':0, 'millisecond':0}).add(1, 'd')]})
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
            <div className="row my-3 mx-4">
                <div className="col-6">
                    <Button className="btn btn-primary btn-arrow-left" id="prev-date-range"
                            onClick={this.prevNextClicked}>
                        Previous
                    </Button>
                </div>
                <div className="col-6" align="right">
                    <Button className="btn btn-primary btn-arrow-right" id="next-date-range"
                            onClick={this.prevNextClicked}>
                        Next
                    </Button>
                </div>
            </div>
            <div className="row mb-3">
                <LeccyUseChart data={this.state.dataPlot} 
                                barPlotOptions={chartPlotOptions[this.state.chartBarPlot]}/>
            </div>
            <div className="row justify-content-center my-3">
                <div className="col-lg-2 col-md-4 my-1" align="center">
                    <ChartButtonGroup btnType={'type'} stateVar={this.chartType} 
                                        onValueChange={this.chartOptionChanged}/>
                </div>
                <div className="col-lg-4 col-md-6 my-1" align="center">
                    <ChartButtonGroup btnType={'view'} stateVar={this.chartView} 
                                        onValueChange={this.chartOptionChanged}/>
                </div>
                <div className="col-lg-2 col-md-4 my-1" align="center">
                    <ChartButtonGroup btnType={'plot'} stateVar={this.state.chartBarPlot} 
                                        onValueChange={this.chartOptionChanged}/>
                </div>
                <div className="col-lg-4 col-md-8 my-1" align="center">
                    <CustomDateRangePicker ref={this.dateRangeElement} 
                                            datesLimit={this.state.datesLimit}
                                            dateRange={this.state.dateRange}
                                            datesChanged={this.datesChanged}/>
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

class CustomDateRangePicker extends Component {

    constructor(props){
        super(props);
        this.state = {
            dateRange: props.dateRange,
            preSelection: null
        }
    }

    //actions for when the dates are manually changed using the picker
    datesChanged = (range) =>{
        this.setState({dateRange:range, preSelection: null})
    }

    //actions for when the date range buttons were clicked
    buttonDateRangeClicked = (value) =>{
        var dateRange
        if (value === 'week'){
            //making sure the lower date is not before the dates limit
            dateRange = [moment.max(moment().subtract(8, 'd'), this.props.datesLimit[0]), 
                            moment().subtract(1, 'd')]
        } else if (value === 'month'){
            dateRange = [moment.max(moment().subtract({'months':1, 'days':1}), this.props.datesLimit[0]), 
                            moment().subtract(1, 'd')]
        } else if (value === 'all'){
            dateRange = this.props.datesLimit
        } 
        
        this.setState({dateRange: dateRange, preSelection: value})
    }

    //update the parent component if any dates change
    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.dateRange !== this.state.dateRange){
            this.props.datesChanged(this.state.dateRange)
        }
    }

    render(){ 
        return (
        <div className="row align-items-center">
            <div className="col-6" align="right">
                <ToggleButtonGroup type="radio" name="options" value={this.state.preSelection} 
                                    onChange={this.buttonDateRangeClicked}>
                <ToggleButton value={"all"}>All Time</ToggleButton>
                <ToggleButton value={"month"}>Past Month</ToggleButton>
                <ToggleButton value={"week"}>Past Week</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="col-6 " align="left">
            <RangePicker 
                size="large" 
                value={this.state.dateRange}
                onChange={this.datesChanged}
                disabledDate={(current) => {
                    return current && 
                        !current.isBetween(this.props.datesLimit[0], this.props.datesLimit[1], '[]')}}
            />
            </div>
        </div>)
    }
}

function LeccyUseChart(prop){
    
    const {data, barPlotOptions} = prop
    
    const chart = ( data ?
    <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="x" />
            <YAxis yAxisId="left" type="number" dataKey={barPlotOptions.key} 
                            name={barPlotOptions.label} unit={barPlotOptions.unit} />
            <YAxis yAxisId="rate" orientation="right" type="number" dataKey="rate" name="Rate" unit="p" />
            <ReferenceLine y={0} yAxisId="rate" stroke="#8884d8" strokeWidth={1.25}/>
            <Bar yAxisId="left" fill="#000000" dataKey={barPlotOptions.key} stroke="#8884d8" />
            <ReferenceLine y={0} yAxisId="left" stroke="white" strokeWidth={1.25}/>
            <Line yAxisId="rate" type="monotone" dataKey="rate" stroke="#8884d8" />
            <Legend />
            <Tooltip content={<CustomTooltip />}/>
        </ComposedChart >
    </ResponsiveContainer>
    : "");
    
    return chart
}

//custom tooltip content
function CustomTooltip ({ active, payload, label }) {
    if (active && label && payload) {
        return (
        <div className="custom-tooltip">
            <p className="tooltip-value-x">{`${label}`} </p>
            { payload.some(e => e.dataKey !== 'rate')  && 
                <div className="tooltip-value-y1"><p>
                {`${chartPlotOptions[payload.find(e => e.dataKey !=='rate').dataKey].label}: `} 
                {payload.find(e => e.dataKey !=='rate').value.toFixed(3)}{chartPlotOptions[payload.find(e => e.dataKey !=='rate').dataKey].unit}</p></div>}
            { payload.some(e => e.dataKey === 'rate') &&
                <div className="tooltip-value-y2"><p>
                {`${chartPlotOptions['rate'].label}: `}
                {payload.find(e => e.dataKey ==='rate').value.toFixed(3)}{chartPlotOptions['rate'].unit}</p></div>}
        </div>
        );
    } else {return ""}
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
    <div className="row justify-content-center">
        <div className="col-12">
            <div className="card">
                <div className="card-body">
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