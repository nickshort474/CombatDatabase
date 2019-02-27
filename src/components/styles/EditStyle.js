import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import LocalStorage from '../../utils/LocalStorage';



class EditStyle extends Component{
	
	constructor(){
		super();
		

		this.state = {
			content:"",
			newContent:"",
			buttonText:""
		}
		this.firestore = firebase.firestore();
		this.user = LocalStorage.loadState("user");

	}

	componentWillMount(){
		
		window.scrollTo(0, 0);
		
		
	}
	componentDidMount(){
		
		
		if(this.user){
			let ref = this.firestore.collection("Users").doc(this.user);
			ref.get().then((snapshot)=>{
				this.userName = snapshot.data().userName;
			})

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

	_handleStyle(e){
		this.setState({
			content:e.target.value
		})
	}



	_editStyle(e){
		if(this.state.content > 4){
			_disable();
			
			let ref = this.firestore.collection("Styles").doc(this.props.match.params.Style);

			let category = this.props.match.params.Category;
			
			let newString = category.charAt(0) + category.slice(1);

			let withoutWhitespace = newString.replace(" ", "");
		
			
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

			ref2.add(obj).then(()=>{
				_enable()
				this.props.history.push('/Styles');
			});


		}else{
			alert("please add some information to the category")
		}
		
		

		
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