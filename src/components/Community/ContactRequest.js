import React, {Component} from 'react';

import {firebase} from '@firebase/app';
import {_handleDisable,_handleEnable} from '../../utils/HandleDisable';

import LocalStorage from '../../utils/LocalStorage';


class ContactRequest extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			requestContent:""
		}

		
		this.userUID = LocalStorage.loadState("user");
		this.firestore = firebase.firestore();
	}

	_handleInput(e){
		this.setState({
			requestContent:e.target.value
		})
	}

	_handleSubmit(e){
		e.preventDefault()

		_handleDisable();

		if(this.state.requestContent.length > 1){
			let ref = this.firestore.collection("Users").doc(this.userUID);
			
			ref.get().then((snapshot)=>{
				this.userName = snapshot.data().userName;
			}).then(()=>{
				
				// send request to...
				let ref = this.firestore.collection("People").doc(this.props.match.params.PersonKey).collection("ContactRequests");
				
				let obj = {
					requestUserUID:this.userUID,
					requestUserName:this.userName,
					content:this.state.requestContent
				}
				console.log("obj created");
				ref.add(obj).then(()=>{
					console.log("added");
					this.props.history.push(`/PersonProfile/${this.props.match.params.PersonKey}`)
				})
			})
			
		}else{
			alert("please add a short request statement, who you are, why you want to make contact etc..")
			_handleEnable();
		}
		//get user's username for making request
		


		
		


	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<form onSubmit={this._handleSubmit.bind(this)}>
							<h4>Contact Request</h4>
							<textarea style={{"width":"100%"}} value={this.state.requestContent} onChange={this._handleInput.bind(this)} /><br /><br />
							<input className="btn btn-primary" type="submit" value="Make contact request" /> 
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default ContactRequest