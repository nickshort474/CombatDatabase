import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
/*import SideBarAdvert from '../../Components/SideBarAdvert';*/
import BlogPostComp from './BlogPostComp';
import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';
		


export default class BlogPostList extends Component{
	
	constructor(){
		super();
		

		this.state = {
			postArray:[],
			showFollow:"hide"
			
		}

		let storeState = store.getState();

		this.firestore = firebase.firestore();
		
		this.prevPage = "/" + storeState.page;
		this.userUID = LocalStorage.loadState("user");
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		this._getBlogInfo();
		
		if(this.userUID){
			this._checkIfFollowing();
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
		this.showFollow = "show";	
			
		let ref = this.firestore.collection("userUIDs").doc(this.userUID).collection("BlogFollowing");
		
		ref.get().then((snapshot)=>{
		
			snapshot.forEach((snap)=>{
				console.log(snap.data().BlogName)
				console.log(this.props.match.params.BlogName);
				
				if(snap.data().BlogName === this.props.match.params.BlogName){
					this.showFollow = "hide";						
				}
			})
			this.setState({
				showFollow:this.showFollow
			})
		})

			
		
	}

	_followBlog(){

		this._disable()


		// follow blog
		let ref = this.firestore.collection("userUIDs").doc(this.userUID).collection("BlogFollowing");
		
		let blogObj = {
			BlogName:this.props.match.params.BlogName
		}

		ref.add(blogObj).then(()=>{
			console.log("new collection");
			let newRef = this.firestore.collection("BlogNames").doc(this.props.match.params.BlogName).collection("Followers");
			
			let blogRef = {
				BlogUser:this.userUID
			}

			newRef.add(blogRef).then(()=>{
				this.setState({
					showFollow:"hide"
				})
			})
		})
		
	}

	_disable(){
		let elem = document.getElementsByClassName("content-wrapper")[0];
		elem.style.opacity = "0.5"

				
		//disabled submit button
		this.setState({
			isEnabled:false
		})
	}


	render(){

		let showFollowButton;

		let content = this.state.postArray.map((blog)=>{
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName} blogUser={this.props.match.params.BlogUser} date={blog.date} firstImage={blog.firstImage}   key={blog.date} />
			
		})

		if(this.state.showFollow === "show"){
			showFollowButton = <button type="button" className="btn-primary" disabled={this.state.isEnabled} onClick={this._followBlog.bind(this)}>Follow this Blog</button>
		}else if(this.state.showFollow === "signIn"){
			showFollowButton = <div>Please sign in to follow this blog</div>
		}else if(this.state.showFollow === "hide"){
			showFollowButton = <p></p>
		}

		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to={this.prevPage}>&#60; Back to blog listing</Link>
						    </div>
					    </div>
					</div>

					<div className="row">    
					   
					
						<div className="col-sm-12">
							<div className="box">
								<h2 className="text-center">{this.props.match.params.BlogName} Posts</h2>
								<div>
									{content}
								</div>
							</div>
						</div>
												
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="box text-center">
								{showFollowButton}
							</div>
						</div>
					</div>
				</section>

			</div>


			
		)
	}
}