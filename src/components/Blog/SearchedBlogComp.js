import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import firebase from '@firebase/app';
import defaultLogo from '../../assets/images/default.jpg';
import LocalStorage from '../../utils/LocalStorage';

export default class SearchedBlogComp extends Component{
	
	componentWillMount(){
		this.setState({
			username:""
		})

		this.userUID = LocalStorage.loadState("user");
		this.firestore = firebase.firestore();
		
		let ref = this.firestore.collection("Users").doc(this.props.blogUser);
		
		ref.get().then((snapshot)=>{
			this.setState({
				username:snapshot.data().userName
			})
		})
		
	}

	render(){


		return(
			<div className="well">

				<div className="row">
					<Link to={"/SearchedBlogPostList/" + this.props.blogUser + "/" + this.props.blogName + "/" + this.props.searchTerm}>
						<div className="col-sm-8 compTextStyle">
							<h3>{this.props.blogName}</h3>
							<p>{this.props.description}</p>
							<br />
							<p className="text-10"> {this.userUID === this.props.blogUser ? <span>Your blog</span> : <span>{this.state.username}</span>}</p> 
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