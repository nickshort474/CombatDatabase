import React, {Component} from 'react';
import {Link,HashRouter} from 'react-router-dom';

import {firebase} from '@firebase/app';
import '@firebase/auth';


import $ from 'jquery';
import Routes from './Routes';


import store from './redux/store';
import constants from './redux/constants';
//import LocalStorage from './Components/LocalStorage';


import 'font-awesome/css/font-awesome.min.css';


var config = {
		    apiKey: "AIzaSyCnDIbI8tiFRvchuoXHV07PIce3enlWu60",
		    authDomain: "combatdatabase-c474n.firebaseapp.com",
		    databaseURL: "https://combatdatabase-c474n.firebaseio.com",
		    projectId: "combatdatabase-c474n",
		    storageBucket: "combatdatabase-c474n.appspot.com",
		    messagingSenderId: "566494010270"
		};
firebase.initializeApp(config);


//stop firestore warning for timestamps
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true}; 
firestore.settings(settings);


window.addEventListener("beforeunload",function(event){
  	console.log("please");
});

export default class Main extends Component{
	
	constructor(){
		super();

		
		this.state = {
			signText:"Sign in",
			profile:"",
			register:<Link to="/SignUp" className="btn btn-primary"  data-target=".navbar-collapse">Sign Up</Link>
		}

		this.nameStyle = {
			color:'red'
		}

		var storeState = store.getState();
		this.savedPage = storeState.page;

		//dismiss drop down menu on mobile screens
		$(document).on('click','.navbar-collapse.in',function(e) {
		    if( $(e.target).is('a:not(".dropdown-toggle")') ) {
		        $(this).collapse('hide');
		    }
		});


	
	}

	componentDidMount(){
		
		// get redirect result 
		firebase.auth().getRedirectResult().then( (result) => {
		  	
			
		  	if (result.credential) {
			    // This gives you a Google Access Token. You can use it to access the Google API.
			    //var token = result.credential.accessToken;
			    // ...
			    //let user = result.user;
			    // User is signed in.
		    	/*this.setState({profile:<Link to="Profile" className="btn btn-primary"  data-target=".navbar-collapse">Profile</Link>, register:"", signText:"Sign out"});
		    	store.dispatch({type:constants.SAVE_USER, userUID:user.uid});*/
			   	
			}else{
				//this.setState({signText:"Sign out"})
				//this._createUserDatabase(user);
			}

		}).catch(function(error) {
		  	// Handle Errors here.
		  	//var errorCode = error.code;
		  	//var errorMessage = error.message;

		  	

		  	// The email of the user's account used.
		  	//var email = error.email;
		  	// The Firebase.auth.AuthCredential type that was used.
		  	//var credential = error.credential;
		  	
		  	// ...
		});  





		firebase.auth().onAuthStateChanged((user) => {
		    

			if(user){
				firebase.firestore().collection("userUIDs").doc(user.uid).get().then((snap)=>{
					if(snap.exists){
						
						this.setState({
							profile:<Link to="/Profile" className="btn btn-primary"  data-target=".navbar-collapse">Profile</Link>, register:"",
						    signText:"Sign out",

						});
						store.dispatch({type:constants.SAVE_USER, userUID:user.uid})
						/*store.dispatch({type:constants.SAVE_USERNAME, userName:snap.data().})*/

					}else{
						console.log("need to add user to database");

						
						this.setState({
							profile:<Link to="/Profile" className="btn btn-primary"  data-target=".navbar-collapse">Profile</Link>, register:"",
						    signText:"Sign out",

						});

						store.dispatch({type:constants.SAVE_USER, userUID:user.uid});
		    			//store.dispatch({type:constants.SAVE_USERNAME, userName:userName});

						this._createUserDatabase(user);
					}
				})
			}else{
				console.log("existing user signing in")
			}


		})	




			/*
		    let userName;
		    console.log(user);
		    if (user) {
		    	
		    	// get userName for later use
		    	firebase.firestore().collection("userUIDs").doc(user.uid).get().then((snap)=>{
		    		
		    		userName =  snap.data().userName;

		    		// User is signed in.
		    		this.setState({profile:<Link to="/Profile" className="btn btn-primary"  data-target=".navbar-collapse">Profile</Link>, register:"", signText:"Sign out"});
		    		store.dispatch({type:constants.SAVE_USER, userUID:user.uid});
		    		store.dispatch({type:constants.SAVE_USERNAME, userName:userName});

		    		//let storeState = store.getState();
		    		//LocalStorage.saveState(storeState);


		    		this.setState({signText:"Sign out"})
					this._createUserDatabase(user);
		    	})

		    	
				

		    } else {
		   		// No user is signed in.
		   		this.setState({profile:"", register:<Link to="/SignUp" className="btn btn-primary signupBtn" data-toggle="collapse" data-target=".navbar-collapse" >Register</Link>});
		  	}
		});*/

		 

	}



	/*_createUserDatabase(user){
		
		
		let docRef = firestore.collection("userUIDs").doc(user.uid);


		docRef.get().then((snapshot)=>{
			
			if(snapshot.exists){
				
				window.location = `#/${this.savedPage}`;
			}else{
				this._createUser(user);
			}
		}).catch((error)=>{
			
		})


		
	}*/

	_createUserDatabase(user){
		
		console.log(user.email)
		console.log(user.uid);
		
		//get username from redux to save to userUIDs
		let storeState = store.getState()
		let userName = storeState.userName;


		let userObject = {
			profileCreated:false,
			userEmail:user.email,
			userName:userName
		}

		let ref = firestore.collection("userUIDs").doc(user.uid);

		ref.set(userObject).then((result)=>{
			
			//props.history.push not working after alert
			
		});
		this.props.history.push('/Home');
		
	}


	_signOut(event){
		
		

		if(this.state.signText === "Sign out"){
			event.preventDefault();	
			firebase.auth().signOut().then(() => {
  				// Sign-out successful.
  				this.setState({
  					signText:"Sign in",
  					profile:"",
  					register:<Link to="/SignUp" className="btn btn-primary"  data-target=".navbar-collapse">Sign Up</Link>
  				});

  				//remove userUID from redux
  				store.dispatch({type:constants.REMOVE_USER});
  			}, function(error) {
  				// An error happened.
			});
		}
		
		
		
	}




	render(){

		

		return(

		
			

			<HashRouter>
				
				<div>
				<header className="navbar navbar-default navbar-fixed-top">
			    	<div className="container">
			            <div className="navbar-header">
			            	<Link to="/" className="navbar-brand visible-xs">CombatDB </Link>
			                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"  aria-expanded="false"><i className="fa fa-bars"></i></button>
			            </div>

			            <div className="collapse navbar-collapse" >
			            	<ul className="nav navbar-nav">
			                	
			                	<li><Link to="/" data-target=".navbar-collapse">Home</Link></li>
			                	<li><Link to="/BusinessPage" data-target=".navbar-collapse">Business</Link></li>
			                   {/* <li><Link to="/Community" data-target=".navbar-collapse">Community</Link></li>*/}
			                    <li><Link to="/Events" data-target=".navbar-collapse">Events</Link></li>
			                    <li><Link to="/Styles" data-target=".navbar-collapse">Styles</Link></li>
								<li><Link to="/ViewBlogs" data-target=".navbar-collapse">Blogs</Link></li>
								{/*<li className="dropdown">
						          	<a href="/Community" className="dropdown-toggle" data-toggle="dropdown" data-target=".navbar-collapse" role="button" aria-haspopup="true" aria-expanded="false">New Community<span className="caret"></span></a>
						          	<ul className="dropdown-menu">
						          		<li><Link to="/Community" data-target=".navbar-collapse">Community</Link></li>
						          		<li><Link to="/FindPeople" data-target=".navbar-collapse">Find People</Link></li>
						          		<li><Link to="/ContactsList" data-target=".navbar-collapse">Contacts List</Link></li>
						           		
						            	
						          	</ul>
						        </li>*/}
			                </ul>
			                <div className="pull-right navbar-buttons">
			                	{this.state.register}
			                	<Link to="/Signin" className="btn btn-inverse signinBtn" onClick={this._signOut.bind(this)} data-toggle="collapse" data-target=".navbar-collapse">{this.state.signText}</Link>
			                    {this.state.profile}
			                   
			                </div>
			            </div>
			        </div>
			    </header>


			    
			    <div className="container hidden-xs container-less-padding">
    				<div className="header-title">
        				<div className="pull-left">
        					<h2><Link to="Home"><span className="text-primary">Combat</span>DB</Link></h2>
               				<p>The number 1 self defence, martial arts and combat resource</p>
            			</div>
       				</div>
    			</div>


    			
    			<Routes />
		    	
			    

			   
			    <footer className="navbar navbar-default">
			    	<div className="container">
			        	<div className="row">
			            	<div className="col-md-6 hidden-xs">
			                	<ul className="nav navbar-nav">
			                        <li><Link to="/Contact">Contact Us</Link></li>
			                        <li><Link to="/About us">About us</Link></li>
			                        <li><Link to="/Profile">Profile</Link></li>
			                        <li><Link to="/Privacy">Privacy Policy</Link></li>
			                        
			                    </ul>
			                </div>
			                <div className="col-sm-6">
			                	<p className="copyright">© <span className="text-14"><span style={this.nameStyle}>Combat</span>DB</span> All rights reserved</p>
			                	
			                </div>
			            </div>
			         </div>   
			     </footer>
			    

			   </div> 
			</HashRouter>
			
		)
	}






}

