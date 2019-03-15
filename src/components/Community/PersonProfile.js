import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';
import DefaultLogo from '../../assets/images/default.jpg';

class PersonProfile extends Component{
	
	constructor(){
		super();
		
		
		this.state = {
			firstName:" ",
			lastName:" ",
			userNameLink:" ",
			bio:" ",
			clubs:" ",
			styles:" ",
			age:" ",
			friends:[],
			requestSent:false,
			
		}
				
	}

	componentWillMount(){
		window.scrollTo(0, 0);
		let storeState = store.getState();
		
		this.prevPage = storeState.page;
		this.userUID = LocalStorage.loadState("user");
		this.firestore = firebase.firestore();
		
		// check if collection("People").doc(this.props.match.params.PersonKey) exists
		let ref = this.firestore.collection("People").doc(this.props.match.params.PersonKey);
		ref.get().then((snapshot)=>{
			console.log(snapshot.exists)
			if(snapshot.exists){
				//if it does...
				this.userExists = true;
				this._getUserInfo();
				this._getProfileImage();
			}else{
				//else inform user "this account is no longer active"
				//show delete contact button instead of profile
				//onDelete delete this users reference within - ("People").doc(this.userUID).collection("ContactList").doc(this.props.match.params.PersonKey).delete() 
				this.userExists = false

			}
		})
		
		 
		
		
	}

	
	_getUserInfo(){

		
		
		let isFriend;
		let ref2 = this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(this.props.match.params.PersonKey);
		
		ref2.get().then((snapshot)=>{
			
			if(snapshot.exists){
				isFriend = true
				
			}else{
				isFriend = false;
			}
			
			this.setState({
				isFriend:isFriend
			})
			
		})
		
		let ref3 = this.firestore.collection("People").doc(this.props.match.params.PersonKey).collection("ContactRequests");
		let query = ref3.where("requestUserUID", "==", this.userUID);
		query.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				if(snap.data().requestUserUID === this.userUID){
					// user has already sent request
					this.setState({
						requestSent:true
					})
				};
			})
		})


		let ref = this.firestore.collection("People").doc(this.props.match.params.PersonKey);
		
		ref.get().then((snapshot)=>{
			
			
			this.setState({
				firstName:snapshot.data().firstName,
				lastName:snapshot.data().lastName,
				userName:snapshot.data().userName,
				bio:snapshot.data().bio,
				clubs:snapshot.data().clubs,
				styles:snapshot.data().styles,
				age:snapshot.data().age,
				location:snapshot.data().generalLoc,
				
				
				
			})
		})

	}

	_getProfileImage(){
		let ref = this.firestore.collection("PeopleImages").doc(this.props.match.params.PersonKey);
		ref.get().then((snapshot)=>{
			this.setState({
				profilePic:snapshot.data().profilePicUrl
			})
		})
	}


	_handleContactRequest(){
		this.props.history.push(`/ContactRequest/${this.props.match.params.PersonKey}`)
	}

	_deleteContact(){
		this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(this.props.match.params.PersonKey).delete();
		this.props.history.push('/Community');
	}

	render(){

		
	

		let buttonToShow;

		if(this.state.isFriend === false && this.state.requestSent === false && this.userUID !== this.props.match.params.PersonKey ){
			buttonToShow = <button className="btn-primary" onClick={this._handleContactRequest.bind(this)} style={this.buttonStyle} >Contact Request </button>
		}else if(this.state.requestSent === true){
			buttonToShow = <p>Contact Request Pending</p>
		}
		
		

		

		return(
			
			<div className="container">

				<div className="content-wrapper">
					
					<div className="row box">
						<div className="">
							<div className="col-sm-8">
								<Link to={this.prevPage}>&lt; Back </Link>
							</div>
							<div className="col-sm-4">
								<div>{buttonToShow}</div>
							</div>
					    </div>
					</div>


					{this.userExists ? 

						<div className="row box">
							<div className="col-sm-12">
								<div className="row">
									<div className="col-sm-8">
										<h2>{this.state.userName}</h2>
										<p>Also known as: {this.state.firstName + " " + this.state.lastName}</p>
										
									</div>
									<div className="col-sm-4">
										<img src={this.state.profilePic ? this.state.profilePic : DefaultLogo} style={{"width":"100%"}} alt="placeholder" />
									</div>
								</div>
								<hr />
								<div className="row">
									<p className="col-sm-2">Bio</p>
									<div className="col-sm-10">
										<p>{this.state.bio}</p>
									</div>
								</div>
								<hr />
								<div className="row">
									<p className="col-sm-2">Styles</p>
									<div className="col-sm-10">
										<p>{this.state.styles}</p>
									</div>
								</div>
								<hr />
								
								
								<div className="row">
									<p className="col-sm-2">General Location</p>
									<div className="col-sm-10">
										<p>{this.state.location}</p>
									</div>
								</div>
								
							</div>
						</div> 
					: 
						<div className="row box">
							<div className="col-sm-12 text-center">
								<p>Unfortunately it looks like this user has deleted their account, would you like to remove them from your contact list?</p><button className="btn btn-primarySmall" onClick={this._deleteContact.bind(this)}>Delete contact</button>
							</div>
						</div>
						




					}
					


				</div>
			</div>
		)
	}
}
	

	export default PersonProfile;