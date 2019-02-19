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
			contact:"No-one",
			generalLoc:" ",
			lat:" ",
			lng:" "
			
		}
		
		var storeState = store.getState();
		this.userUID = storeState.userUID;
		this.firestore = firebase.firestore()
		
		
	}
	
	componentWillMount(){
		window.scrollTo(0, 0);
		
	
	}

	componentDidMount(){

		//Check if user is signed in.
	    if (this.userUID) {
	    	
	    	// connect to userUIDs db section
			let ref = this.firestore.collection('userUIDs').doc(this.userUID);

			//get snapshot
			ref.get().then((snapshot)=>{
				
				//get username
				let userName = snapshot.data().userName;
				// check for profileCreated in userUIDs db section
				if(snapshot.data().profileCreated){
	    			
					

	    			//connect to People section
	    			let userRef = this.firestore.collection("People").doc(this.userUID);	

 					//gather user data to display
	    			userRef.get().then((snapshot2) => {
	    				
						this.setState({
							firstName:snapshot2.data().firstName,
							lastName:snapshot2.data().lastName,
							userName:userName,
							age:snapshot2.data().age,
							styles:snapshot2.data().styles,
							clubs:snapshot2.data().clubs,
							bio:snapshot2.data().bio,
							contact:snapshot2.data().contact,
							generalLoc:snapshot2.data().generalLoc,
							lat:snapshot2.data().lat,
							lng:snapshot2.data().lng
						});
					
	    			})
	    		}else{

	    			//no profile info to load - prompt user to add info
	    			this.setState({
	    				userName:userName
	    			})
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
				contact:this.state.contact,
				generalLoc:this.state.generalLoc,
				lat:this.state.lat,
				lng:this.state.lng
			}

			profileRef.set(userObj);

			let userUIDRef = this.firestore.collection("userUIDs").doc(this.userUID);
			    			
			userUIDRef.update({
				profileCreated:true,
			})
			    
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
									
									<h3 className="text-center">Profile page:</h3>


									<form action="">

										<div className="row text-center box">
																						
											<div className="col-sm-6 ">
												<img src={this.state.profilePicUrl ? this.state.profilePicUrl : defaultLogo} width='50%' height='50%' id="profilePic"  alt="" /><br />
												<label>{this.state.userName}</label>
											</div>
											<div className="col-sm-6">
												<input type="button" value="Update Username"  onClick={this._handleUsernameChange.bind(this)} /><br />
												<input type="button" value="Update Profile Pic"  onClick={this._handleProfilePic.bind(this)} />
											</div>
										</div>

										
										<div className="row">
											
										</div>

										



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
												<label>Main Style Practiced:</label>
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