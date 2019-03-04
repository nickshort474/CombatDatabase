import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';

import BlogCommentComp from './BlogCommentComp';

/*import ProcessEpoch from '../../utils/ProcessEpoch';*/

export default class SingleBlogPost extends Component{
	
	constructor(){
		super();

		this.style = {
			height:"100%",
			width:"100%",
			display:"block",
		}

		this.state = {
			blogPara:[],
			comments:[],
			commentKeys:[],
			commentText:"",

		}
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
		
		
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		
		//get users username ready for comments or replies
		let usernameRef = this.firestore.collection("Users").doc(this.userUID);
		usernameRef.get().then((snapshot)=>{
			this.username = snapshot.data().userName;
			this._getBlogInfo();
			this._getComments();
		})
	}

	_getBlogInfo(){
		
	    
	    let ref = this.firestore.collection("Blogs").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("contentBlocks").orderBy("time");
	    let dataArray = [];
	    
	    ref.get().then((snapshot)=>{
	    	
	    	snapshot.forEach((element)=>{
	    		dataArray.push(element.data())
	    		
	    	})

	    	this.setState({
	    		blogPara:dataArray
	    	})
	    })
	}

	_getComments(){

		
		let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments");
		let query = ref.orderBy("timePosted", "asc")
		query.onSnapshot((snapshot)=>{
			let commentArray = [];
			let commentKeyArray = [];

			snapshot.forEach((snap)=>{
				commentArray.push(snap.data());
				commentKeyArray.push(snap.id)
			})
			
			this.setState({
				comments:commentArray,
				commentKeys:commentKeyArray
			})
			//this._getCommentReplies();
		})

	}

	

	_commentText(e){
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	_postComment(){
		
		let commentText = this.state.commentText;
		
		this.setState({
			commentText:""
		});

		if(commentText.length > 3){
				
			let now = Date.now();
			let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments");
			
			let obj = {
				text:commentText,
				user:this.userUID,
				username:this.username,
				timePosted:now
			}
			ref.add(obj);
			
			
		}else{
			alert("There is a three character minimum for comments")
			
		}	

		
	}

	
/*	_replyToComment(e){

		//grab id from button using its index value
		let id = e.target.id;

		//remove reply button
		document.getElementById(id).remove();

		//get reference to comment well
		let commentWell = document.getElementById(`well${id}`)
		

		

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
		let key = this.state.commentKeys[e.target.id];
		
		let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments").doc(key).collection("Replies");
		let now = Date.now();		
		
		let obj = {
			text:replyText,
			user:this.userUID,
			username:this.username,
			timePosted:now
		}

		ref.add(obj).then(()=>{

		})
		
		
	}*/

	render(){

		let content, comments;
		
		

		content = this.state.blogPara.map((con)=>{
			
			if(con.type === "img"){
				return <div key={con.data} ><img style={this.style}  id='base64image' src={con.data} alt="" /><br /></div>
			}else{
				return <div key={con.data}>{con.data}<br /><br /></div>
			}
			
		})

		comments = this.state.comments.map((comment,index)=>{
			
			return <BlogCommentComp commentKey={this.state.commentKeys[index]} index={index} text={comment.text}  userUID={this.props.match.params.BlogUser} blogName={this.props.match.params.BlogName} postKey={this.props.match.params.PostKey} username={comment.username} timePosted={comment.timePosted} key={index} />

			/*return 	<div className="well" id={`well${index}`} key={index}>
						
						<p>{comment.text}</p>
						<p>by:{comment.username}</p>
						<ProcessEpoch date={comment.timePosted} hoursWanted={true} />
						<button id={index} onClick={this._replyToComment.bind(this)}>Reply</button>
						
					</div>*/
		})

		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to={"/BlogPostList/" + this.props.match.params.BlogUser + "/" + this.props.match.params.BlogName}>&#60; Back</Link>
						    </div>
					    </div>

					</div>

					<div className="row">
						<div className="col-sm-12">
							<div className="box">
							{content}
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="box form-group">
								<label htmlFor="commentText">Leave a comment</label>
								<textarea id="commentText" value={this.state.commentText} onChange={this._commentText.bind(this)} className="form-control" style={{"height":"50%"}}/>
								<div className="text-center"><button className="btn btn-primarySmall" onClick={this._postComment.bind(this)}>Comment</button></div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="box msgCompStyle">
								{comments}
							</div>
						</div>
					</div>
				</section>
			</div>

		)
	}
}