import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Switch from "react-switch";
import moment from 'moment';

import { APILookup } from '../lookup'
import { DatePicker } from 'antd';
// import "../react-datepicker.css"
const { RangePicker } = DatePicker;


export class ScheduleCard extends Component{

    constructor(props){
        super(props);
        this.state = {
            schedule: [],
            editMode: false,
        }
        this.editScheduleRowsEl = []
        this.editButtonClicked = this.editButtonClicked.bind(this)
        this.finishButtonClicked = this.finishButtonClicked.bind(this)
        this.setEditRowRefs = this.setEditRowRefs.bind(this)
        this.addScheduleClicked = this.addScheduleClicked.bind(this)
    }

    editButtonClicked(event){
        //when edit button is clicked
        //create empty array to store the ref of each row
        this.editScheduleRowsEl = []
        //turn on edit mode in state
        this.setState({editMode:!this.state.editMode})
    }

    finishButtonClicked(event){
        //actions for when finish button of edit mode is clicked
        //form empty array to store the dict of each schedule
        var schedule = []
        
        //iterate over each schedule row and verify on off state
        for (var editScheduleRow of this.editScheduleRowsEl){
            const hotWaterState = editScheduleRow.state.hotWaterState
            const heatingState = editScheduleRow.state.heatingState
            //skip over the schedule which has both states turned off
            if (!hotWaterState && !heatingState){
                continue
            }
            //create the schedule object and store the data
            var scheduleObj = {
                start_time: editScheduleRow.state.timeRange[0].utc().format("YYYY-MM-DD HH:mm:ssZ"),
                end_time: editScheduleRow.state.timeRange[1].utc().format("YYYY-MM-DD HH:mm:ssZ"),
                hot_water_state: hotWaterState,
                heating_state: heatingState
            }
            //add the obj to the list
            schedule.push(scheduleObj)
        }
        //push the entire schedule to back-end
        APILookup('POST', 'schedule/set', this.getScheduleCallback, schedule)
        //turn edit mode off
        this.setState({editMode:false})
    }

    setEditRowRefs(ref){
        this.editScheduleRowsEl.push(ref)
    }

    addScheduleClicked(event){
        //creating a new schedule object starting at today's 12am
        const newScheduleObj = {start_time: moment().startOf('day'),
                                end_time: moment().startOf('day'),
                                hot_water_state: false,
                                heating_state: false
                            }
        this.setState({schedule: this.state.schedule.concat([newScheduleObj])})
    }

    getScheduleCallback = (response, status) =>{
        if (status === 200 || status === 201) {
            this.setState({schedule:response})
        } else {
            alert("Error in retrieving schedule")
        }
    }

    componentDidMount(){
        APILookup('GET', 'schedule', this.getScheduleCallback)
    }

    render(){
        return (
            <div className="card-body">
                <h4 className="card-title mb-3">
                    Schedule
                </h4>
                <div>
                    <table className="table table-striped" style={{width:"100%"}}>
                        <thead className="thead-dark">
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Hot Water</th>
                            <th>Heating</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.editMode 
                                ? this.state.schedule.map((schedule, index)=>{
                                    return <ScheduleEditRow schedule={schedule} 
                                                            ref={this.setEditRowRefs}
                                                            key={index}/>})
                                : this.state.schedule.map((schedule, index)=>{
                                    return <ScheduleRow schedule={schedule} key={index}/>})}
                        </tbody>
                    </table> 
                    {this.state.editMode && 
                        <Button className="mb-4"
                                variant="info" onClick={this.addScheduleClicked} block>Add Schedule</Button>}
                </div>{ this.state.editMode 
                    ? <Button className="float-right" onClick={this.finishButtonClicked}>Finish</Button>
                    : <Button className="float-right" onClick={this.editButtonClicked}>Edit</Button>
                }
            </div>
        )
    }
}


function ScheduleRow(props){
    const {schedule} = props

    const startTime = moment(schedule.start_time)
    const endTime = moment(schedule.end_time)
    return ( 
        <tr className={moment().isBetween(startTime, endTime)
            ? "table-danger"
            :""}>
            <td>{startTime.format("ddd Do HH:mm")}</td>
            <td>{endTime.format("ddd Do HH:mm")}</td>
            <td>{schedule.hot_water_state?"ON":"OFF"}</td>
            <td>{schedule.heating_state?"ON":"OFF"}</td>
        </tr>
    )
}

class ScheduleEditRow extends Component{
    constructor(props){
        super(props);
        const schedule = props.schedule
        this.state = {
            timeRange: [moment(schedule.start_time), moment(schedule.end_time)],
            hotWaterState: schedule.hot_water_state,
            heatingState: schedule.heating_state
        }
        this.stateChanged = this.stateChanged.bind(this)
    }

    stateChanged(checked, event, id){
        //change the state depending on the type
        if (id.includes("heating")) {
            this.setState({heatingState: checked})
        } else {
            this.setState({hotWaterState: checked})
        }
    }

    disabledDate(date){
        return date && !date.isBetween(moment().startOf('date'), moment().add(1, 'days').endOf('date'), 'day', "[]")
    }

    render(){
        return (
            <tr>
                <td style={{alignContent:"center"}} colSpan="2">
                    <RangePicker value={this.state.timeRange} 
                                disabledDate={this.disabledDate}
                                format="D/M HH:mm:ss"
                                showTime={true}
                                onChange={(time) => {this.setState({timeRange: time})}}
                                    />
                </td>
                <td>
                    <Switch className="react-switch"
                            id="hot-water-state-checkbox"
                            checked={this.state.hotWaterState} 
                            onChange={this.stateChanged}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#3498DB"/>
                </td>
                <td>
                    <Switch className="react-switch"
                            id="heating-state-checkbox"
                            checked={this.state.heatingState} 
                            onChange={this.stateChanged}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#3498DB"/>
                </td>
            </tr>
        )
    }
}