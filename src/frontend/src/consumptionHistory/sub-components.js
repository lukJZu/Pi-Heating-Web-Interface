import React, { Component } from 'react'
import { ResponsiveContainer, Bar, Line, 
        CartesianGrid, XAxis, YAxis, ComposedChart, 
        Legend, Tooltip, ReferenceLine } from 'recharts';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import moment from 'moment';

import { chartPlotOptions, chartTypeOptions, chartViewOptions} from './index'

import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;


export function ChartButtonGroup(props) {
    const {btnType, stateVar, onValueChange} = props
    
    var btnOptions
    if (btnType === 'type'){
        btnOptions = chartTypeOptions
    } else if (btnType === 'view'){
        btnOptions = chartViewOptions
    } else if (btnType === 'plot'){
        var options = {}
        for (var [key, value] of Object.entries(chartPlotOptions)){
            if (key !== 'rate' && key !== 'avgCost'){
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
      <ToggleButtonGroup type="radio" name="options" size='lg'
                            defaultValue={stateVar} onChange={handleChange}>
          {Object.keys(btnOptions).map((key, idx)=>{
            return <ToggleButton value={key} key={`${idx}`}>{btnOptions[key].label}</ToggleButton>})}
      </ToggleButtonGroup>
    );
}
  

//combining both the daterangepicker and pre-set buttons
export class CustomDateRangePicker extends Component {

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
        if (value === 'day'){
            dateRange = [moment().subtract(1, 'd').set({'hour':0, 'minute':0, 'second':0, 'millisecond':0}), 
                            moment().subtract(1, 'd').set({'hour':0, 'minute':0, 'second':0, 'millisecond':0})]
        } else if (value === 'week'){
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
                <ToggleButtonGroup type="radio" name="options" //size='sm'
                                    value={this.state.preSelection} 
                                    onChange={this.buttonDateRangeClicked}>
                    <ToggleButton value={"all"}>All<br></br>Time</ToggleButton>
                    <ToggleButton value={"month"}>Past<br></br>Month</ToggleButton>
                    <ToggleButton value={"week"}>Past<br></br>Week</ToggleButton>
                    <ToggleButton value={"day"}>Past<br></br>Day</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="col-6 " align="left">
            <RangePicker 
                size="large"
                allowClear={false}
                inputReadOnly={true}
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

export function LeccyUseChart(prop){
    
    const {data, barPlotOptions, chartView } = prop
    
    const chart = ( data ?
    <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={data}>
            <CartesianGrid stroke="#aaaaaaaa"/>
            <XAxis dataKey="x" />
            <YAxis yAxisId="left" type="number" dataKey={barPlotOptions.key} 
                    name={barPlotOptions.label} unit={barPlotOptions.unit} />
            <YAxis yAxisId="rate" orientation="right" type="number" 
                    name="Rate" unit="p" />
            <ReferenceLine y={0} yAxisId="rate" stroke="#8884d8" strokeWidth={1.25}/>
            <ReferenceLine y={14.6} yAxisId="rate" stroke="#795ae090" strokeWidth={1}>
                {/* <Label value="Normal Rate" position="right" fill="#e05a7750"/> */}
            </ReferenceLine> 
            <Bar yAxisId="left" fill="#000000" name={barPlotOptions.label} 
                    dataKey={barPlotOptions.key} stroke="#8884d8" />
            <ReferenceLine y={0} yAxisId="left" stroke="white" strokeWidth={1}/>
            <Line yAxisId="rate" type="monotone" name="Rate" dot={false}
                    dataKey="rate" stroke="#555555" legendType="none" />
            <Line yAxisId="rate" type="monotone" 
                    name="Average Unit Cost" dataKey="avgCost" stroke="#8884d8" />
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
        //checking whether each of the info is found
        const avgCostValueObj = payload.find(e => e.dataKey ==='avgCost')
        const mainValueObj = payload.find(e => (e.dataKey !== 'avgCost') && (e.dataKey !== 'rate'))
        const rateValueObj = payload.find(e => e.dataKey ==='rate')
        
        return (
        <div className="custom-tooltip">
            <p className="tooltip-x-value">{`${label}`} </p>
            { mainValueObj  && 
                <div className="tooltip-value-y">
                    <p>{`${chartPlotOptions[mainValueObj.dataKey].label}: `} 
                        {mainValueObj.value.toFixed(3)}{chartPlotOptions[mainValueObj.dataKey].unit}</p></div>}
            { avgCostValueObj &&
                <div className="tooltip-value-avgCost">
                    <p>{`${chartPlotOptions['avgCost'].label}: `}
                        {avgCostValueObj.value.toFixed(3)}{chartPlotOptions['avgCost'].unit}</p></div>}
            { rateValueObj &&
                <div className="tooltip-value-rate">
                    <p>{`${chartPlotOptions['rate'].label}: `}
                        {rateValueObj.value.toFixed(3)}{chartPlotOptions['rate'].unit}</p></div>}
        </div>
        );
    } else {return ""}
}

function LeccyUseRow(props){
    const { dataPlot, chartView } = props
    //setting the display of the cost depending on the chart view type
    //show in £ for week and month view
    var costCellString = ""
    
    if ( dataPlot.consumption != null ){
        costCellString = chartView === "hour" || chartView === "day" 
                        ? `${dataPlot.cost.toFixed(2)}p`
                        : `£${(dataPlot.cost/100).toFixed(2)}`
    }
    
    return ( dataPlot.rate !== undefined && dataPlot.rate !== null ? (<tr>
              <td>{dataPlot.x}</td>
              <td>{`${dataPlot.rate.toFixed(3)}p`}</td>
              <td>{dataPlot.consumption != null && dataPlot.consumption.toFixed(3)}</td>
              <td>{costCellString}</td>
              <td>{dataPlot.consumption != null && `${dataPlot.avgCost.toFixed(3)}p`}</td>
            </tr>) : "" )
}


export function LeccyUseTable(props){
    const { dataPlots, chartType, chartView } = props
    
    //setting the table headers depending on the chart view and type
    var rateHeader = 'Rate', unitHeader = 'Used (kWh)'
    var costHeader = 'Cost'
    if (chartType === 'avg' && chartView !== 'hour') {
        rateHeader = 'Mean Daily Rate'
        unitHeader = 'Mean Daily Use (kWh)'
        costHeader = 'Mean Daily Cost'
    } else if (chartType === 'avg' && chartView === 'hour'){
        rateHeader = 'Mean Block Rate'
        unitHeader = 'Mean Use (kWh)'
        costHeader = 'Mean Cost'
    } else if (chartType === 'actl' && chartView !== 'hour'){
        rateHeader = 'Mean Block Rate'
    }

    //calculating the total
    var totalUse = 0, totalCost = 0
    for (var dataPlot of dataPlots){
        totalUse += dataPlot.consumption ? dataPlot.consumption : 0
        totalCost += dataPlot.cost ? dataPlot.cost : 0
    }
    var totalRow = (
        <tr className="table-secondary font-weight-bold" style={{fontSize:"135%"}}>
            <td className="text-center" colSpan={2}>Sum of all time periods</td>
            <td>Total Use: {totalUse.toFixed(3)}kWh</td>
            <td>Total Cost: £{(totalCost/100).toFixed(2)}</td>
            <td>Average Unit Cost: {(totalCost/totalUse).toFixed(3)}p</td>
        </tr>
    )

    return ( dataPlots ?
    <div className="row justify-content-center">
        <div className="col-12">
            <div className="card">
                <div className="card-body table-responsive-sm">
                <table className="table table-striped" 
                        style={{"width":"100%", tableLayout:'fixed'}}>
                    <tbody>
                        {totalRow}
                        <tr className="table-secondary font-weight-bold" style={{fontSize:"110%"}}>
                            <th>Period</th>
                            <th>{rateHeader}</th>
                            <th>{unitHeader}</th>
                            <th>{costHeader}</th>
                            <th>Average Unit Cost (per kWh)</th>
                        </tr>
                        {dataPlots.map((dataPlot, index)=>{
                            return <LeccyUseRow dataPlot={dataPlot}
                                                chartView={chartView}
                                                key={`${index}`}/>
                            })
                        }
                    </tbody>
                </table> 
                </div>
            </div>
        </div>
    </div> : ""
    )
  }