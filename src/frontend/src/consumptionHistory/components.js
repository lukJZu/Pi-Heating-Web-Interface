import React, {useEffect, useState, Component, Tooltip } from 'react'
import { ResponsiveContainer, BarChart , Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { APILookup } from '../lookup'


function LeccyUseRow(props){
    const {useBlock} = props
    const startTime = new Date(useBlock.interval_start)
    const endTime = new Date(useBlock.interval_start)
    endTime.setMinutes( startTime.getMinutes() + 30 );

    let dateOptions = {'day':'numeric', 'month': 'short'}
    let timeOptions = {'hour':'numeric', 'minute': 'numeric'}

    return <tr>
              <td>{startTime.toLocaleDateString('en-gb', dateOptions)} {startTime.toLocaleTimeString('en-gb', timeOptions)}</td>
              <td>{endTime.toLocaleDateString('en-gb', dateOptions)} {endTime.toLocaleTimeString('en-gb', timeOptions)}</td>
              <td>{useBlock.rate.toFixed(3)}p</td>
              <td>{useBlock.consumption}</td>
              <td>{(useBlock.consumption * useBlock.rate).toFixed(2)}p</td>
            </tr>
}

export default class Consumption extends Component{

    constructor(props){
        super(props);
        this.state={
            useBlocks:[]
        }    
    }
    
    ToggleButtonGroupControlled() {
        // const [value, setValue] = useState([1, 3]);
        const value = 1
        /*
         * The second argument that will be passed to
         * `handleChange` from `ToggleButtonGroup`
         * is the SyntheticEvent object, but we are
         * not using it in this example so we will omit it.
         */
        const handleChange = (val) => {console.log(val)};
      
        return (
          <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={handleChange}>
            <ToggleButton value={1}>Average</ToggleButton>
            <ToggleButton value={2}>Sum</ToggleButton>
          </ToggleButtonGroup>
        );
      }
    

    componentDidMount(){
        //callback for when the use history has been loaded
        const myCallback = (response, status) =>{
          if (status === 200) {
              this.setState({useBlocks:response.leccyUse})
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
                <LeccyUseChart useBlocks={this.state.useBlocks} />
            </div>
            <div className="my-3">
                {this.ToggleButtonGroupControlled()}
            </div>
            <LeccyUseTable useBlocks={this.state.useBlocks}/>
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
    const {useBlocks} = prop

    const chart = (
    <ResponsiveContainer width="100%" height={500}>
    <BarChart data={useBlocks}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="interval_start" />
        <YAxis />
        <Tooltip />
        <Bar type="monotone" dataKey="consumption" stroke="#8884d8" />
    </BarChart >
    </ResponsiveContainer>
    );
    
    return chart
}

function LeccyUseTable(prop){
    const {useBlocks} = prop
    // const [leccyUseBlocks, setLeccyUseBlocks] = useState(useBlocks)

    return ( useBlocks &&
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                <table className="table table-striped" style={{"width":"100%"}}>
                    <thead className="thead-dark">
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Rate</th>
                            <th>Units Used (kWh)</th>
                            <th>Cost (p)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {useBlocks.map((useBlock, index)=>{
                        return <LeccyUseRow useBlock={useBlock} key={`${index}`}/>
                    })}
                    </tbody>
                </table> 
                </div>
            </div>
        </div>
    </div>
    )
  }