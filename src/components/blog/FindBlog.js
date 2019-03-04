import React, {Component} from 'react';
import {firebase} from '@firebase/app';

import {Link, withRouter} from 'react-router-dom';

import store from '../../redux/store';
import constants from '../../redux/constants';

import AutoSuggest from '../../utils/AutoSuggest'; 


class FindBlog extends Component{
		

	constructor(){
		super();
		this.state = {
			value:"",
			suggestions:[]
		}

		this.firestore = firebase.firestore();
		this.keyWordList = [];
	}

	componentWillMount(){
		window.scrollTo(0, 0);

		//clear searchTerm every time come to FindBlog page
		store.dispatch({type:constants.SAVE_BLOG_SEARCH_TERM, blogSearchTerm:undefined})
		
		let ref = this.firestore.collection("KeyWords").doc("KeyWordList").collection("list");
		
		ref.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				this.keyWordList.push(snap.data())
			})
			
			this.setState({
				keyWordList:this.keyWordList
			})
						
		})

	}

	
	
	_submitForm(e){
		e.preventDefault();

		
		let blogObj= [];

		let storeState = store.getState();
		let searchTerm = storeState.blogSearchTerm;	
		/*store.dispatch({type:constants.SAVE_BLOG_SEARCH_TERM, blogSearchTerm:undefined})*/

		// if searchTerm !exist then???
		if(searchTerm === undefined){
			console.log("no match ")
			alert("please select a keyword from the search list")
			
		}else{

			let value = searchTerm.trim().toLowerCase();
	
			let ref = this.firestore.collection("KeyWords").doc(value).collection("blogs");
			ref.get().then((snapshot)=>{
				
				snapshot.forEach((snap)=>{
				
					blogObj.push(snap.data().blogName);
						
				})
				store.dispatch({type:constants.SAVE_BLOGS, blogObj:blogObj});
				this.props.history.push("/SearchedBlogs/" + value);
			})
		}

		
	}


	

	render(){

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box">
					   		<Link to="ViewBlogs">&#60; Back to blogs</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
					   
				                	<h2>Find A Blog</h2>
				                    
				                    
				                </div>
				            </div>

				            <div className="col-sm-9">
				            	<div className="box">        
				                    <form onSubmit={this._submitForm.bind(this)} >
				                    	
				                        <h2>Search:</h2>
				                        
									     <AutoSuggest list={this.state.keyWordList} page="searchForBlog" />

									     <hr />
				                        
				                     
				                       
				                        <button type="submit" className="btn btn-primary">Submit</button>
				                       
				                    </form>
				                </div>
				            </div>
		                </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}
export default withRouter(FindBlog);