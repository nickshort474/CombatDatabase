import React, {Component} from 'react';
import ProcessEpoch from '../../utils/ProcessEpoch';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';
import BlogCommentReplyComp from './BlogCommentReplyComp';

export default class BlogCommentComp extends Component{
	
	constructor(props){
		super(props);

		this.state = {
			replyArray:[],
			showHideText:"Show",
			showHideLet:"Hide",
			replyNum:0,
			replyText:""
		}

		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");

		//get users username ready for comments or replies
		let usernameRef = this.firestore.collection("Users").doc(this.userUID);
		usernameRef.get().then((snapshot)=>{
			this.username = snapshot.data().userName;
			this._getCommentReplies()
		})
	}

	_getCommentReplies(){

		
		
		let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
		let query = ref.orderBy("timePosted", "asc");
		
		query.onSnapshot((snapshot)=>{
			
			let replyNum = 0;
			let replyArray = [];

			snapshot.forEach((snap)=>{
				replyNum++;
				replyArray.push(snap.data())
			})

			this.setState({
				replyArray:replyArray,
				replyNum:replyNum
			})
		})
	}


	_replyToComment(e){
		//grab id from button using its index value
		let id = e.target.id;
		
		//hide reply button
		document.getElementById(id).hidden = true;

		//show other buttons and input
		let cancelReply = document.getElementById(`cancelReply${id}`);
		cancelReply.hidden = false;
		let sendReply = document.getElementById(`sendReply${id}`);
		sendReply.hidden = false;
		let replyText = document.getElementById(`replyText${id}`);
		replyText.hidden = false;
				
	}
 
	_handleReplytext(e){
		this.setState({
			replyText:e.target.value
		})
	}

	_hideReplyElements(id){

		//show reply button
		document.getElementById(id).hidden = false;

		//hide buttons and input
		let cancelReply = document.getElementById(`cancelReply${id}`);
		cancelReply.hidden = true;
		let sendReply = document.getElementById(`sendReply${id}`);
		sendReply.hidden = true;
		let replyText = document.getElementById(`replyText${id}`);
		replyText.hidden = true;
	}


	_cancelReply(e){
		
		let id = String(e.target.id).slice(11);
		console.log(id)
		this._hideReplyElements(id);

		/*//show reply button
		document.getElementById(id).hidden = false;

		//hide buttons and input
		let cancelReply = document.getElementById(`cancelReply${id}`);
		cancelReply.hidden = true;
		let sendReply = document.getElementById(`sendReply${id}`);
		sendReply.hidden = true;
		let replyText = document.getElementById(`replyText${id}`);
		replyText.hidden = true;*/
	}


	_onCommentReply(e){
		console.log(e.target.id)
		let id = String(e.target.id).slice(9);
		console.log(id)

		let replyText = document.getElementById(`replyText${id}`).value;
				
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
		this._hideReplyElements(id);
		this.setState({
			showHideText:"Hide",
			showHideLet:"Show",
				
		})
	}

	_showHideReplies(){

		

		if(this.state.showHideLet === "Hide"){
			this.setState({
				showHideText:"Hide",
				showHideLet:"Show",
				
			})

			/*let replyNum = 0;
			let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
			let query = ref.orderBy("timePosted", "asc");
			

			query.onSnapshot((snapshot)=>{
				replyNum = 0;
				let replyArray = [];
				snapshot.forEach((snap)=>{
					replyNum++;
					replyArray.push(snap.data())
				})
				this.setState({
					replyArray:replyArray,
					showHideText:"Hide",
					showHideLet:"Show",
					replyNum:replyNum
				})
			})*/
		}else{
			this.setState({
				showHideText:"Show",
				showHideLet:"Hide"
			})
		}

		
	}

	render(){

		let replies = [];
		

		replies = this.state.replyArray.map((reply, index)=>{
			
			return <BlogCommentReplyComp text={reply.text} time={reply.timePosted} username={reply.username} index={index} key={index} />
			//<div className="text-center" key={index}><p>{reply.text}</p><p className="text-10">By: {reply.username}</p><br /></div>
		})

		return(
			<div className="well" id={`well${this.props.index}`}>
						
				<div style={{"fontWeight":"bold"}} className="text-10">{this.props.username} - <ProcessEpoch date={this.props.timePosted} hoursWanted={false} /></div>
				
				<p>{this.props.text}</p>
				

				<p style={{"cursor":"pointer","fontWeight":"bold"}} id={this.props.index} onClick={this._replyToComment.bind(this)}>	Reply 	</p>

				<input  id={`replyText${this.props.index}`} type="text" placeholder="Reply to comment" hidden={true} value={this.state.replyText} onChange={this._handleReplytext.bind(this)} />
				<button id={`cancelReply${this.props.index}`} hidden={true} onClick={this._cancelReply.bind(this)}>	   Cancel 	</button>
				<button id={`sendReply${this.props.index}`} hidden={true} onClick={this._onCommentReply.bind(this)}>	Reply 	</button>


				{this.state.replyNum === 0 		? 	null 	: 	<p style={{"cursor":"pointer","fontWeight":"bold"}} onClick={this._showHideReplies.bind(this)} id={`showHideReplyButton${this.props.index}`}>	{`${this.state.showHideText}  ${this.state.replyNum} replies`}	</p> }

				{this.state.showHideLet === "Show" ? replies : null}		
			</div>

		)
	}
} 