import React, {Component} from 'react';
import {Link} from 'react-router-dom';


export default class PersonComp extends Component{
	
	
	render(){
		
		return(
			<div className="row">
				<section style={{"marginLeft":"15px"}} className="well col-xs-7 text-center">
					
						
						<Link to={`/PersonProfile/${this.props.uid}/${this.props.userName}`}>
							<div className="text-left compTextStyle">
								
								<h2>{this.props.userName} </h2>
								
																										
							</div>
						</Link>	
						
												
					
				</section>

				<section style={{"marginRight":"15px"}} className="col-xs-4">
					{this.props.haveReplied ? <p>Your have mail!</p> : null}

					<Link to={`/Messages/${this.props.userName}/${this.props.uid}`}>
						<p className="btn btn-primary">
							See messages
						</p>

					</Link>
						
				</section>

			</div>

		)
	}
}