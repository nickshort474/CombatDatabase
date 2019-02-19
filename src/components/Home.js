import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import store from '../redux/store';
import constants from '../redux/constants';


export default class Home extends Component{
	

	constructor(){
		super();
		store.dispatch({type:constants.SAVE_PAGE, page:"Home"});
		console.log("home constructor");
		this.nameStyle = {
			color:'red'
		}
		this.linkStyle = {
			color:'white'
		}
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}



	
	render(){

		return(
			
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			        		<div className="col-xs-12 col-sm-8">
			        			<div className="box">	
				        			<p><span className="text-18"><span style={this.nameStyle}>Combat</span>DB</span> is aiming to be the number one resource for martial artists, self defence practitioners and fitness enthusiasts all over the world. 
				        			Our mission to build a community driven resource with a range a growing features.</p> 
				        			
			        			</div>
			        		</div>

			        		<div className="col-xs-12 col-sm-4">
			        			<div className="box">
	        					
			        				<div style={this.linkStyle}>
										<Link to="/BusinessPage">Business Listings</Link><p className="text-10">Clubs, shops and other businesses</p> 
			        				</div>
			        				<div style={this.linkStyle}>
										<Link to="/Community">Community</Link><p className="text-10">Make connections, send messages, build your community</p> 
			        				</div>
			        				<div style={this.linkStyle}>
			        					<Link to="/Events">Events</Link><p className="text-10">Event listings</p> 
			        				</div>
			        				<div style={this.linkStyle}>
										<Link to="/Styles">Styles</Link><p className="text-10">Database of styles</p> 	
			        				</div>
			        				{/*<div style={this.linkStyle}>
										<Link to="/Blogs">Blogs</Link><p className="text-10">Share your views, opinions and thoughts</p> 
			        				</div>*/}
			        				<div style={this.linkStyle}>
			        					<Link to="/Contact">Contact</Link><p className="text-10">Get in contact, problems, issues or suggestions</p> 
			        				</div>
			        				<div style={this.linkStyle}>
			        					<Link to="/Profile">Profile</Link><p className="text-10">Check your profile, update and add more details</p> 
			        				</div>
			        				<div style={this.linkStyle}>
			        					<Link to="/Privacy">Privacy Policy</Link><p className="text-10">Your rights</p> 
			        				</div>
			        				<div style={this.linkStyle}>
			        					<Link to="/AboutUs">About Us</Link><p className="text-10">Our team</p> 
			        				</div>

		        				</div>
			        		</div>
			        	</div>

		        		
			        </section>
			    </div>
			

		)
	}
}