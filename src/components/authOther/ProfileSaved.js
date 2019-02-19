import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import '@firebase/firestore'; 

import store from '../../redux/store';
import constants from '../../redux/constants';

import Geosuggest from 'react-geosuggest';

import defaultLogo from '../../assets/images/default.jpg'


const google = window.google;

export default class Profile extends Component{


	constructor(props){
		super(props);
		
		store.dispatch({type:constants.SAVE_PAGE, page:"Profile"});

		this.state = {
			firstName:" ",
			lastName:" ",
			userName:" ",
			age:" ",
			styles:" ",
			clubs:" ",
			bio:" ",
			newUser:true,
			userNameChange:false,
			userNameConst:" ",
			status:"Student",
			contact:"No-one ",
			generalLoc:" ",
			lat:" ",
			lng:" ",
			profilePicChange:false
		}
		
		
		
	}
	
	componentWillMount(){
		window.scrollTo(0, 0);
		
	
	}

	componentDidMount(){


		var storeState = store.getState();
		this.user = storeState.userUID;

	    if (this.user) {

	    	// User is signed in.
	    	// check for profileCreated prop in UserNames db section
			let firestore = firebase.firestore();

			let ref = firestore.collection('userUIDs').doc(this.user);

			ref.get().then((snapshot)=>{
				
				
				if(snapshot.data().profileCreated){
	    			
	    			let userRef = firestore.collection("People").doc(snapshot.data().userUID);	

	    			userRef.get().then((snapshot2) => {
	    				
						this.setState({
							firstName:snapshot2.data().firstName,
							lastName:snapshot2.data().lastName,
							userName:snapshot2.data().userName,
							userNameConst:snapshot2.data().userName,
							age:snapshot2.data().age,
							styles:snapshot2.data().styles,
							clubs:snapshot2.data().clubs,
							bio:snapshot2.data().bio,
							address:snapshot2.data().address,
							contact:snapshot2.data().contact,
							profilePicUrl:snapshot2.data().profilePic,
							newUser:false


						});
					
	    			})
	    		}else{
	    			//no profile info to load - prompt user to add info?
	    			alert("no profile data, please add inforamtion to your account!")
	    		}
			});

	    	
	    }else{
	    	// No user is signed in. prompt to sign in.
	    	alert("Please sign in to see your profile")
	    }	
	}


	_changeFirstName(e){
		this.setState({
			firstName:e.target.value
		})
	}

	_changeLastName(e){
		this.setState({
			lastName:e.target.value
		})
	}

	_changeUser(e){
		this.setState({
			userName:e.target.value,
			userNameChange:true
		})
	}

	_changeClubs(e){
		this.setState({
			clubs:e.target.value
		})
	}

	_changeStyles(e){
		this.setState({
			styles:e.target.value
		})
	}

	_changeAge(e){
		this.setState({
			age:e.target.value
		})
		console.log(e.target.value);
	}

	_changeBio(e){
		this.setState({
			bio:e.target.value
		})
	}

	_changeContact(e){
		this.setState({
			contact:e.target.value
		})
	}



	_submitForm(e){
		e.preventDefault();

		let firestore = firebase.firestore();

		var storeState = store.getState();
		let user = storeState.userUID;

		
		if(user) {
		    // User is signed in.
		    
		    if(this.state.newUser){
		    	
		    	// new user
		    	this._checkForMatchingUserNames(this.state.userName, (match) => {
		    		
		    		if(match !== false){
		    			//alert user name taken
		    			
		    			alert("Username already taken please try another");
		    		}else{
			    		
			    		//create profile
						let profileRef = firestore.collection('People').doc(this.user);


						let img = this.state.profilePic;
			    		let docRef = profileRef.doc();

			    		this._addImageToStorage(docRef, img, (url)=>{
			    			
			    			let userObj = {

			    				firstName:this.state.firstName,
								lastName:this.state.lastName,
								userName:this.state.userName,
								clubs:this.state.clubs,
								styles:this.state.styles,
								bio:this.state.bio,
								age:this.state.age,
								contact:this.state.contact,
								uid:this.user,
								profilePic:url,
								generalLoc:this.state.generalLoc,
								lat:this.state.lat,
								lng:this.state.lng
						
		    				}
		    				docRef.set(userObj);
							let userUIDRef = firestore.collection("userUIDs").doc(user);
		    			
		    			
			    			userUIDRef.update({
			    				profileCreated:true,
			    				userName:this.state.userName
			    			})
			    		})
			    	}
			    })
		    }else{
		    	// is existing user
		    	// check for username match
		    	
		    	this._checkForMatchingUserNames(this.state.userName, (match) => {

			    	if(match !== false){
			    		// there is a match
			    		// check if is existing user changing their username
			    		if(match === user){
			    			// user updating their username

			    			// check if exitsing user is updating username
			    			if(this.state.userNameChange){
				    			// if yes update complete profile with new path and userUIDs section 
				    			
				    			//remove old profile
				    			let oldProfileRef = firestore.collection("People").doc(this.state.userNameConst);
				    			oldProfileRef.delete();

				    			//add new profile
				    			let profileRef = firestore.collection("People").doc(this.state.userName);
				    			
			    				
			    				let img = this.state.profilePic;
			    				let docRef = profileRef.doc();

			    				this._addImageToStorage(docRef, img, (url)=>{
			    					
			    					let userObj = {
					    				firstName:this.state.firstName,
										lastName:this.state.lastName,
										userName:this.state.userName,
										clubs:this.state.clubs,
										styles:this.state.styles,
										bio:this.state.bio,
										age:this.state.age,
										contact:this.state.contact,
										uid:this.user,
										profilePic:url,
										generalLoc:this.state.generalLoc,
										lat:this.state.lat,
										lng:this.state.lng

					    			}
					    			docRef.set(userObj);
					    			//update info in userUID section
					    			let userUIDRef = firestore.collection("userUIDs").doc(user);
					    			//let userUIDRef = firebase.database().ref("userUIDs/" + userUid);
					    			userUIDRef.update({
					    				userName:this.state.userName
					    			})
			    				})
			    			}else{

			    				let profileRef = firestore.collection("People").doc(this.state.userName);
			    				
			    				let img = this.state.profilePic;
			    				

			    				this._addImageToStorage(profileRef.id, img, (url)=>{
			    					
			    					profileRef.update({
				    					firstName:this.state.firstName,
										lastName:this.state.lastName,
										userName:this.state.userName,
										clubs:this.state.clubs,
										styles:this.state.styles,
										bio:this.state.bio,
										age:this.state.age,
										contact:this.state.contact,
										uid:this.user,
										profilePic:url,
										generalLoc:this.state.generalLoc,
										lat:this.state.lat,
										lng:this.state.lng
				    				})
			    				})

			    				
			    			}
			    		}else{
			    			// user trying to update username to already taken
			    			alert("Username taken please try another");
			    		}
			    	}else{
			    		
			    		// no username match detected
			    		// delete existing profile and create new one, update all other sections
			    		let oldProfileRef = firestore.collection("People").doc(this.state.userNameConst);
			    		
		    			oldProfileRef.delete();

		    			//add new profile
		    			let profileRef = firestore.collection("People").doc(this.user);
		    				    				
		    			let img = this.state.profilePic;
			    		

			    		this._addImageToStorage(profileRef.id, img, (url)=>{


			    			profileRef.set({
			    				firstName:this.state.firstName,
								lastName:this.state.lastName,
								userName:this.state.userName,
								clubs:this.state.clubs,
								styles:this.state.styles,
								bio:this.state.bio,
								age:this.state.age,
								contact:this.state.contact,
								uid:this.user,
								profilePic:url,
								generalLoc:this.state.generalLoc,
								lat:this.state.lat,
								lng:this.state.lng

		    				})
							//update info in userUID section
			    			let userUIDRef = firestore.collection("userUIDs").doc(this.user);
			    			
			    			userUIDRef.update({
			    				userName:this.state.userName
			    			})

			    		})
			   		}
			   	})
			}
		}else{
		    // No user is signed in.
		    alert("please sign in");
		}
		this.setState({
			profilePicChange:false
		})
	}

	_checkForMatchingUserNames(userName, callback){
		
		//Check for existing username
		let firestore = firebase.firestore();
		let ref = firestore.collection('People');

		ref.where("userName", "==", userName);

		let returnState;

		ref.get().then((snapshot)=>{
			if(snapshot.exists){
	    		//username already in database
	    		returnState = snapshot.data().uid;
	    	}else{
	    		//username not in database
	    		returnState = false
	    	}
	    	callback(returnState);
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
				profilePicChange:true
			})

		}

		reader.readAsDataURL(e.target.files[0]);
	}

	


	_addImageToStorage(imgRef,img,callback){
		
		
		let storageRef = firebase.storage().ref();

		// upload img to storage
		let profileImageFileLocation = `profile_pics/${imgRef}.jpg`;
		let uploadTask = storageRef.child(profileImageFileLocation).putString(img,'data_url');

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

	_onSuggestSelect(suggest) {
		
		if(suggest){
			this.setState({
				generalLoc:suggest.gmaps.formatted_address,
				lat:suggest.location.lat,
				lng:suggest.location.lng
			});
		
		}
    	
  	}

	render(){
		return(
			<div>
				<div className="container">
					<div className="content-wrapper">
						<div className="row">
							<div className="col-sm-3">
								<div className="box">
									<p>Instructions go here</p>
								</div>
							</div>
							<div className="col-sm-9">
								<div className="box">
									
									<h3>Profile page:</h3>


									<form action="">
										<div className="row">
											<div className="col-sm-6">
												<label>First Name:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="firstName" value={this.state.firstName} onChange={this._changeFirstName.bind(this)} />
											</div>

										</div>
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>Last Name:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="lastName" value={this.state.lastName} onChange={this._changeLastName.bind(this)} />
											</div>

										</div>
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>User Name:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="userName" value={this.state.userName} onChange={this._changeUser.bind(this)}  required/><span><sup><b>*</b></sup></span>
											</div>

										</div>


										<div className="row">
											<div className="col-sm-6">
												<label>Profile Picture</label>
											</div>
											<div className="col-sm-6">
												
												<input type="file" id="browse" name="fileupload" style={{display:"none"}} onChange={this._handleProfilePic.bind(this)} />
												<input type="button" value="Add Profile Pic" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} />
												<img src={this.state.profilePic ? this.state.profilePic : defaultLogo} width='50%' height='50%' id="profilePic"  alt="" />
											</div>
										</div>


										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>Age range:</label>
											</div>
											<div className="col-sm-6">
												<select name="ageRange" value={this.state.age} onChange={this._changeAge.bind(this)} >
													<option>Under 18</option>
													<option>18 - 30</option>
													<option>30+</option>
													<option>Other</option>
												</select>
											</div>

										</div>
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>Affiliated Clubs:</label>
											</div>
											<div className="col-sm-6">
												<select name="clubs" value={this.state.clubs} onChange={this._changeClubs.bind(this)} >
													<option>This one</option>
													<option>That one</option>
													<option>None</option>
												</select>
											</div>

										</div>
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>Styles:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="styles" value={this.state.styles} onChange={this._changeStyles.bind(this)} />
											</div>

										</div>
										
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label htmlFor="bio">Bio:</label>
											</div>
											<div className="col-sm-6">
												<textarea id="bio" name="bio" value={this.state.bio} onChange={this._changeBio.bind(this)} ></textarea>
											</div>

										</div>
										<br />
										<hr />
										<div className="row">
											<div className="col-sm-6">
												<label>Your Business:</label>
											</div>
											<div className="col-sm-4">
												<input type="text" name="club" value={this.state.club} />
												
											</div>
											<div className="col-sm-2">
												 <p>As {this.state.status}</p>
											</div>
										</div>
										<hr />


										<div className="row">
											<div className="col-sm-6">
												<label>Contactable by:</label>
											</div>
											<div className="col-sm-4">
												<select name="contact" value={this.state.contact} onChange={this._changeContact.bind(this)} >
													<option value="No-one">No one</option>
													<option value="Friends">Friends</option>
													<option value="Everyone">Everyone</option>
												</select>
											</div>
										</div>
										<hr />
										
				                        <div className="row">
											<div className="col-sm-6">
												<label><p title="By providing this data others can make contact for challenges, es, or social elements">Your General Location</p></label>
											</div>
											<div className="col-sm-4">
												 <Geosuggest
										          ref={el=>this._geoSuggest=el}
										          placeholder="Search for your address"
										          onSuggestSelect={this._onSuggestSelect.bind(this)}
										          location={new google.maps.LatLng(53.558572, 9.9278215)}
										          radius="20" 
										        />
											</div>
										</div>


				                        <hr />
										<input type="submit" value="Update profile" onClick={this._submitForm.bind(this)}/>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}