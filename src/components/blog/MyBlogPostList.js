import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
/*import SideBarAdvert from '../../Components/SideBarAdvert';*/

import BlogPostComp from './BlogPostComp';

import store from '../../redux/store';
import constants from '../../redux/constants';

export default class MyBlogPostList extends Component{
	
	constructor(){
		super();
		

		this.state = {
			postArray:[]
			
		}

		
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:`/MyBlogPostList/${this.props.match.params.BlogUser}/${this.props.match.params.BlogName}`});
		this._getBlogInfo();
		    
	}



	_getBlogInfo(){
		
		let firestore = firebase.firestore();
			
		let ref = firestore.collection("BlogPostList").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName);

		let postArray = [];

		ref.get().then((snapshot)=>{
		
			snapshot.forEach((element)=>{
				
				postArray.push(element.data());

			})

			this.setState({
				postArray:postArray
			});

		});


	}


	

	render(){

		let content = this.state.postArray.map((blog,index)=>{
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName} blogUser={this.props.match.params.BlogUser} imgData={blog.firstImage} date={blog.date} key={index} />
		})


		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row box">
						
							
				   		<div className="col-xs-6">
				   			<Link to="/MyBlogs">&#60; Back</Link>
				   		</div>
				   		<div className="col-xs-6 text-right">
				   			<Link to={"/AddBlogPost/" + this.props.match.params.BlogName}><button type="button" className="btn btn-primarySmall">New Post</button></Link> 
				   		</div>
						    
					   
					</div>

					<div className="row box">    
					    
							
						<div className="col-xs-12">
							
								<h2 className="text-center"> {this.props.match.params.BlogName}</h2>
								<div>
									{content}
								</div>
							
						</div>
					
					</div>
					
				</section>

			</div>


			
		)
	}
}