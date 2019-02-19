import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';



export default class MySingleBlogPost extends Component{
	
	constructor(){
		super();
		var style = {
			height:"50%",
			width:"50%",
			display:"block"
		}

		this.state = {
			blogPara:[],
			blogImgs:[],
			imgStyle:style,
			user:""
		}
		
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		this._getBlogInfo();
		
	}

	_getBlogInfo(){
		
		let firestore = firebase.firestore();
		
		let ref = firestore.collection("Blogs").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("contentBlocks").orderBy("time");

		let dataArray = [];

		

		ref.get().then((snapshot)=>{
			
			snapshot.forEach((element)=>{
				
				dataArray.push(element.data());
			})

			this.setState({
				blogPara:dataArray
			})
		})


	    
	}
		

	render(){

		
		let content = this.state.blogPara.map((con)=>{
			
			
			if(con.type === "img"){
				return <div key={con.data} ><img style={this.state.imgStyle}  id='base64image' src={con.data} alt=""/><br /></div>
			}else{
				return <div key={con.data}>{con.data}<br /><br /></div>
			}
			
		})

		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to={"/MyBlogPostList/" + this.props.match.params.BlogUser +  "/" + this.props.match.params.BlogName}>&#60; Back to posts</Link>
						    </div>
					    </div>

					</div>

					<div className="row">
						
						<div className="col-sm-9">
							
							
							<div className="box">
								{content}
							</div>
							
						</div>
						<div className="col-sm-3">
							<div className="box">
							</div>
						</div>
						

						
					</div>
				</section>





			</div>

		)
	}
}