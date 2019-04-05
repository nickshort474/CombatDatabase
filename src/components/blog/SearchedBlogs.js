import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';
import SearchedBlogComp from './SearchedBlogComp';

/*import SideBarAdvert from '../../Components/SideBarAdvert';*/
import store from '../../redux/store';
import constants from '../../redux/constants';

export default class Searchedlogs extends Component{
	
	
	constructor(){
		super();

		

		this.state = {
			items:[]
		}

	}
		
	componentWillMount() {
		window.scrollTo(0, 0);

		let pageToSave = "/SearchedBlogs/" + this.props.match.params.SearchTerm;
		store.dispatch({type:constants.SAVE_PAGE, page:pageToSave});
		
		let storeState = store.getState();
		let blogs = storeState.blogObj;
		
		this.setState({
			value:this.props.match.params.SearchTerm
		});	
		this.items = [];
		
		blogs.forEach((blog) =>{
				
			// for each snap connect to BlogNames DB and gather info
			let firestore = firebase.firestore();
			
			let ref = firestore.collection("BlogNames").doc(blog);
			
			ref.get().then((snapshot)=>{
				
				this.items.push(snapshot.data());
				this.setState({
					items:this.items
				});	
			})
			
			
    	})
    
			

	    
	}

	render(){

		let blogs = this.state.items.map((blog)=>{
			return <SearchedBlogComp  type={blog.type} blogName={blog.name} description={blog.description} blogUser={blog.user} blogLogo={blog.blogLogo} searchTerm={this.props.match.params.SearchTerm} key={blog.name} />
		})

		return(
			
			<div className="container">
			 	<section className="content-wrapper">
					<div className="box">
					   		<Link to="/FindBlog">&#60; Back</Link>
					    </div>

					<div className="row">

						
						<div className="col-xs-12">
							<div className="box">
								<h3 className="text-center">Search results : {this.state.value}</h3>
								
								<div>
									
									{blogs}

								</div>
							</div>	
						</div>
						
					</div>
				</section>
			</div>
		)
	}

}