import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';


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
		this._getUserInfo();
		this._getProfileImage();

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
				location:snapshot.data().address,
				
				
				
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


					<div className="row box">
						<div className="col-sm-12">
							

								<div className="row">
									<div className="col-sm-8">
										<h2>{this.state.userName}</h2>
										<p>Also known as: {this.state.firstName + " " + this.state.lastName}</p>
										
									</div>
									<div className="col-sm-4">
										<img src={this.state.profilePic} style={{"width":"100%"}} alt="placeholder" />
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
									<p className="col-sm-2">Clubs</p>
									<div className="col-sm-10">
										<p>{this.state.clubs}</p>
									</div>
								</div>
								<hr />
								<div className="row">
									<p className="col-sm-2">Location</p>
									<div className="col-sm-10">
										<p>{this.state.location}</p>
									</div>
								</div>
								<hr />
								{/*<div className="row">
									<p className="col-sm-2">Friends</p>
									<div className="col-sm-10">
										{friendsList}
									</div>
								</div>
								<hr />*/}
								<div className="row">
									<p className="col-sm-2">Contactable by</p>
									<div className="col-sm-8">
										<p>{this.state.contact}</p>
									</div>
									
								</div>
							</div>
							
					</div>
					
				</div>
			</div>
		)
	}
}
	

	export default PersonProfile;