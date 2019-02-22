import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import store from '../../redux/store';
import constants from '../../redux/constants';
import PersonComp from './PersonComp';

import { withFirebase } from '../Firebase';

class Community extends Component{

	constructor(props){
		super(props);
		
		store.dispatch({type:constants.SAVE_PAGE, page:"Community"});

		let storeState = store.getState();
		this.userUID = storeState.userUID;
		this.firestore = this.props.firebase.mainRef();
		

		this.state = {
			items:[],
			requestList:[]
		}
		this._getPeople();
		this._getContactRequests();
		
		
	}

	_getPeople(){
		
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactList");
		
		let items = [];
				
		ref.get().then((snapshot)=>{
			
			snapshot.forEach( (snap)=> {
				
				//items.push(element.data());
				items.push(snap.data());
				
				
			});
			
			this.setState({
				items:items
			})
		})
	}

	


	_getContactRequests(){
		
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactRequests");

		let requestList = [];

		ref.get().then((snapshot)=>{
			if(snapshot.exists){
				console.log("contact requests yay")
				snapshot.forEach((snap)=>{
					console.log(snap.data());
					requestList.push(snap.data())
				})
				this.setState({
					requestList:requestList
				})
			}else{
				console.log(" no one wants to be my friend");
			}
			
			
			
			
		})
	}

	_handleRequestYes(e){
		
		let contactUID = e.target.id;
		let contactUserName = e.target.value;

		//get own username from firestore
		let ref = this.firestore.collection("Users").doc(this.userUID);
			
		ref.get().then((snapshot)=>{
			this.userName = snapshot.data().userName;
		}).then(()=>{
			// send username and uid to requesting users ContactList
			let ref = this.firestore.collection("People").doc(contactUID).collection("ContactList").doc(this.userUID);
			let obj = {
				userName:this.userName,
				userUID:this.userUID
			}

			//set value
			ref.set(obj).then(()=>{

				//then add their contact details to own ContactList
				let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(contactUID);
			
				let obj = {
					userName:contactUserName,
					userUID:contactUID
				}
				ref.set(obj).then(()=>{
					//then remove ContactRequest
					this._deleteRequest(contactUID);
				})
			});

			
	

		})
	}

	_handleRequestNo(e){
		console.log(e.target.id)
		this._deleteRequest(e.target.id);
	}

	_deleteRequest(id){
		
		
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactRequests").where("requestUserUID", "==" , id);
		
		ref.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				snap.ref.delete()
			})
			this._getContactRequests();
		})
		
	}

	render(){

		let contactList;

		
		contactList = this.state.items.map((contact,index)=>{
			return <PersonComp  userName={contact.userName} uid={contact.userUID} key={index} />
		})



		let requests = this.state.requestList.map((request,index)=>{
			
			return <div  className="box" key={index}> {request.requestUserName} would like to be your friend<br />
						<p>{request.content}</p>
						<button id={request.requestUserUID} value={request.requestUserName} onClick={this._handleRequestYes.bind(this)}>Yes</button>
						<button id={request.requestUserUID} onClick={this._handleRequestNo.bind(this)}>No</button>
					</div>
		})
		

		return(
		    <div className="container">
				<div className="content-wrapper">
					<div className="row box text-center">
						<div className="row">
							<Link to="/FindPeople"><button type="button" className="btn btn-primary extraMargin">Find people</button></Link>
							
						</div>
					</div>
					<div className="row box text-center">	
						
							{requests}
						
						
					</div>
					<div className="row box text-center">
							Your community: {contactList}
							
					</div>
				</div>
			</div>
		)
	}
}

export default withFirebase(Community);