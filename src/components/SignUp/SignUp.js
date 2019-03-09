import React, {Component} from 'react';
import { withRouter, Link} from 'react-router-dom';

import {withFirebase} from '../Firebase';
import firebase from '@firebase/app';
import $ from 'jquery';

import {_disable,_enable} from '../../utils/DisableGreyOut';

/*import store from '../../redux/store';
import constants from '../../redux/constants';*/
import LocalStorage from '../../utils/LocalStorage';


const SignUpPage = () => (
	<div>
		<SignUpForm />
	</div>
)

const INITIAL_STATE = {
	regEmail:"",
	regUsername:"",
	regPassword1:"",
	regPassword2:"",
	error:null,
	termsClicked:false
}



class SignUpFormBase extends Component{
	
	constructor(props){
		super(props);
		this.state = { ...INITIAL_STATE };

		this.firestore = firebase.firestore();
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

	_handleTerms(){
		if(this.state.termsClicked){
			console.log("true");
			this.setState({
				termsClicked:false
			})

			$('#terms').addClass('formError');

		}else{

			this.setState({
				termsClicked:true
			})

			$('#terms').removeClass('formError');
		}

		
	}



	_submitSignUp(e){
		e.preventDefault();
		_disable()
		

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
			
			// check database for existing usernames...
			this._checkForExistingUsername();
		}
		
		
		
		
	}

	_checkForExistingUsername(){
		
		
		let ref = this.firestore.collection('Users');
		let query = ref.where("userName", "==",this.state.regUsername);
		
		let match = false;

		query.get().then((snapshot)=>{
			console.log(snapshot);
			snapshot.forEach((snap)=>{
				console.log(snap.data())
				if(snap){
					alert(snap.data().userName + " already exists please try another user name");
					match = true;
					_enable();
				}
			})
		}).then(()=>{
			console.log(match);
			if(!match){

				//else save username to redux for use in initial account setup
				
				//store.dispatch({type:constants.SAVE_USERNAME, userName:this.state.regUsername})
				console.log("about to create user");
				this._createUser();
				
			}
		})
	}

	_createUser(){
		
		console.log("trying to created user with email");
		
		this.props.firebase.doCreateUserWithEmailAndPassword(this.state.regEmail,this.state.regPassword1).then((authUser)=>{
			
			console.log("have created user with email");
			
			
			let userUID = authUser.user.uid;
			LocalStorage.saveState("user",userUID);
			//store.dispatch({type:constants.SAVE_USER, userName:userUID})
			

			this._createUserInFirebase(userUID);


			
		}).catch((error)=>{
			this.setState({
				error:error
			})
		})
		
	}

	_createUserInFirebase(userUID){
		console.log("trying to create user in firestore");
		

		let ref = this.firestore.collection("Users").doc(userUID);
		
		let obj = {
			userName:this.state.regUsername,
			userEmail: this.state.regEmail,
			profileCreated:false
		}
		ref.set(obj).then(()=>{

			//create reference to username in usernames section for esy people search functionality  
			let ref2 = this.firestore.collection("Usernames").doc(this.state.regUsername);
			let obj2 = {uid:userUID};
			ref2.set(obj2).then(()=>{
				//clear state and form
				this.setState({
					...INITIAL_STATE
				})
				this.props.history.push('/Home');
			})
			
		})
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
		if(!this.state.termsClicked){
			errorMsgs.push("Please agree to our terms and conditions");
		   	$('#terms').addClass('formError');
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
			                    	<h2 className="text-center">Registration</h2>
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
			                           
			                            <div className="text-center">
			                            	<p id="terms"><input type="checkbox"  onClick={this._handleTerms.bind(this)} /> I agree to the <Link to="/Terms">Terms and Conditions</Link> and <Link to="/Privacy">Privacy Policy</Link></p>
			                            	<button type="submit" className="btn btn-primary">Submit</button>
			                            	 {this.state.errors}
			                            </div>
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

const SignUpLink = () => (
	
	<Link to={"/SignUp"}><button className="btn btn-primary">Sign Up</button></Link>
	
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink};