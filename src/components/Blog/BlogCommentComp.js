import React, {Component} from 'react';
import ProcessEpoch from '../../utils/ProcessEpoch';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';


export default class BlogCommentComp extends Component{
	
	constructor(props){
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

	_getCommentReplies(){

		let replyArray = [];
		let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
		ref.onSnapshot((snapshot)=>{
			console.log(snapshot)
			snapshot.forEach((snap)=>{
				replyArray.push(snap.data())
			})
			this.setState({
				replyArray:replyArray
			})
		})
	}


	_replyToComment(e){

		//grab id from button using its index value
		let id = e.target.id;

		//remove reply button
		document.getElementById(id).remove();

		//get reference to comment well
		let commentWell = document.getElementById(`well${id}`)
		

		/*this.setState({
			[`replying${e.target.id}`]:true
		})*/

		//create input box and submit button for reply
		var replyInput = document.createElement("INPUT");
		var replyButton = document.createElement("BUTTON");
		
		//set replyID
		let replyID = `reply${id}`

		replyInput.setAttribute("id", replyID);

		replyButton.setAttribute("id", id);
		replyButton.innerHTML = "Reply to comment"
		replyButton.addEventListener("click", this._onCommentReply.bind(this));
		
		//add input and submit button
		commentWell.appendChild(replyInput);
		commentWell.appendChild(replyButton);
				
	}
 
	_onCommentReply(e){
		
		let replyText = document.getElementById(`reply${e.target.id}`).value;
		console.log(replyText);
		//let key = this.props.commentKeys[e.target.id];
		
		let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
		let now = Date.now();		
		
		let obj = {
			text:replyText,
			user:this.userUID,
			username:this.username,
			timePosted:now
		}

		ref.add(obj).then(()=>{
			console.log("replied");
		})
		
		
	}

	_showHideReplies(){

		if(this.state.showHideText === "Show replies"){
			
			let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
			ref.onSnapshot((snapshot)=>{
				
				let replyArray = [];
				snapshot.forEach((snap)=>{
					replyArray.push(snap.data())
				})
				this.setState({
					replyArray:replyArray,
					showHideText:"Hide replies"
				})
			})
		}else{
			this.setState({
				replyArray:[],
				showHideText:"Show replies"
			})
		}

		
	}

	render(){

		let replies;

		replies = this.state.replyArray.map((reply, index)=>{
			return <div className="text-center" key={index}><p>{reply.text}</p><p className="text-10">By: {reply.username}</p><br /></div>
		})

		return(
			<div className="well" id={`well${this.props.index}`}>
						
				<p>{this.props.text}</p>
				<p>by:{this.props.username}</p>
				<ProcessEpoch date={this.props.timePosted} hoursWanted={true} />
				<button id={this.props.index} onClick={this._replyToComment.bind(this)}>Reply</button>
				<p onClick={this._showHideReplies.bind(this)}>{this.state.showHideText}</p>
				{replies}		
			</div>

		)
	}
} 