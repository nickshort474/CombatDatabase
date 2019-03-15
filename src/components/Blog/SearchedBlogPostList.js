import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import {_disable,_enable} from '../../utils/DisableGreyOut';

import BlogPostComp from './BlogPostComp';
import constants from '../../redux/constants';
import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';
		


export default class SearchedBlogPostList extends Component{
	
	constructor(){
		super();
		

		this.state = {
			postArray:[],
			showFollow:"hide"
			
		}

		let storeState = store.getState();
		this.prevPage =  storeState.prevPage;
		this.firestore = firebase.firestore();
				
		this.userUID = LocalStorage.loadState("user");
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:`/SearchedBlogPostList/${this.props.match.params.BlogUser}/${this.props.match.params.BlogName}`});
		this._getBlogInfo();
		
		//check if signed in
		if(this.userUID){
			//check if blog being viewed is not  own blog.
			if(!this.userUID === this.props.match.params.BlogUser){
				//if not own blog check whether user is already following blog
				this._checkIfFollowing();
			}
			
		}else{
			this.setState({
				showFollow:"signIn"
			})
		}
		
		
	    
	}
	
	_getBlogInfo(){
		
	    

	    let ref = this.firestore.collection("BlogPostList").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName);

	    let postArray = [];

	    ref.get().then((snapshot)=>{
	    	
	    	snapshot.forEach((element)=>{
	    		postArray.push(element.data());
	    	})

	    	this.setState({
	    		postArray:postArray
	    	})
	    })


	}

	_checkIfFollowing(){
		
		//
		let showFollow = "show";	
			
		let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");
		
		ref.get().then((snapshot)=>{
		
			snapshot.forEach((snap)=>{
				
				//if one of the blog names in BlogFollowed list matches this blog name, already following				
				if(snap.data().BlogName === this.props.match.params.BlogName){
					// set local let to hide
					showFollow = "hide";						
				}
			})

			//assign value of local let to state
			this.setState({
				showFollow:showFollow
			})
		})
		
	}

	_followBlog(){


		_disable();


		// follow blog
		let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");
		
		let now = Date.now();

		let blogObj = {
			blogName:this.props.match.params.BlogName,
			dateFollowed:now
		}

		ref.add(blogObj).then(()=>{
			
			let newRef = this.firestore.collection("BlogNames").doc(this.props.match.params.BlogName).collection("Followers");
			
			let blogRef = {
				blogUser:this.userUID,
				dateFollowed:now
			}

			newRef.add(blogRef).then(()=>{
				this.setState({
					showFollow:"hide"
				})
				_enable();
			})
		})
		
	}




	render(){

		let showFollowButton;

		let content = this.state.postArray.map((blog)=>{
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName}  blogUser={this.props.match.params.BlogUser} date={blog.date} firstImage={blog.firstImage}   key={blog.date} />
			
		})

		if(this.state.showFollow === "show"){
			showFollowButton = <button type="button" className="btn btn-primary" disabled={this.state.isEnabled} onClick={this._followBlog.bind(this)}>Follow this Blog</button>
		}else if(this.state.showFollow === "signIn"){
			showFollowButton = <div className="text-center">Please <Link to="/Signin">sign in</Link> to follow this blog</div>
		}else if(this.state.showFollow === "hide"){
			showFollowButton = <p></p>
		}

		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to={`/SearchedBlogs/${this.props.match.params.SearchTerm}`}>&#60; Back</Link>
						    </div>
					    </div>
					</div>

					<div className="row">    
					   
					
						<div className="col-sm-12">
							<div className="box">
								<h2 className="text-center">{this.props.match.params.BlogName} </h2>
								{showFollowButton}
								<div>
									{content}
								</div>
								
							</div>
						</div>
												
					</div>
					{/*<div className="row">
						<div className="col-sm-12">
							<div className="box text-center">
								
							</div>
						</div>
					</div>*/}
				</section>

			</div>


			
		)
	}
}