import React, {Component} from 'react';

import {Link,withRouter} from 'react-router-dom';


import GoogleButtonMain from '../../assets/images/google/btn_google_signin_dark_normal_web.png';
import GoogleButtonFocus from '../../assets/images/google/btn_google_signin_dark_focus_web.png';
import GoogleButtonPressed from '../../assets/images/google/btn_google_signin_dark_pressed_web.png';


import { SignUpLink } from '../SignUp';
import {SignInWithGoogle} from '../SignInWithGoogle'
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';

import LocalStorage from '../../utils/LocalStorage';

import store from '../../redux/store';

const SignInPage = () => (
  <div>
   
    <SignInForm />
    <SignInWithGoogle />
    <PasswordForgetLink />
    <SignUpLink />

  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component{
	
	
	constructor(props) {
    	super(props);

    	this.state = { ...INITIAL_STATE };
  	}
	

	componentWillMount() {
		window.scrollTo(0, 0);

	 	//this.provider = new firebase.auth.GoogleAuthProvider(); 
	 	 
	}

	_onSubmit(event){
    	const { email, password } = this.state;
    	console.log(email);
	    this.props.firebase
	      .doSignInWithEmailAndPassword(email, password)
	      .then(() => {
	        this.setState({ ...INITIAL_STATE });
	        this.props.history.push("/Home");
	      })
	      .catch(error => {
	        this.setState({ error });
	      });

	    event.preventDefault();
	};

  	onChange(event){
    	this.setState({ 
    		[event.target.id]: event.target.value 
    	});
 	};
/*
	_signInGoogle(e){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonPressed);

		// back up redux to localStorage
		var storeState = store.getState();
		LocalStorage.saveState(storeState);

		this.props.firebase.doSignInWithGoogle().then((authUser) => {
	        console.log("signed in with google!")
	        this.props.history.push("/Home");
	      })
	      .catch(error => {
	        this.setState({ error });
	      });;
		//firebase.auth().signInWithRedirect(this.provider);
		
	}

	_hoverGoogleButton(){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonFocus);
	}

	_googleButtonOut(){
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonMain);
	}*/


	/*_submitSignIn(e){
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
	}*/


	render(){

		const { email, password, error } = this.state;

    	const isInvalid = password === '' || email === '';


		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			       		                    
			              
			                <div className="col-sm-9">
			                	<div className="box registration-form">
			                    	<h2>Login</h2>
			                        <form onSubmit={this._onSubmit.bind(this)}>
			                        	<div className="form-group">
			                                <label htmlFor="login_email">Email</label>
			                                <input type="text" className="form-control" id="email" onChange={this.onChange.bind(this)} value={this.state.email} placeholder="Enter email" />
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="login_pass">Password</label>
			                                <input type="password" className="form-control" id="password"  onChange={this.onChange.bind(this)} value={this.state.password} placeholder="Password" />
			                            </div>
			                            <button type="submit" className="btn btn-primary login-btn">Login</button>
			                            <Link to="/signUp"><button className="btn btn-primary login-btn">Register</button></Link>
			                            <div className="checkbox remember"><label><input type="checkbox" /> Remember me on this computer</label></div>
			                           	{/*<a id="reset-password-toggle" className="">Did you forget your password?</a>*/}
			                        </form>
			                    </div>

			                    {error && <p>{error.message}</p>}

			                    <div className="box registration-form" id="reset-password">
			                    	<h2>Forgotten password</h2>
			                        <p>If youve forgotten your password use this form to reset your password. New password will be send to your email.</p>
			                        <form>
			                        	<div className="form-group">
			                                <label htmlFor="forg_email">Email address</label>
			                                <input type="email" className="form-control" id="forg_email" placeholder="Enter email" />
			                            </div>
			                            <button type="submit" disabled={isInvalid} className="btn btn-primary">Reset password</button>
			                        </form>
			                    </div>
			                </div>
			               {/* <div className="col-sm-3">
			                	<img src={GoogleButtonMain} id="googleButton" onClick={this._signInGoogle.bind(this)} onMouseOver={this._hoverGoogleButton.bind(this)} onMouseOut={this._googleButtonOut.bind(this)} alt="Google sign in button"/>
			                	
			                </div>
			                */}
			                
			            </div>
			        </section>
			    </div>
			   
			</div>
		)
	}

}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export { SignInForm };

export default SignInPage;