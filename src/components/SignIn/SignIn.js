import React, {Component} from 'react';

import {withRouter} from 'react-router-dom';

import GoogleButtonMain from '../../assets/images/google/btn_google_signin_dark_normal_web.png';
import GoogleButtonFocus from '../../assets/images/google/btn_google_signin_dark_focus_web.png';
import GoogleButtonPressed from '../../assets/images/google/btn_google_signin_dark_pressed_web.png';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { withFirebase } from '../Firebase';

import store from '../../redux/store';
import constants from '../../redux/constants';

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
    	
  	}
	

	componentWillMount() {
		window.scrollTo(0, 0);

	 	 
	}

	_onSubmit(event){
    	
    	const { email, password } = this.state;
    	console.log(email);

	    this.props.firebase.doSignInWithEmailAndPassword(email, password).then((authUser) => {
	       	let userUID = authUser.user.uid;
	       	this.setState({ ...INITIAL_STATE });
	        store.dispatch({type:constants.SAVE_USER, userUID:userUID});
	        this.props.history.push('/Home');

	    }).catch(error => {

	        this.setState({ error });

	    });

	    event.preventDefault();
	};

  	_onChange(event){
    	this.setState({ 
    		[event.target.id]: event.target.value 
    	});
 	};

	_signInGoogle(e){
		
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonPressed);

		this.props.firebase.doSignInWithGoogle().then((authUser) => {
			
			let userUID = authUser.user.uid;

			this._handleFirstSignIn(userUID);

	        
	        store.dispatch({type:constants.SAVE_USER, userUID:userUID});
	        this.props.history.push("/Home");

	    }).catch(error => {

	        this.setState({ error });

	    });;
		
		
	}

	_handleFirstSignIn(userUID){
		let ref = this.props.firebase.mainRef().collection("Users").doc(userUID);


		ref.get().then((snapshot)=>{
			// if user exists no need to do anything
			if(snapshot.exists){
				console.log("user already exists")
			}else{
				//else is new user so create a reference in Users collection with empty profile ref;
				ref.set({profileCreated:false})
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



	render(){

		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			       		                    
			              
			               
			                	<div className="box registration-form">
			                    	<h2 className="text-center">Login</h2>
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
			                           		<button type="submit" className="btn btn-primary login-btn">Login</button>
			                           	 	<SignUpLink />
			                            </div>
			                            {/*<div className="checkbox remember"><label><input type="checkbox" /> Remember me on this computer</label></div>*/}
			                           	
			                        </form>
			                    </div>

			                    {this.state.error && <p>{this.state.error.message}</p>}
			                   
			                    
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