import React, {Component} from 'react';
import {Link} from 'react-router-dom';


export default class PersonComp extends Component{
	
	
	render(){
		
		return(
			<div className="row text-center">
				<section className="well col-xs-8">
					
						
						<Link to={`/PersonProfile/${this.props.uid}/${this.props.userName}`}>
							<div className="text-left compTextStyle">
								
								<h2>{this.props.userName} </h2>
								
																										
							</div>
						</Link>	
						
												
					
				</section>
				<section className="col-xs-4">
					
					<Link to={`/Messages/${this.props.userName}/${this.props.uid}`}><button className="btn-primary">See messages {this.props.userName}</button></Link>
						
				</section>
			</div>

		)
	}
}