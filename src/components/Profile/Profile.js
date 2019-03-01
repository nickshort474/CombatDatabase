import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import '@firebase/firestore'; 

import store from '../../redux/store';
import constants from '../../redux/constants';

import Geosuggest from 'react-geosuggest';

import defaultLogo from '../../assets/images/default.jpg'
import PasswordChange from '../PasswordChange/PasswordChangeForm';

import LocalStorage from '../../utils/LocalStorage';

const google = window.google;



export default class Profile extends Component{


	constructor(props){
		super(props);
		
		store.dispatch({type:constants.SAVE_PAGE, page:"Profile"});

		this.state = {
			firstName:"",
			lastName:"",
			userName:"",
			age:"",
			styles:"",
			bio:"",
			generalLoc:"",
			lat:"",
			lng:"",
			
		}
		
		
		this.userUID = LocalStorage.loadState("user");
		this.firestore = firebase.firestore()



		if(this.userUID){
			
			this.signedIn = true
		}else{
			console.log("redirect");
			this.signedIn = false
			this.props.history.push('/Signin')
		}
		
	}
	
	componentWillMount(){
		window.scrollTo(0, 0);
		
	
	}

	componentDidMount(){

		//Check if user is signed in.
	    if (this.userUID) {
	    	
	    	// connect to userUIDs db section
			let ref = this.firestore.collection('Users').doc(this.userUID);

			//get snapshot
			ref.get().then((snapshot)=>{
				
				
				
				// check for profileCreated in userUIDs db section
				if(snapshot.data().profileCreated === true){
	    			console.log(snapshot.data().profileCreated)
	    			this.profileCreated = true;
	    			//connect to People section
	    			let userRef = this.firestore.collection("People").doc(this.userUID);	

					

 					//gather user data to display
	    			userRef.get().then((snapshot2) => {
	    				
						//get user details or assign to empty string if not details in database
						let userName = snapshot.data().userName ? snapshot.data().userName: "";
						let firstName = snapshot2.data().firstName ? snapshot2.data().firstName : "";
						let lastName = snapshot2.data().lastName ? snapshot2.data().lastName : "";
						let age = snapshot2.data().age ? snapshot2.data().age : "";
						let styles = snapshot2.data().styles ? snapshot2.data().styles : "";
						let bio = snapshot2.data().bio ? snapshot2.data().bio : "";
						let generalLoc = snapshot2.data().generalLoc ? snapshot2.data().generalLoc : ""
						let lat = snapshot2.data().lat ? snapshot2.data().lat : "";
						let lng = snapshot2.data().lng ? snapshot2.data().lng : "";


						this.setState({
							firstName:firstName,
							lastName:lastName,
							userName:userName,
							age:age,
							styles:styles,
							bio:bio,
							generalLoc:generalLoc,
							lat:lat,
							lng:lng
						});
					
	    			})
	    		}else{
	    			//Leave fields blank for first input
	    			console.log(snapshot.data().profileCreated)
	    			this.profileCreated = false;
	    		}
			});

			let picRef = this.firestore.collection("PeopleImages").doc(this.userUID);
			picRef.get().then((snapshot)=>{
				
				this.setState({
					profilePicUrl:snapshot.data().profilePicUrl
				})
			})
	    	
	    }else{
	    	// No user is signed in. prompt to sign in.
	    	alert("Please sign in to see your profile")
	    }	
	}



	//handle input fields
	_onChangeInput(e){
		
		this.setState({
			[e.target.name]:e.target.value
		})
	}




	_submitForm(e){
		e.preventDefault();

		//Check if User is signed in.		
		if(this.userUID) {
		    
		    	
		    //create profile
			let profileRef = this.firestore.collection('People').doc(this.userUID);
		    


			let userObj = {

				firstName:this.state.firstName,
				lastName:this.state.lastName,
				styles:this.state.styles,
				bio:this.state.bio,
				age:this.state.age,
				userName:this.state.userName,
				generalLoc:this.state.generalLoc,
				lat:this.state.lat,
				lng:this.state.lng,
				uid:this.userUID
				
			}
			if(this.profileCreated === true){
				console.log(this.profileCreated);
				console.log("updating profile");
				profileRef.update(userObj)

			}else{
				console.log(this.profileCreated)
				console.log("creating profile");
				let now = Date.now();
				userObj["profileCreated"] = now;
				console.log(userObj);
				profileRef.set(userObj);
				this.profileCreated = true;
			}
			

			let userUIDRef = this.firestore.collection("Users").doc(this.userUID);
			    			
			userUIDRef.update({
				profileCreated:true,
			})
			alert("Profile Updated")
			    
		}else{
		    // No user is signed in.
		    alert("please sign in");
		}
		
	}


	
	_handleProfilePic(e){
		let urlToPush = `/ProfilePic/${this.userUID}`
		this.props.history.push(urlToPush);

	}

	_handleUsernameChange(){
		this.props.history.push('/Username');
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

		if(this.signedIn){
		return(
			<div>
				<div className="container">
					<div className="content-wrapper">
						<div className="row">
							
							<div className="col-sm-12">
								<div className="box">
									
									<h3 className="text-center">Profile:</h3>


									<form action="">

										<div className="row text-center box">
																						
											<div className="col-sm-6 ">
												<img src={this.state.profilePicUrl ? this.state.profilePicUrl : defaultLogo} width='50%' height='50%' id="profilePic"  alt="" /><br />
												<label>{this.state.userName}</label>
											</div>
											<div className="col-sm-6">
												<input type="button" value="Update Username" className="btn btn-primary" onClick={this._handleUsernameChange.bind(this)} /><br /><br />
												<input type="button" value="Update Profile Pic" className="btn btn-primary" onClick={this._handleProfilePic.bind(this)} />
											</div>
										</div>

										
										<div className="row">
											
										</div>

										



										<div className="row">
											<div className="col-sm-6">
												<label>First Name:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="firstName" value={this.state.firstName} onChange={this._onChangeInput.bind(this)} />
											</div>

										</div>
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>Last Name:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="lastName" value={this.state.lastName} onChange={this._onChangeInput.bind(this)} />
											</div>

										</div>
										<br />



										


										<br />
										<div className="row">
											<div className="col-sm-6">
												<label>Age range:</label>
											</div>
											<div className="col-sm-6">
												<select name="age" value={this.state.age} onChange={this._onChangeInput.bind(this)} >
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
												<label>Main Style Practiced:</label>
											</div>
											<div className="col-sm-6">
												<input type="text" name="styles" value={this.state.styles} onChange={this._onChangeInput.bind(this)} />
											</div>

										</div>
										
										<br />
										<div className="row">
											<div className="col-sm-6">
												<label htmlFor="bio">Bio:</label>
											</div>
											<div className="col-sm-6">
												<textarea id="bio" name="bio" value={this.state.bio} onChange={this._onChangeInput.bind(this)} ></textarea>
											</div>

										</div>
										<br />
										
										


										{/*<div className="row">
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
										</div>*/}
										<hr />
										
				                        <div className="row">
											<div className="col-sm-6">
												<label><p title="By providing this data others can make contact for challenges, matches, or social elements">Your General Location</p></label>
												
											</div>
											<div className="col-sm-6">
												{this.state.generalLoc}
											</div>

										</div>
										<div className="row">
											<div className="col-sm-6">
												<p>Search for new location</p>
											</div>
											<div className="col-sm-6">
												<Geosuggest
										          ref={el=>this._geoSuggest=el}
										          placeholder="Search for your address"
										          onSuggestSelect={this._onSuggestSelect.bind(this)}
										          location={new google.maps.LatLng()}
										          radius="20" 
										        />
											</div>
										</div>	
											
				                        <hr />
										<input type="submit" value="Update profile" className="btn btn-primary" onClick={this._submitForm.bind(this)}/>
										
									</form>
									
								</div>	


								<div className="box">
									<div>
										<PasswordChange />
									</div>
								</div>
							</div>
						</div>
						
						
					</div>
				</div>
			</div>
		
		)}else{
			return(
				<p></p>
			)
		}
	}
}
