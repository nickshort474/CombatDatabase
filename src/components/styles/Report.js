import React, {Component} from 'react';
import {Link} from 'react-router-dom';


export default class Report extends Component{
	
	constructor(){
		super();

		this.state={
			items:[]
		}

	}

	componentWillMount(){
		window.scrollTo(0, 0);
						
	}

	
	render(){
		

		return(

			
				
			<div className="container">	
				<div className="content-wrapper">
					<div className="box">
						<Link to="/styles">&#60; Back</Link>
					</div>
					<div className="box">
						
						<h2>Report</h2>
						<div className="row">
							<div className="col-sm-12">
								<textarea />
							</div>
						</div>
						
					</div>
				</div>
			</div>
							

		)
	}
}