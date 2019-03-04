import React, {Component} from 'react';
import firebase from '@firebase/app';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';

import GoogleButtonMain from '../../assets/images/google/btn_google_signin_dark_normal_web.png';
import GoogleButtonFocus from '../../assets/images/google/btn_google_signin_dark_focus_web.png';
import GoogleButtonPressed from '../../assets/images/google/btn_google_signin_dark_pressed_web.png';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { withFirebase } from '../Firebase';
import {_disable, _enable} from '../../utils/DisableGreyOut';


import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';

const SignInPage = () => (
  	<div>
   
   		<SignInForm />
   
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
    	this.cursorStyle = {
    		cursor: "pointer"
    	}
    	let storeState = store.getState();
    	if(storeState.page !== ""){
    		this.prevPage = storeState.page;
    	}else{
    		this.prevPage = "/Home";
    	}
    	
  	}
	

	componentWillMount() {
		window.scrollTo(0, 0);

	 	 
	}

	_onChange(e){
    	this.setState({ 
    		[e.target.id]: e.target.value 
    	});
    	$(`#${e.target.id}`).removeClass('formError');
	
 	};

	_onSubmit(e){
    	e.preventDefault();
		_disable();
		let errors = this._validate();

		if(errors.length > 0){
			let msgComp = errors.map((msg,index)=>{
				
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})
			let formattedComp = <div className="box">{msgComp}</div>
			this.setState({
				errors:formattedComp
			})
			
			_enable();
		}else{
	    	const { email, password } = this.state;
	    	

		    this.props.firebase.doSignInWithEmailAndPassword(email, password).then((authUser) => {
		       	let userUID = authUser.user.uid;
		       	
		       	//clear  state
		       	this.setState({ ...INITIAL_STATE });
		       
		        //save reference to user in localStoarge to match google auth state
		        LocalStorage.saveState("user",userUID);
		        LocalStorage.saveState("token","password");

		       	//store.dispatch({type:constants.SAVE_USER,userUID:userUID})
		       	_enable();
		        this.props.history.push(this.prevPage);

		    }).catch(error => {
		    	_enable();

		        this.setState({
		        	error:error,
		        	password:"",
		        	errors:""
		        });

		    });
		}
	    
	};

  	

	_signInGoogle(e){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonPressed);

		this.props.firebase.doSignInWithGoogle().then((authUser) => {
			
			let userUID = authUser.user.uid;
			
			this._handleFirstSignIn(userUID);

			//save reference to user in localStoarge to match google auth state
			LocalStorage.saveState("user",userUID);
			LocalStorage.saveState("token",authUser.credential.accessToken)
	        //store.dispatch({type:constants.SAVE_USER,userUID:userUID})
	        this.props.history.push(this.prevPage);

	    }).catch(error => {

	        this.setState({ error });

	    });;
		
		
	}

	_handleFirstSignIn(userUID,username){
		let ref = firebase.firestore().collection("Users").doc(userUID);


		ref.get().then((snapshot)=>{
			// if user exists no need to do anything
			if(snapshot.exists){
				console.log("user already exists")
			}else{
				//else is new user so create a reference in Users collection with empty profile ref;
				ref.set({
					profileCreated:false
				})
			}
		})

	}


	_hoverGoogleButton(){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonFocus);
		
	}

	_googleButtonOut(){
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonMain);

	}

	_validate(){
		
		//store error messages in array
		const errorMsgs = [];


		if (!this._isValidEmail()) {
		   errorMsgs.push("Please provide a valid email address");
		   $('#email').addClass('formError');
		}

		
		if (this.state.password.length <= 0) {
		   errorMsgs.push("Please provide a password");
		   $('#password').addClass('formError');
		}
		
  		return errorMsgs;
	}

	_isValidEmail(){
		if( /(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email) ){
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
			            
			       		                    
			              
			               
			                	<div className="box registration-form">
			                    	<h2 className="text-center">Sign in</h2>
			                        <form onSubmit={this._onSubmit.bind(this)}>
			                        	<div className="form-group">
			                                <label htmlFor="login_email">Email</label>
			                                <input type="text" className="form-control" id="email" onChange={this._onChange.bind(this)} value={this.state.email} placeholder="Enter email" />
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="login_pass">Password</label>
			                                <input type="password" className="form-control" id="password"  onChange={this._onChange.bind(this)} value={this.state.password} placeholder="Password" />
			                            </div>
			                            <div className="text-center">
			                           		<button type="submit" className="btn btn-primary login-btn">Sign In</button>
			                           	 	<SignUpLink />
			                           	 	<br />
			                           	 	<br />
			                           	 	{this.state.errors}<br />
			                           	 	{this.state.error && <p>{this.state.error.message}</p>}
			                            </div>
			                            {/*<div className="checkbox remember"><label><input type="checkbox" /> Remember me on this computer</label></div>*/}
			                           	
			                        </form>
			                    </div>

			                    
			                   
			                    
			            </div>
			            <div className="row">
			            	<div className="box text-center">   
			                	<img src={GoogleButtonMain} style={this.cursorStyle} id="googleButton" onClick={this._signInGoogle.bind(this)} onMouseOver={this._hoverGoogleButton.bind(this)} onMouseOut={this._googleButtonOut.bind(this)} alt="Google sign in button"/>
			                </div>
			            </div>
			            <div className="row text-center">
			            	<PasswordForgetLink />    	
			            </div>  
			                
			                
			           
			        </section>
			    </div>
			   
			</div>
		)
	}

}

const SignInForm = withRouter(withFirebase(SignInFormBase));

/*export { SignInForm };*/

export default SignInPage;