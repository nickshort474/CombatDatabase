import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';
import $ from 'jquery';

import {_disable,_enable} from '../../utils/DisableGreyOut';

import store from '../../redux/store';
import constants from '../../redux/constants';

export default class Signup extends Component{
	
	constructor(){
		super();
		this.state = {
			regEmail:"",
			regUsername:"",
			regPassword1:"",
			regPassword2:""

		}
	}
	componentWillMount(){
		window.scrollTo(0, 0);

	}
	
	_handleInput(e){
				
		this.setState({
			[e.target.id]:e.target.value
		})

		$(`#${e.target.id}`).removeClass('formError');
	}



	_submitSignUp(e){
		e.preventDefault();
		_disable()
		/*this.email = e.target.regEmail.value;
		this.password = e.target.regPassword.value;
		let username = e.target.regUsername.value;*/


		let errorMsgs = this._validate(this.state.regEmail,this.state.regUsername,this.state.regPassword1,this.state.regPassword2);
		if(errorMsgs.length > 0){
			let msgComp = errorMsgs.map((msg,index)=>{
				
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})
			let formattedComp = <div className="box">{msgComp}</div>
			this.setState({
				errors:formattedComp
			})
			
			_enable();
		}else{
			console.log("can be submitted");
			// check database for existing usernames...
			this._checkForExistingUsername();
		}
		
		
		
		
	}

	_checkForExistingUsername(){
		
		let firestore = firebase.firestore();
		let ref = firestore.collection('userUIDs');
		let query = ref.where("userName", "==",this.state.regUsername);
		
		let match = false;

		query.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				if(snap){
					alert(snap.data().userName + " already exists please try another user name");
					match = true;
					_enable();
				}
			})
		}).then(()=>{
			if(!match){

				//else save username to redux for use in initial account setup
				store.dispatch({type:constants.SAVE_USERNAME, userName:this.state.regUsername})
				this._createUser();
				
			}
		})
	}

	_createUser(){
		firebase.auth().createUserWithEmailAndPassword(this.state.regEmail, this.state.regPassword1).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode);
		  console.log(errorMessage);

		  // ...
		});
	}

	_validate(email, username, password1, password2){
		
		//store error messages in array
		const errorMsgs = [];

		let isValidEmail = this._isValidEmail(email);
		 	
		

		if (!isValidEmail) {
		   errorMsgs.push("Please provide a valid email address");
		   $('#regEmail').addClass('formError');
		}

		if (username.length < 1) {
		   errorMsgs.push("Please provide a user name");
		    $('#regUsername').addClass('formError');
		}
		if (password1.length < 6) {
		   errorMsgs.push("Please provide a password of at least 6 characters in length");
		   $('#regPassword1').addClass('formError');
		}
		if (password2 !== password1) {
		   errorMsgs.push("Passwords don't match");
		   $('#regPassword2').addClass('formError');
		}
  		return errorMsgs;
	}

	_isValidEmail(email){
		if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
			return true
		}else{
			$('#regEmail').removeClass('formError');
			return false
		}

	}


	render(){
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			            	
			                
			               
			                <div className="col-sm-12">
			                	<div className="box registration-form">
			                    	<h2>Registration</h2>
			                        <p>Create your new account here. Already have an account with us or Google? Then you can <Link to="SignIn">sign in</Link> with your existing username and password.</p>
			                        
			                        <form onSubmit={this._submitSignUp.bind(this)}>
			                        	
			                            <div className="form-group">
			                                <label htmlFor="reg_email">Email address</label>
			                                <input type="email" className="form-control" id="regEmail" value={this.state.regEmail} placeholder="Enter email" onChange={this._handleInput.bind(this)}/>
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="reg_username">Username</label>
			                                <input type="username" className="form-control" id="regUsername" value={this.state.regUsername} placeholder="Enter username" onChange={this._handleInput.bind(this)}/>
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="reg_pass1">Password</label>
			                                <input type="password" className="form-control" id="regPassword1" value={this.state.regPassword1} placeholder="Password" onChange={this._handleInput.bind(this)}/>
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="reg_pass2">Password again</label>
			                                <input type="password" className="form-control" id="regPassword2" value={this.state.regPassword2} placeholder="Password" onChange={this._handleInput.bind(this)} />
			                            </div>
			                            {this.state.errors}


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