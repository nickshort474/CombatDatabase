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

		store.dispatch({type:constants.SAVE_PAGE, page:"/ViewBlogs"});
		

		this.userUID = LocalStorage.loadState("user");
		this.state = {
			latestBlogs:[],
			followedBlogs:[]
		}
		this.showLimit = 5;
		this.firestore = firebase.firestore();
		this.signInMessage = <p></p>;
	}
	


	componentWillMount() {
		window.scrollTo(0, 0);

		
		if(this.userUID){
			
			//check firestore for if following any blogs
			let followingArray = [];
			let blogArray = [];

			let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");
			ref.get().then((snapshot)=>{
				snapshot.forEach((snap)=>{
					followingArray.push(snap.data().blogName);
				})
			}).then(()=>{
				
				followingArray.forEach((item) => {
					
					let blogName = item;
					// loop thorugh returned blogNames to gather data from BlogName firestore section
					let ref = this.firestore.collection("BlogNames");
					
					let query = ref.where("name", "==" , blogName);
					
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
			this.signInMessage = <p className="text-center">Please <Link to="/Signin">sign in</Link> to see your followed blogs</p>
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
		})

	}

	render(){

		let moreButton;

		let latestBlogs = this.state.latestBlogs.map((blog,index)=>{
			if(blog.user === this.userUID){
				return null
			}else{
				return <BlogComp blogName={blog.name} type={blog.type} logo={blog.blogLogo} description={blog.description} blogUser={blog.user} key={index} />
			}
		})

		let followedBlogs = this.state.followedBlogs.map((blog,index)=>{

			return <BlogComp blogName={blog.name} type={blog.type} logo={blog.blogLogo} description={blog.description} blogUser={blog.user} key={index} />
		})

		if(this.counter === this.showLimit){
			moreButton = <button className="btn btn-primary" onClick={this._handleMoreButton.bind(this)}>Show more blogs</button>
		}

		return(
			
			<div className="container">
			 	<section className="content-wrapper">
					<div className="row">

						<div className="col-sm-3 text-center">
							
							<Link to="/FindBlog"><button type="button" className="btn btn-primarySmall extraMargin">Find a blog</button></Link><br />
							<Link to="/MyBlogs"><button type="button" className="btn btn-primarySmall extraMargin">Show my blogs</button></Link><br />
							
							
						</div>

						<div className="col-sm-9">
							<div className="box greyedContent">
								<h4 className="text-center">Followed blogs</h4>
								<div>
									
									{followedBlogs}
									{this.signInMessage}
								</div>
								
							</div>

							<div className="box greyedContent">
								<h4 className="text-center">Latest blogs</h4>
								<br />
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