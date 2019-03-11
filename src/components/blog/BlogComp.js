import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import defaultLogo from '../../assets/images/default.jpg';
import LocalStorage from '../../utils/LocalStorage';

export default class BlogComp extends Component{
	
	componentWillMount(){
		this.userUID = LocalStorage.loadState("user");
		
		
	}

	render(){


		return(
			<div className="well">

				<div className="row">
					<Link to={"/BlogPostList/" + this.props.blogUser + "/" + this.props.blogName}>
						<div className="col-sm-8 compTextStyle">
							<h2>{this.props.blogName}</h2>
							<p>{this.props.description}</p>
							{this.userUID === this.props.blogUser ? <h4>Your blog</h4> : null}
						</div>
						<div className="col-sm-4">
							<img src={this.props.logo ? this.props.logo : defaultLogo} className="thumbnail" alt="Blog logo" width="100%" />
						</div>
						
					</Link>
				</div>

			</div>

		)
	}
}