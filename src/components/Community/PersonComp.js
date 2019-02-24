import React, {Component} from 'react';
import {Link} from 'react-router-dom';


export default class PersonComp extends Component{
	
	
	render(){
		
		return(
			<div>
				<section className="well">
					<div className="row">
						
						<Link to={`/Person/${this.props.uid}/${this.props.userName}`}>
							
							<div className="col-sm-4 text-left compTextStyle">
								<div className="row">
									
									<h2>{this.props.userName} </h2>
								</div>	
								<div className="row">									
									<p>{this.props.styles}</p>
								</div>	
																							
							</div>

							<div className="col-sm-4">
								<p>{this.props.bio}</p>
							</div>
							<div className="hidden-xs col-sm-4">
								<img src={this.props.img} className="img-thumbnail" alt="placeholder" width="150px" height="150px"/>
							</div>

						</Link>	
					</div>
				</section>
			</div>

		)
	}
}