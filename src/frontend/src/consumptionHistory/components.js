import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import * as d3 from 'd3-array';

import { APILookup } from '../lookup'
import { LeccyUseChart, LeccyUseTable, 
            ChartButtonGroup, CustomDateRangePicker } from './sub-components'
import { chartPlotOptions, chartTypeOptions, chartViewOptions } from './index'


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
        var chartType = localStorage.getItem('consumptionPage/chartType')
        var chartView = localStorage.getItem('consumptionPage/chartView')
        var chartPlot = localStorage.getItem('consumptionPage/chartPlot')

        this.state={
            useBlocks:[],
            dataPlot:[],
            //converting from string back to array of moments
            dateRange: dateRange 
                        ? dateRange.split(',').map(val=>moment(val, "L")) 
                        : [moment(), moment()],
            chartBarPlot: chartPlot ? chartPlot : 'cost',
            datesLimit: [moment(), moment()]
        }
        //getting the locally stored chart type and view
        this.chartView = chartView ? chartView : 'hour'
        this.chartType = chartType ? chartType : 'avg'

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
        var newDateRange
        const btnID = event.target.id
        
        //add/subtract the hourly view by 1 day, same as daily view
        const addSubtractTime = this.chartView === 'hour' ? 'days' : this.chartView
        
        if (btnID === "prev-date-range"){
            //subtract both start and end date by 1 period
            newDateRange = dateRange.map((date) => moment(date).subtract(1, addSubtractTime))
            //make sure new date range is not before date limit
            if (newDateRange[0].isBefore(this.state.datesLimit[0])){
                newDateRange = dateRange
            }
        } else {
            newDateRange = dateRange.map((date) => moment(date).add(1, addSubtractTime))
            //make sure new date range is not after date limit
            if (newDateRange[1].isAfter(this.state.datesLimit[1])){
                newDateRange = dateRange
            }
        }
        
        this.dateRangeElement.current.datesChanged(newDateRange)
    }

    //for when the dates in date range picker is changed, manually or using pre-set buttons
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

        if (this.chartType === 'avg'){
            data = this.processAvgView(data)
        } else {
            data = this.processActlView(data)
        }

        //calculating the average cost per unit
        for (var dataPoint of data){
            dataPoint.avgCost = dataPoint.consumption >= 0 ? dataPoint.cost/dataPoint.consumption : null
        }

        //assigning the data back to plot
        this.setState({dataPlot:data})
    }

    processAvgView(data){
        var filteredDateRange
        if (this.chartView === 'hour'){
            //filter useBlocks to be within selected date range
            filteredDateRange = d3.filter(this.state.useBlocks,
                    (useBlock) => useBlock.time.isSameOrAfter(this.state.dateRange[0]) &&
                                  useBlock.time.isBefore(this.state.dateRange[1].endOf('day')))

            //forming the array of time with 30min block
            var hours = []
            //generate the array of 30min block
            for (let hour = 0; hour < 24; hour++) {
                hours.push(moment({ hour }).format(chartViewOptions['hour']['avgStringFormat']));
                hours.push(moment({ hour, minute: 30}).format(chartViewOptions['hour']['avgStringFormat']));
            }

            //group them into half hour block
            var grouped3 = d3.group(filteredDateRange, d => d.time.format(
                            chartViewOptions[this.chartView]['avgStringFormat']))
                            
            data = hours.map((blockTime) => {
                var groupedArr = grouped3.get(blockTime)
                if (!groupedArr){return {x:blockTime, rate:null, consumption:null, cost:null}}
                return { x:blockTime, 
                    rate: d3.mean(groupedArr, v => v.rate),
                    consumption: d3.mean(groupedArr, val => val.consumption),
                    cost: d3.mean(groupedArr, val => val.rate*val.consumption)
                }
            })
        }
        else { //for this.chartView === day/week/month 
            //filter useBlocks to be within selected date range
            filteredDateRange = d3.filter(this.state.useBlocks,
                    (useBlock) => useBlock.time.isSameOrAfter(this.state.dateRange[0]) &&
                                  useBlock.time.isBefore(this.state.dateRange[1].endOf(this.chartView)))

            //group the useblocks into dates
            var grouped = d3.groups(filteredDateRange, d => d.time.format("L"))
            //turn the grouped array into sum of each day
            grouped = grouped.map(
                (val) => { 
                    return {
                        'x': val[0], 
                        //for rate, take the mean of each day
                        'rate': d3.mean(val[1], v => v.rate),
                        'use': d3.sum(val[1], v => v.consumption),
                        'cost': d3.sum(val[1], v => v.consumption >= 0 ? v.consumption * v.rate : null),
                        //store the count for the day so in the next step whether to calc mean or not
                        'count': d3.count(val[1], d => d.consumption)
                    }
                } 
            )
            
            var dateFormat = chartViewOptions[this.chartView]['avgStringFormat']
            for (var dataBlock of data){
                //filtering the dates which match the day of week/day in month
                var filteredDates = d3.filter(grouped, obj => moment(obj.x, "L").format(dateFormat) === dataBlock.x)
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
            var endTime = moment(this.state.dateRange[1]).set({'hour':0, 'minutes':0, 'seconds':0}).add(1, 'd')
            //set a 10 day limit to the view
            var dateLimit = moment(startTime).add(11, 'd')
            var filteredBlocks = d3.filter(this.state.useBlocks, 
                            (val) => val.time.isBetween(
                                startTime, endTime, 'minute', "[)") && val.time.isBefore(dateLimit))
            //turning the useBlocks into array of dicts for plotting
            data = filteredBlocks.map((obj) => {
                return {x:obj.time.format("DD MMM HH:mm"),
                        rate: obj.rate,
                        consumption: obj.consumption,
                        cost: obj.consumption >= 0 ? obj.rate*obj.consumption: null}
                })
            data.reverse()
        }
        else { //for this.chartView === day/week/month 
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
                        'cost': d3.sum(val[1], v => v.consumption >= 0 ? v.consumption * v.rate : null)
                    }
                } 
            )
            
            for (var dataBlock of data){
                //filtering the dates which match the day of week/day in month
                var filteredDates = d3.filter(grouped, obj => obj.x === dataBlock.x)
                //storing different names for week view
                if (this.chartView === 'week'){
                    //use locale week format (week starts on user chosen day)
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

    //callback for when the use history has been loaded
    componentDidMount(){
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
                                            moment.max(dates).set({'hour':0, 'minute':0, 'second':0, 'millisecond':0})]})
          } else {
              alert("There was an error")
          }
        }
        //api call to retrieve the history
        APILookup('GET', `consumptionHistory`, myCallback)
    }
    
    render(){
        //form the chart title
        if (this.state.dataPlot.length > 0){
            var chartTitle = `${chartTypeOptions[this.chartType].label} Usage `
            const dateFormat = 'DD MMM YYYY'
            if (this.state.dateRange[0].format("L") === this.state.dateRange[1].format("L")){
                chartTitle += `on ${this.state.dateRange[0].format(dateFormat)}`
            } else {
                if (this.chartType === 'actl' && this.chartView === 'hour'){
                    var endDateString = moment(this.state.dataPlot[this.state.dataPlot.length - 1].x, 
                        chartViewOptions['hour']['actlStringFormat']).format(dateFormat)
                    chartTitle += 
                            `from ${this.state.dateRange[0].format(dateFormat)} to 
                                ${endDateString}`
                } else {
                    chartTitle += 
                            `from ${this.state.dateRange[0].format(dateFormat)} to 
                                ${this.state.dateRange[1].format(dateFormat)}`
                }
            }
        }

        return ( this.state.dataPlot.length > 0 ?
        (<div>
            <div className="row my-3 mx-4">
                <div className="col-2">
                    <Button className="btn btn-primary btn-arrow-left" id="prev-date-range"
                            onClick={this.prevNextClicked}>
                        Previous</Button>
                </div>
                <div className="col-8 text-center" align='center'>
                    <h4 className="font-weight-bold">{chartTitle}</h4>
                </div>
                <div className="col-2" align="right">
                    <Button className="btn btn-primary btn-arrow-right" id="next-date-range"
                            onClick={this.prevNextClicked}>
                        Next</Button>
                </div>
            </div>
            <div className="row mb-3">
                <LeccyUseChart data={this.state.dataPlot}
                                barPlotOptions={chartPlotOptions[this.state.chartBarPlot]}
                                chartView={this.chartView}/>
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
            <LeccyUseTable dataPlots={this.state.dataPlot} 
                            chartType={this.chartType}
                            chartView={this.chartView}/>
        </div>) :(
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>)
        )
    }
}