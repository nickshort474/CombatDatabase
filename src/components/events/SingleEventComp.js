import React, {Component} from 'react';
import {Link} from 'react-router-dom';


import ProcessEpoch from '../../utils/ProcessEpoch';
import defaultLogo from '../../assets/images/default.jpg';

export default class SingleEventComp extends Component{
	


	render(){
		return(
			<div className="well">
				<div className="row">
					<Link to={"/SingleEvent/" + this.props.id}>
						

							<article className="post">
								

								<div className="col-sm-8 msgCompStyle">
									<h2>{this.props.name}</h2>
									<p>{this.props.description}</p>
									<p>{this.props.location}</p>

								</div>

								<div className="col-sm-4 text-center">
									<div className="row">
										<div className="col-sm-12">
											<img src={this.props.logo  ? this.props.logo : defaultLogo} className="imageFit"  alt="Event logo" /><br />
										</div>
										
										
									</div>
									<div className="row">
										<div className="col-sm-12  msgCompStyle">
											<ProcessEpoch date={this.props.date} />
										</div>
										
										
									</div>
									
								</div>

							</article>
						
					</Link>
				</div>
			</div>
		)
	}
}