import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
 

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';


export default class Username extends Component{

	constructor(){
		super();

		this.state = {
			userName:""
		}
		this.userUID = LocalStorage.loadState("user");
		this.firestore = firebase.firestore();

		store.dispatch({type:constants.SAVE_PAGE, page:"Username"});

		

	}

	componentWillMount(){
		
		//get existing username
		let ref = this.firestore.collection('Users').doc(this.userUID);
		ref.get().then((snapshot)=>{
			
			let username = snapshot.data().userName;

			this.setState({
				userName:username,
				oldUsername:username
			})
		})
	}

	_changeUsername(e){
		
		this.setState({
			userName:e.target.value
		})
	}



	/*_submitForm(){
		// check for matching usernames first
		let ref = this.firestore.collection('Users');
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

				let ref = this.firestore.collection('People').doc(this.userUID);
				ref.get().then((snapshot)=>{
					
					if(snapshot.exists){
						console.log("exists");
						ref.update({userName:this.state.userName});
						this.firestore.collection('Users').doc(this.userUID).update({userName:this.state.userName, profileCreated:true});
						
						//this._updateUsernameSection();
						//username section for SearchForPeople (autosuggest box)
						console.log("trying to update username section")
						//delete doc of old username 
						this.firestore.collection('Usernames').doc(this.state.oldUsername).delete();
						console.log("nothing to delete!")
						//add new doc with new username
						this.firestore.collection('Usernames').doc(this.state.userName).set({uid:this.userUID});

					}else{
						ref.set({userName:this.state.userName})
						this.firestore.collection('Users').doc(this.userUID).update({userName:this.state.userName, profileCreated:true});
						//this._updateUsernameSection();
						//username section for SearchForPeople (autosuggest box)
						console.log("trying to update username section")
						//delete doc of old username 
						//this.firestore.collection('Usernames').doc(this.state.oldUsername).delete();
						console.log("nothing to delete!")
						//add new doc with new username
						this.firestore.collection('Usernames').doc(this.state.userName).add({uid:this.userUID});

					}
					this.props.history.push("/Profile");
				})

						
				
			}
		})
	}*/

	_submitForm(){

		// check for matching usernames first
		let ref = this.firestore.collection('Usernames').doc(this.state.userName);
		let match = false;

		

		ref.get().then((snapshot)=>{
			
			if(snapshot.exists){
				alert(this.state.userName + " already exists please try another user name");
				match = true;
			}else{
				match = false;
			}
			
		}).then(()=>{
			if(!match){
				
				this.firestore.collection('Users').doc(this.userUID).update({userName:this.state.userName});
				//delete doc of old username 
				this.firestore.collection('Usernames').doc(this.state.oldUsername).delete();
				//add new doc with new username
				this.firestore.collection('Usernames').doc(this.state.userName).set({uid:this.userUID});

				//update username in People section
				this.firestore.collection("People").doc(this.userUID).update({userName:this.state.userName})

				//redirect
				this.props.history.push("/Profile");

				
			}
		})
	}	


	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Profile">&lt; Back</Link>
					</div>
					<div className="box text-center">		
						<h2>Change username</h2><br />
						<div className="row">
							
							<label>Username:</label>
							<input type="text" value={this.state.userName} onChange={this._changeUsername.bind(this)}/>
							
						</div><br />
						<div className="row text-center">
							<button className="btn btn-primary"  onClick={this._submitForm.bind(this)}>Update username</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}