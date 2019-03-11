import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';

import MessageComp from './MessageComp';
import NewMessage from './NewMessage';

class Messages extends Component{
	
	constructor(){
		super();
		
		
		this.state = {
			messages:[]
			
		}
				
	}

	componentWillMount(){
		window.scrollTo(0, 100);
		
		store.dispatch({type:constants.SAVE_PAGE, page:`/Person/${this.props.match.params.PersonKey}/${this.props.match.params.PersonUsername}`})
		
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
		
		this._gatherMessages();

	}
	

	componentWillUnmount(){
		this.snapshotListener();
	}

	_gatherMessages(){
		
		let ref = this.firestore.collection("Messages").doc(this.userUID).collection(this.props.match.params.PersonKey);
		let query = ref.orderBy("messageDate","asc");
		
		this.snapshotListener = query.onSnapshot((snapshot)=>{
			let items = [];

			snapshot.forEach((snap)=>{
				
				items.push(snap.data());
				
			})
			this.setState({
				messages:items
			},()=>{
			
				window.scrollTo(0, 1000);
			})

			
		})
		
	}



	render(){

				
		

		let messages = this.state.messages.map((msg,index)=>{

			let ownMsg = false;

			if(msg.messageUser === this.userUID){
				ownMsg = true
			}
			return <MessageComp  contents={msg.messageContents} ownMsg={ownMsg} user={msg.messageUser} date={msg.messageDate} key={index} />
		})



		return(
			
			<div className="container">

				<div className="content-wrapper">
				

					<div className="row box text-center">
						<h2>Last 10 messages</h2>
						{messages.length > 0 ? messages : <p>No messages yet</p>}
					</div>
					<NewMessage msgUser={this.props.match.params.PersonKey} />

					<div className="row box">
						
						<Link to="/Community">&lt; Back</Link>
						
					</div>
					
				</div>
			</div>
		)
	}
}
	

	export default Messages;