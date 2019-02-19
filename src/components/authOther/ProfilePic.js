import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
 
import {_handleDisable} from '../../utils/HandleDisable';

import store from '../../redux/store';
import constants from '../../redux/constants';
import defaultLogo from '../../assets/images/default.jpg';

export default class ProfilePic extends Component{

	constructor(props){
		super(props);
		
		this.firestore = firebase.firestore();

		let pageRef = `ProfilePic/${this.props.match.params.UserRef}`;

		store.dispatch({type:constants.SAVE_PAGE, page:pageRef});

		this.state = {
			addedPic:false
		}
		
		let userRef = this.firestore.collection("People").doc(this.props.match.params.UserRef);	
		
		userRef.get().then((snapshot)=>{
			
			this.setState({
				profilePicUrl:snapshot.data().profilePicUrl
			})
		})

	}


	_handleBrowseClick(){
	   
	    var fileinput = document.getElementById("browse");
	    fileinput.click();
	}


	
	_handleProfilePic(e){
		
		let reader = new FileReader();
		
		reader.onload = (e) => {
		
			document.getElementById('profilePic').src = e.target.result;
			
			this.setState({
				profilePic:e.target.result,
				addedPic:true
			})

		}

		reader.readAsDataURL(e.target.files[0]);
	}


	_addImageToStorage(callback){
		
		if(this.state.addedPic){
			
			let storageRef = firebase.storage().ref();

			// upload img to storage
			let profileImageFileLocation = `profile_pics/${this.props.match.params.UserRef}.jpg`;
			let uploadTask = storageRef.child(profileImageFileLocation).putString(this.state.profilePic,'data_url');

			// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', (snapshot)=>{
				    // Observe state change es such as progress, pause, and resume
				    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				    this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				    console.log('Upload is ' + this.progress + '% done');
				    switch (snapshot.state) {

				    	case firebase.storage.TaskState.PAUSED: // or 'paused'
				        	console.log('Upload is paused');
				        	break;

				    		case firebase.storage.TaskState.RUNNING: // or 'running'
				        	console.log('Upload is running');
				       	 break;
				       	 default:
				       	 	console.log("defaulting");

				    }

				}, (error)=> {
				    // Handle unsuccessful uploads
				    console.log(error);
				}, () => {
				    // Handle successful uploads on complete
				    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
				    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
						callback(downloadURL);
				    });
				})
			}
		
		
	}


	_submitForm(){

		_handleDisable();
		//add image to storage
		this._addImageToStorage((downloadURL)=>{
			//add reference to image to People section in firestore
			console.log(downloadURL);
			
			let profileRef = this.firestore.collection("People").doc(this.props.match.params.UserRef);
			profileRef.update({profilePicUrl:downloadURL});
			this.props.history.push("/Profile");
		})
		
	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Profile">&lt; Back to profile page</Link>
					</div>
						
					<div className="box">		
						<h1>Add profile pic</h1>
						<div className="row">
							<div className="col-sm-6">
								<label>Profile Picture</label>
							</div>

							

							<div className="col-sm-6">
								
								<input type="file" id="browse" name="fileupload" style={{display:"none"}} onChange={this._handleProfilePic.bind(this)} />
								<input type="button" value="Add Profile Pic" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} />

								<img src={this.state.profilePicUrl ? this.state.profilePicUrl : defaultLogo} width='50%' height='50%' id="profilePic"  alt="" />
							</div>

						</div>
						<div className="row">
							<input type="submit" value="Update profile pic" onClick={this._submitForm.bind(this)}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}