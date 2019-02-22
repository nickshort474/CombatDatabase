import React, {Component} from 'react';
import {withRouter,Link} from 'react-router-dom';
import {withFirebase} from '../Firebase';


import {_handleDisable,_handleEnable} from '../../utils/HandleDisable';


import store from '../../redux/store';
import constants from '../../redux/constants';


class NewMessage extends Component{
	
	constructor(props){
		super(props);
		
		// save cuurent page to redux
		store.dispatch({type:constants.SAVE_PAGE, page:"NewMessage/Community/null"});

		// get current user from store
		let storeState = store.getState();
		this.user = storeState.userUID;
				
		this.firestore = this.props.firebase.mainRef();

		// setup initial state
		this.state = {
			content:"",
			items:[]
			
		}
			
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
	}



	_handleInput(e){
		
		this.setState({
			[e.target.id]:e.target.value
		})

	}

	
	
	


	_handlePost(e){
		e.preventDefault();
		_handleDisable();
		// collect data

		
		let content = e.target.content.value;
		
		if(content.length > 1){
			
			// set ref for user in Messages section
			let ref = this.firestore.collection("Messages").doc(this.user).collection("Messages").doc();

			let docRef = ref.id;
			//get date time
			let now = Date.now();
			
			// create object data
			let obj = {
				
				messageContents:content,
				messageDate:now,
				messageUser:this.user,
				
			}
			//add message data to Messages section in firestore
			ref.set(obj).then(()=>{

				// add message data 
				let ownUserRef = this.firestore.collection("Users").doc(this.user).collection("Messages");

				let newObj = {
					messageDate:now,
					messageUser:this.user,
					messageLocation:docRef
				}

				ownUserRef.add(newObj).then(()=>{
					
					let messageToRef = this.firestore.collection("Users").doc(this.props.match.params.UserUID).collection("Messages");
					
					let repeatObj = {
						messageDate:now,
						messageUser:this.user,
						messageLocation:docRef
					}

					messageToRef.add(repeatObj).then(()=>{
						_handleEnable();
						this.props.history.push('/Community')
					}) 
				})
			})

		}else{
			alert("Please fill in subject and content")
		}
	}


	



	render(){

	
		return(
							
		    <div className="container">
			 	<section className="content-wrapper">
					<div className="box">
					   		<Link to="/Community">&lt; Go back</Link>
					</div>
					<div className="box">
						<div className="row">
							<h2 className="text-center">New Message to {this.props.match.params.Username}</h2>
						</div>	
					</div>	
				<form onSubmit={this._handlePost.bind(this)} action="">	
					<div className="box text-center">
						

						<div className="row form-group">
							<div className="col-sm-3">
								<label htmlFor="content">Content</label>
							</div>
							<div className="col-sm-9">
								<textarea id="content" value={this.state.content} placeholder="content" onChange={this._handleInput.bind(this)} />
							</div>
						</div>
						
					</div>
						
					<div className="box text-center">
						
						<button type="submit" value="Post message" className="btn btn-primary extraMargin">Submit</button>

						
					</div>

					
				</form>		
					
					
				</section>
			</div>
			

		)
	}
}

export default withFirebase(withRouter(NewMessage));