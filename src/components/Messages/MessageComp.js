import React, {Component} from 'react';

import ProcessEpoch from '../../utils/ProcessEpoch';


export default class MessageComp extends Component{
	

	render(){
		
		let comp;

		if(this.props.ownMsg){
			comp =  <div className="row text-right">
						<section className="col-xs-6">
							
						</section>
						<section className="well msgWell col-xs-6" style={{"backgroundColor":"#32CD32"}} >
							<div className="row msgCompStyle">
								<p>{this.props.contents}</p>
							</div>
							<div className="row">
								<small className="text-muted"><ProcessEpoch date={this.props.date} /></small>
							</div>
						</section>
					</div>
		}else{
			comp =  <div className="row text-left">
				
						<section className="well msgWell col-xs-6" style={{"backgroundColor":"#DEDEDE"}} >
							<div className="row msgCompStyle">
								<p>{this.props.contents}</p>
							</div>
							<div className="row">
								<small className="text-muted"><ProcessEpoch date={this.props.date} /></small>
							</div>
						</section>
						<section className="col-xs-6">
							
						</section>
					</div>
		}

		return(
			<div>
				{comp}
			</div>

		)
	}
}