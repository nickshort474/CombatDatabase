import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import MyBlogComp from './MyBlogComp';

/*import SideBarAdvert from '../../Components/SideBarAdvert';*/

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';
		

export default class MyBlogList extends Component{
	
	
	constructor(){
		super();
		
		store.dispatch({type:constants.SAVE_PAGE, page:"MyBlogList"});

		this.state = {
			items:[],
			blogNames:[],
			user:"",
			signInMessage:""
		}

	}
	
	componentWillMount() {

		// scroll window back to start
		window.scrollTo(0, 0);

		
		this.user = LocalStorage.loadState("user");
		
		
		// if user signed in gather blogs from firebase using UID
		if(this.user){
			this.setState({
				user:this.user
			}) 
			this._getMyBlogData(this.user);

		}else{

			// if not signed in redirect to sign in  
			this.setState({
				signInMessage:<div className="text-center">Please <Link to='/Signin'>sign in</Link> to see your blogs</div>
			})

		}
				

	}

	_getMyBlogData(user){

		this.items = [];
		this.blogNames = [];

	    let firestore = firebase.firestore();

	    let ref = firestore.collection("BlogUserList").doc(this.user).collection("blogs");

	    ref.get().then((snapshot)=>{

	    	snapshot.forEach((snap)=>{
	    		

	    		let blogRef = snap.data().blogName;
	    		let ref = firestore.collection("BlogNames").doc(blogRef);
	    		
	    		ref.get().then((snapshot)=>{
	    			
	    			this.items.push(snapshot.data());
	    			this.blogNames.push(snapshot.data().name)

	    			this.setState({
						items:this.items,
						blogNames:this.blogNames
					});
	    		})
	    	})

	    	
	    
	    })
	}

	

	render(){
		
		let num = 0;
		
		let posts = this.state.items.map((blog) =>{
			let blogName = this.state.blogNames[num];
			num++;
			return <MyBlogComp name={blogName} description={blog.description} logo={blog.blogLogo} owner={this.state.user} key={blogName} />
		})

		return(
			
			<div className="container">
			 	<section className="content-wrapper">
					<div className="row">

						
						<div className="col-sm-3 text-center">
							
							{this.user ? <Link to="/AddBlog"><button type="button" className="btn btn-primarySmall extraMargin">Start new blog</button></Link> : null}
							<Link to="/ViewBlogs"><button type="button" className="btn btn-primarySmall extraMargin">Show other blogs</button></Link>							
						</div>
						<div className="col-sm-9">
							<div className="box">
								<h2 className="text-center">My Blogs</h2>
								<div>
								
									{this.state.signInMessage}	
									{posts}
									
								</div>
							</div>	
						</div>

						
					</div>
				</section>			</div>
		)
	}

}