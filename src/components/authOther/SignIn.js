import React, {Component} from 'react';
import { firebase } from '@firebase/app';
import {Link} from 'react-router-dom';
import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';

import GoogleButtonMain from '../../assets/images/google/btn_google_signin_dark_normal_web.png';
import GoogleButtonFocus from '../../assets/images/google/btn_google_signin_dark_focus_web.png';
import GoogleButtonPressed from '../../assets/images/google/btn_google_signin_dark_pressed_web.png';



export default class Signin extends Component{
	
	constructor(){
		super();

		this.state = {
	 		canClick:false,
	 	}

	 	
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);

	 	this.provider = new firebase.auth.GoogleAuthProvider(); 
	 	 
	}

	

	_signInGoogle(e){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonPressed);

		/*// back up redux to localStorage
		var storeState = store.getState();
		LocalStorage.saveState(storeState);*/
		
		firebase.auth().signInWithRedirect(this.provider);
		
	}

	_hoverGoogleButton(){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonFocus);
	}

	_googleButtonOut(){
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonMain);
	}


	_submitSignIn(e){
		e.preventDefault();

		let email = e.target.loginEmail.value;
		let password = e.target.loginPassword.value;

		console.log(email);
		console.log(password);

		
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode);
		  alert(errorMessage);
		  // ...


		});
	}


	render(){

		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			       		                    
			              
			                <div className="col-sm-9">
			                	<div className="box registration-form">
			                    	<h2>Login</h2>
			                        <form onSubmit={this._submitSignIn.bind(this)}>
			                        	<div className="form-group">
			                                <label htmlFor="login_email">Email</label>
			                                <input type="text" className="form-control" id="loginEmail" placeholder="Enter email" />
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="login_pass">Password</label>
			                                <input type="password" className="form-control" id="loginPassword" placeholder="Password" />
			                            </div>
			                            <button type="submit" className="btn btn-primary login-btn">Login</button>
			                            <Link to="/signUp"><button className="btn btn-primary login-btn">Register</button></Link>
			                            <div className="checkbox remember"><label><input type="checkbox" /> Remember me on this computer</label></div>
			                           	{/*<a id="reset-password-toggle" className="">Did you forget your password?</a>*/}
			                        </form>
			                    </div>
			                    
			                    <div className="box registration-form" id="reset-password">
			                    	<h2>Forgotten password</h2>
			                        <p>If youve forgotten your password use this form to reset your password. New password will be send to your email.</p>
			                        <form>
			                        	<div className="form-group">
			                                <label htmlFor="forg_email">Email address</label>
			                                <input type="email" className="form-control" id="forg_email" placeholder="Enter email" />
			                            </div>
			                            <button type="submit" className="btn btn-primary">Reset password</button>
			                        </form>
			                    </div>
			                </div>
			                <div className="col-sm-3">
			                	<img src={GoogleButtonMain} id="googleButton" onClick={this._signInGoogle.bind(this)} onMouseOver={this._hoverGoogleButton.bind(this)} onMouseOut={this._googleButtonOut.bind(this)} alt="Google sign in button"/>
			                	
			                </div>
			                
			                
			            </div>
			        </section>
			    </div>
			   
			</div>
		)
	}

}