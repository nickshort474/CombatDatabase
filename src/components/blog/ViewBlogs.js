import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import BlogComp from './BlogComp';

/*import SideBarAdvert from '../../Components/SideBarAdvert';*/

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';
		

export default class ViewBlogs extends Component{
	
	
	constructor(){
		super();

		store.dispatch({type:constants.SAVE_PAGE, page:"ViewBlogs"});
		
		this.userUID = LocalStorage.loadState("user");
		this.state = {
			latestBlogs:[],
			followedBlogs:[]
		}
		this.showLimit = 2;
		this.firestore = firebase.firestore();
		this.signInMessage = <p></p>;
	}
	


	componentWillMount() {
		window.scrollTo(0, 0);

		
		if(this.userUID){
			
			//check firestore for if following any blogs
			let followingArray = [];
			let blogArray = [];

			let ref = this.firestore.collection("userUIDs").doc(this.userUID).collection("BlogFollowing");
			ref.get().then((snapshot)=>{
				snapshot.forEach((snap)=>{
					followingArray.push(snap.data().BlogName);
				})
			}).then(()=>{
				followingArray.forEach((item)=>{
					// loop thorugh returned blogNames to gather data from BlogName firestore section
					let ref = this.firestore.collection("BlogNames");
					
					let query = ref.where("name", "==" , item);
					
					query.get().then((snapshot)=>{
						snapshot.forEach((snap)=>{
							
							blogArray.push(snap.data());
							
						})
						this.setState({
							followedBlogs:blogArray
						})
						
					})
				})
			})
		}else{
			this.signInMessage = <p className="text-center">Please sign in to see your followed blogs</p>
		}
		/*//*/

		//plus show latest listed blogs underneath
		this._gatherLatestBlogs();


		
				   
	    
	}

	_gatherLatestBlogs(){
		this.items = [];
		this.counter = 0;
		
		let ref = this.firestore.collection("BlogNames").orderBy("creationDate","desc").limit(this.showLimit);
		
		ref.get().then((snapshot)=>{
			this.lastVisible = snapshot.docs[snapshot.docs.length - 1];

  			//console.log("last", lastVisible);

			snapshot.forEach((element)=> {
				this.items.push(element.data())
				this.counter++;
			});
			this.setState({
	    		latestBlogs:this.items
	    	});
	    	
		})
	}

	_handleMoreButton(){
		this.counter = 0;

		let ref = this.firestore.collection("BlogNames").orderBy("creationDate","desc").startAfter(this.lastVisible).limit(this.showLimit);
		
		ref.get().then((snapshot)=>{
			this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
			
			snapshot.forEach((element)=> {
				this.items.push(element.data())
				this.counter++;
			});
			this.setState({
	    		latestBlogs:this.items
	    	});
	    	console.log(this.counter)
		})

	}

	render(){

		let moreButton;

		let latestBlogs = this.state.latestBlogs.map((blog,index)=>{
			
			return <BlogComp blogName={blog.name} type={blog.type} logo={blog.blogLogo} description={blog.description} blogUser={blog.user} key={index} />
		})

		let followedBlogs = this.state.followedBlogs.map((blog,index)=>{

			return <BlogComp blogName={blog.name} type={blog.type} logo={blog.blogLogo} description={blog.description} blogUser={blog.user} key={index} />
		})

		if(this.counter === this.showLimit){
			moreButton = <button className="btn-primary" onClick={this._handleMoreButton.bind(this)}>Show more blogs</button>
		}

		return(
			
			<div className="container">
			 	<section className="content-wrapper">
					<div className="row">

						<div className="col-sm-3 textCenterMobile">
							
							<Link to="/FindBlog"><button type="button" className="btn btn-primary extraMargin">Find A Blog</button></Link><br />
							<Link to="/MyBlogList"><button type="button" className="btn btn-primary extraMargin">My Blogs</button></Link><br />
							
							
						</div>

						<div className="col-sm-9">
							<div className="box">
								<h2 className="text-center">Followed blogs</h2>
								<div>
									
									{followedBlogs}
									{this.signInMessage}
								</div>
								
							</div>

							<div className="box">
								<h2 className="text-center">Latest blogs</h2>
								<div>
									
									{latestBlogs}
									
								</div>
								<div className="text-center">
									<p>{moreButton}</p>
								</div>
							</div>	
							
						</div>
						
					</div>
				</section>
			</div>
		)
	}

}