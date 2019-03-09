import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';
import store from '../../redux/store';
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
		this.prevPage = store.getState().prevPage;
		
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		
		//get users username ready for comments or replies
		if(this.userUID){
			let usernameRef = this.firestore.collection("Users").doc(this.userUID);
			usernameRef.get().then((snapshot)=>{
				this.username = snapshot.data().userName;
			})
			this.signedIn = true
		}else{
			this.signedIn = false
		}
		
		this._getBlogInfo();
		this._getComments();
	}

	componentWillUnmount(){

		//detach onSnapshot listener
		this.snapshot();
		
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
		this.snapshot = query.onSnapshot((snapshot)=>{
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

		if(commentText.length >= 4){
				
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
			alert("There is a four character minimum for comments")
			
		}	

		
	}



	render(){

		let content, comments;
		
		

		content = this.state.blogPara.map((con)=>{
			
			if(con.type === "img"){
				return <div key={con.data} ><img style={this.style}  id='base64image' src={con.data} alt="" /><br /></div>
			}else{
				
				//test for empty paragraph content and if empty return nothing
				if(con.data !== ""){
					return <div key={con.data}>{con.data}<br /><br /></div>
				}else{
					return null
				}	
			}
			
		})

		comments = this.state.comments.map((comment,index)=>{
			
			return <BlogCommentComp commentKey={this.state.commentKeys[index]} index={index} text={comment.text}  userUID={this.props.match.params.BlogUser} blogName={this.props.match.params.BlogName} postKey={this.props.match.params.PostKey} username={comment.username} timePosted={comment.timePosted} key={index} />

		})

		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to={this.prevPage}>&#60; Back</Link>
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
							
							{this.signedIn ? 

							<div className="box form-group">
								<label htmlFor="commentText">Leave a comment</label>
								<textarea id="commentText" value={this.state.commentText} onChange={this._commentText.bind(this)} placeholder="post a comment" className="form-control" style={{"height":"50%"}}/>
								<div className="text-center"><button className="btn btn-primarySmall" onClick={this._postComment.bind(this)}>Comment</button></div>
							</div>

							: 

							<div className="box text-center">
								Please <Link to="/Signin">sign in</Link> to comment, or reply to comments
							</div>

							}
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