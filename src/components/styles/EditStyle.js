import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';



class EditStyle extends Component{
	
	constructor(){
		super();
		

		this.state = {
			content:"",
			newContent:"",
			buttonText:""
		}
		this.firestore = firebase.firestore();
		

	}

	componentWillMount(){
		
		window.scrollTo(0, 0);
		
		
	}
	componentDidMount(){
		this.storeState = store.getState();
		this.user = this.storeState.userUID;
		
		
		let ref = this.firestore.collection("userUIDs").doc(this.user);
		
		ref.get().then((snapshot)=>{
			this.userName = snapshot.data().userName;
		})

		if(this.user){
			
			this._gatherEditInfo();
			this.disabled = false;
			this.setState({
				buttonText:"Cancel Changes"
			})
			
		}else{
			this.setState({
				content:"Please sign in",
				buttonText:"Go Back"
			})
			this.disabled = true;
			
		}

	}


	_gatherEditInfo(){
		
		let ref = this.firestore.collection("Styles").doc(this.props.match.params.Style);
		console.log(this.props.match.params.Category)

		

		ref.get().then((snapshot)=>{
			console.log(snapshot.data())

			this.setState({
				content:snapshot.data()[this.props.match.params.Category]
			})
		})
		
	}

	_handleStyle(event){
		this.setState({
			content:event.target.value
		})
	}



	_editStyle(event){
		
		event.preventDefault();
		let ref = this.firestore.collection("Styles").doc(this.props.match.params.Style);

		let category = this.props.match.params.Category;
		console.log(category);
		let newString = category.charAt(0) + category.slice(1);
		let withoutWhitespace = newString.replace(" ", "");
		console.log(withoutWhitespace);
		//let categoryString  = category.toString();
		let catObj = {};
		catObj[withoutWhitespace] = this.state.content;
		
		ref.update(catObj);
				
		let ref2 = this.firestore.collection("StyleHistory").doc(this.props.match.params.Style).collection("changes");
		
		
		let obj = {
			Category:this.props.match.params.Category,
			Date:Date.now(),
			Editor:this.user,
			EditorName:this.userName
		}

		ref2.add(obj);
		this.props.history.push('/Styles');

		
	}


	render(){
		let styles = {
			width:"100%"
		}

		return(
			<div className="container">
				<div className="content-wrapper">
					
					<div className="box">
						<Link to="/Styles">&lt; Go back</Link>
					</div>
					<div className="box">

						

						<div className="text-center">
							<h2>{this.props.match.params.Style}</h2>
							<h2>{this.props.match.params.Category}</h2>
						</div>

						<div className="text-center">
							<textarea id="style" onChange={this._handleStyle.bind(this)} value={this.state.content} style={styles} ></textarea>
						</div>

						
						
						<div className="text-center">
							<button className="btn-primary" disabled={this.disabled} onClick={this._editStyle.bind(this)}>Save Changes</button>
							
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default withRouter(EditStyle);