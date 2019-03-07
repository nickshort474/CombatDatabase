import React, {Component} from 'react';
import ProcessEpoch from '../../utils/ProcessEpoch';
//import {firebase} from '@firebase/app';
//import LocalStorage from '../../utils/LocalStorage';


export default class BlogCommentReplyComp extends Component{
	
/*	constructor(props){
		super(props);

		this.state = {
			replyArray:[],
			showHideText:"Show replies"
		}

		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");

		//get users username ready for comments or replies
		let usernameRef = this.firestore.collection("Users").doc(this.userUID);
		usernameRef.get().then((snapshot)=>{
			this.username = snapshot.data().userName;
			//this._getCommentReplies()
		})
	}
*/


	

	render(){

		return (
			<div className="row">
				<div className="col-xs-1">

				</div>
				
				<div className="col-xs-11">
					
					<div className="row">
						<div className="col-xs-2 text-10">
							{this.props.username}
						</div>
						<div className="col-xs-8">
							<ProcessEpoch date={this.props.time} hoursWanted={false} />
						</div>
					</div>
					<div className="row">
						{this.props.text}
					</div>
					
					<hr />
				</div>
			</div>
			
		)
	}
} 