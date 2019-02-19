import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
 

import store from '../../redux/store';
import constants from '../../redux/constants';


export default class Username extends Component{

	constructor(){
		super();

		this.storeState = store.getState();
		this.userName = this.storeState.userName;
		this.userUID = this.storeState.userUID;

		this.firestore = firebase.firestore();

		store.dispatch({type:constants.SAVE_PAGE, page:"Username"});

		this.state = {
			userName:this.userName
		}

	}

	_changeUsername(e){
		
		this.setState({
			userName:e.target.value
		})
	}



	_submitForm(){
		// check for matching usernames first
		let ref = this.firestore.collection('userUIDs');
		let query = ref.where("userName", "==", this.state.userName);
		
		let match = false;

		console.log(this.state.userName);

		query.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				if(snap){
					alert(snap.data().userName + " already exists please try another user name");
					match = true;
				}
			})
			
			
		}).then(()=>{
			if(!match){
				console.log("update")
				this.firestore.collection('userUIDs').doc(this.userUID).update({userName:this.state.userName});
				this.firestore.collection('People').doc(this.userUID).update({userName:this.state.userName});
				this.props.history.push("/Profile");
			}
		})
	}
		


	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Profile">&lt; Back to profile page</Link>
					</div>
					<div className="box text-center">		
						<h2>Change username</h2>
						<div className="row">
							<div className="col-sm-6">
								<label>Username:</label>
							</div>
							
							<input type="text" value={this.state.userName} onChange={this._changeUsername.bind(this)}/>
							
						</div>
						<div className="row text-center">
							<button className="btn-primary"  onClick={this._submitForm.bind(this)}>Update username</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}