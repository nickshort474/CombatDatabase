import React, {Component} from 'react';
import {firebase} from '@firebase/app';

import {_handleDisable} from '../../utils/HandleDisable';

import store from '../../redux/store';

export default class FriendRequest extends Component{
	
	constructor(){
		super();
		this.state = {
			requestContent:""
		}

		let storeState = store.getState()
		this.userUID = storeState.userUID;
		this.userName = storeState.userName;
	}

	_handleInput(e){
		this.setState({
			requestContent:e.target.value
		})
	}

	_handleSubmit(e){
		_handleDisable();

		let firestore = firebase.firestore();
		// send request to...
		let ref = firestore.collection("People").doc(this.props.match.params.UserKey).collection("friendRequests");
		console.log("about to make obj");
		let obj = {
			requestUserUID:this.userUID,
			requestUserName:this.userName,
			content:this.state.requestContent
		}
		console.log("obj created");
		ref.add(obj).then(()=>{
			console.log("added");
			this.props.history.push(`/User/${this.props.match.params.UserKey}`)
		})


	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<form onSubmit={this._handleSubmit.bind(this)}>
							<h4>Friend Request</h4>
							<input type="text" value={this.state.requestContent} onChange={this._handleInput.bind(this)} />
							<input type="submit" value="Make Friend request" /> 
						</form>
					</div>
				</div>
			</div>
		)
	}
}