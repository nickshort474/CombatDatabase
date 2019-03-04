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
		store.dispatch({type:constants.SAVE_PAGE, page:`MyBlogPostList/${this.props.match.params.BlogUser}/${this.props.match.params.BlogName}`});
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
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName} owner={this.props.match.params.BlogUser} imgData={blog.firstImage} date={blog.date} key={index} />
		})


		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to="/MyBlogList">&#60; Back to blog listing</Link>
						    </div>
					    </div>
					</div>

					<div className="row">    
					    
							
						<div className="col-sm-9">
							<div className="box">
								<h2 className="text-center"> {this.props.match.params.BlogName} posts</h2>
								<div>
									{content}
								</div>
							</div>
						</div>
						<div className="col-sm-3">
							
							<div className="box sidebar-box">
								<Link to={"/AddBlogPost/" + this.props.match.params.BlogName}><button type="button" className="btn btn-primary">New Post</button></Link><br /> 
							</div>

							
							
						</div>
					</div>
					
				</section>

			</div>


			
		)
	}
}