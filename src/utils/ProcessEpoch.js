import React, {Component} from 'react';


export default class ProcessEpoch extends Component{

	


	componentWillMount(){
		this.setState({
			date:this.props.date
		},()=>{
			this._processEpoch();
		})
		
		
	}
	
	
	_processEpoch(){
		
		
		let currentDate = new Date(this.state.date);
		
		
		let month = currentDate.getMonth();
		
		let monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
		this.month = monthArray[month];
		
		let day = currentDate.getDay();
		let dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		this.day = dayArray[day];

		let tempDate = currentDate.getDate();
		
		let dateArray = ["0","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st"]
		this.date = dateArray[tempDate]; 

		this.hours = currentDate.getHours();
		this.minutes = currentDate.getMinutes();
		
		this.setState({
			date:this.date,
			month:this.month,
			day:this.day
		})
	}

	render(){
		
		return(
			
			<div className="text-10"> {this.state.day} {this.state.date} {this.state.month}</div>
            
		)
	}
}