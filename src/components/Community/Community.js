import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import firebase from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';
//import LocalStorage from '../../utils/LocalStorage';

import PersonComp from './PersonComp';

import {AuthUserContext} from '../Session';

const CommunitySignedIn = () => (
	
	<AuthUserContext.Consumer>
		{authUser =>
			(authUser) ? <Community propName={authUser} /> : <SignIn />
		}
	</AuthUserContext.Consumer>

)

class SignIn extends Component{

	constructor(){
		super();

		//store reference to page for rediret after signin
		store.dispatch({type:constants.SAVE_PAGE, page:"Community"});
	}
		
	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box text-center">
						<p>Please <Link to="/Signin">sign in</Link> to see your community</p>
					</div>
				</div>
			</div>
		)
	}
	
	
}	

class Community extends Component{

	constructor(props){
		super(props);
		
		
		
		store.dispatch({type:constants.SAVE_PAGE, page:"/Community"});
		
		this.firestore = firebase.firestore();
		

		
		

		this.state = {
			items:[],
			requestList:[]
		}

		
		
	}

	componentDidMount(){
		this.userUID = this.props.propName.uid;
		if(this.userUID){
			this._getPeople();
			this._getContactRequests();
		}

	}

	componentWillUnmount(){
		this.snapshotListener();
	}

	_getPeople(){
		
		
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactList");
	
		let items = [];
			
		this.snapshotListener = ref.onSnapshot((snapshot)=>{
		
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
			
			if(snapshot){
				snapshot.forEach((snap)=>{
					requestList.push(snap.data())
				})
				this.setState({
					requestList:requestList
				})
			}else{
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
			return <PersonComp userName={contact.userName} uid={contact.userUID} haveReplied={contact.haveReplied} key={index} />
		})
		
		
		
		let signInMessage = <p>Please <Link to="/Signin">sign in</Link> to see you community</p>
		

		let requests = this.state.requestList.map((request,index)=>{
			
			return <div className="well msgCompStyle" key={index}><b>{request.requestUserName}</b> would like to make contact<br />
						<p><i>"{request.content}"</i></p>
						Add contact?<button id={request.requestUserUID} value={request.requestUserName} onClick={this._handleRequestYes.bind(this)}>Yes</button>
						<button id={request.requestUserUID} onClick={this._handleRequestNo.bind(this)}>No</button>
					</div>
		})
		

		return(

		    <div className="container">
				<div className="content-wrapper">
					<div className="row text-center">
						
							<div>{this.userUID ? <Link to="/SearchForPeople"><button type="button" className="btn btn-primary">Find people</button></Link> : signInMessage} </div>
						
					</div><br />
									
					
						
						
					
					<div className="box text-center">
						
						<h4>Your Community</h4>
						<div>
							{requests}
						</div>
						<hr />
						<div className="text-center">	
							{contactList}
						</div>

					</div>
					
				</div>
			</div>
		)
	}
}


//export default Community;
export default CommunitySignedIn;
