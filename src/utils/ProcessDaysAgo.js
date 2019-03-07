import React, {Component} from 'react';


export default class ProcessDaysAgo extends Component{

	


	componentWillMount(){
		this.setState({
			date:this.props.date,
			timeToShow:0
		},()=>{
			this._processDays();
		})
		
		
	}
	
	
	_processDays(){
		
		
		let currentDate =this.state.date;
		let now = Date.now();
		let millisecondsDifference = now - currentDate;
		
		
		this.hourDifference = Math.round(millisecondsDifference / 3600000)

		if(this.hourDifference >= 24){
			let hours = Math.round(this.hourDifference / 24);
			this.timeToShow = `${hours} days ago`;
		}else if(this.hourDifference === 0){
			this.timeToShow = "just now"
		}else{
			this.timeToShow = `${this.hourDifference} hours ago`;
		}
		
		this.setState({
			timeToShow:this.timeToShow
		})
		

		
	}

	render(){
		
		return(
			
			<span className="text-10">{this.state.timeToShow} </span>
            
		)
	}
}