import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';

export default class SinglePersonPage extends Component{
	
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
			items:[],
			friends:[]
		}
				
	}

	componentWillMount(){
		window.scrollTo(0, 0);
		this.userUID = store.getState().userUID;
		store.dispatch({type:constants.SAVE_PAGE, page:`User/${this.props.match.params.UserKey}`})

		this._getUserInfo();


	}
	
	
	_getUserInfo(){

		
		let firestore = firebase.firestore();

		let ref = firestore.collection("People").doc(this.props.match.params.UserKey);

		

		ref.get().then((snapshot)=>{
			
			
			
			if(snapshot.data().contact !== "Everyone"){
				this.buttonStyle = {
					visibility:"hidden"
				}
			}else{
				this.buttonText = "Friend Request"
			}

			

			this.setState({
				firstName:snapshot.data().firstName,
				lastName:snapshot.data().lastName,
				userName:snapshot.data().userName,
				userNameLink:`/NewPrivateMessage/${snapshot.data().userName}/${snapshot.data().uid}`,
				bio:snapshot.data().bio,
				clubs:snapshot.data().clubs,
				styles:snapshot.data().styles,
				age:snapshot.data().age,
				location:snapshot.data().address,
				contact:snapshot.data().contact,
				profilePic:snapshot.data().profilePicUrl,
				buttonText:this.buttonText
				
			})
		})

		let list = [];
		let isFriend = false;

		let ref2 = firestore.collection("People").doc(this.props.match.params.UserKey).collection("followers");
		
		ref2.get().then((snapshot)=>{

			snapshot.forEach((snap)=>{
				
				list.push(snap.data().userName);
				
				if(snap.data().userUID === this.userUID){
					isFriend = true
				}
			})
			
			this.setState({
				friends:list,
				isFriend:isFriend
			})
			
		})
	
	}


	_handleContactRequest(){
		this.props.history.push(`/FriendRequest/${this.props.match.params.UserKey}`)
	}


	render(){

		let imgStyles = {
			width:"150px",
			height:"150px"
		};
		
		let friendsList = this.state.friends.map((friend)=>{
			
			return <div key={friend}>{friend}</div>
		})


		


		return(
			
			<div className="container">

				<div className="content-wrapper">
					<div className="row box">
						
						<div className="">
							<div className="col-sm-8">
								<Link to="/ContactsList">&lt; Back to people listing</Link>
							</div>
							<div className="col-sm-4">
								<div>{this.state.isFriend ?  <Link to={this.state.userNameLink}><button className="btn-primary">PM {this.state.userName}</button></Link> : null}</div>
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
										<img src={this.state.profilePic} style={imgStyles} alt="placeholder" />
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
								<div className="row">
									<p className="col-sm-2">Friends</p>
									<div className="col-sm-10">
										{friendsList}
									</div>
								</div>
								<hr />
								<div className="row">
									<p className="col-sm-2">Contactable by</p>
									<div className="col-sm-8">
										<p>{this.state.contact}</p>
									</div>
									<div className="col-sm-2">
										<div>{this.state.isFriend !== true ?   <button className="btn-primary" onClick={this._handleContactRequest.bind(this)} style={this.buttonStyle} >{this.state.buttonText}  </button>: null }</div>
									</div>
								</div>
							

							
							
							

						</div>
						
					</div>
					
					

				</div>

			</div>
		)
	}
}
	