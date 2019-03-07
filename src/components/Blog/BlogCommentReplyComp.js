import React, {Component} from 'react';
import ProcessDaysAgo from '../../utils/ProcessDaysAgo';

export default class BlogCommentReplyComp extends Component{
	

	render(){

		return (
			<div className="row">
				<div className="col-xs-1">

				</div>
				
				<div className="col-xs-11">
					
					<div className="row">
						<div className="col-xs-2 text-10">
							{this.props.username}
						</div>
						<div className="col-xs-8">
							
							<ProcessDaysAgo date={this.props.time} />
						</div>
					</div>
					<div className="row">
						{this.props.text}
					</div>
					
					<hr />
				</div>
			</div>
			
		)
	}
} 