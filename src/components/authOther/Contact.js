import React, {Component} from 'react';
import store from '../../redux/store';
import constants from '../../redux/constants';
import {withRouter} from 'react-router';


class Contact extends Component{
	
	constructor(){
		super();

		store.dispatch({type:constants.SAVE_PAGE, page:"Contact"});

	}
	componentWillMount(){
		window.scrollTo(0, 0);
	}

	componentDidMount(){


		let form = document.getElementById("form");
		form.addEventListener("submit",(e) => {

			this.props.history.push('/Response');

		});
	}

	
	
	render(){
		return(
			<div>
				<div className="container"> 
					<div className="content-wrapper">
						<h2>Contact Us</h2>
						
						<div>
							<p>Please complete this enquiry form and we will aim to respond to you within three working days.</p>
							<p>All the fields marked with an asterisk (*) are mandatory.</p>
						</div>
					
						<iframe name="votar" style={{display:"none"}} title="contact form" ></iframe>

						<form method="POST" id="form" action="form_email.php" target="votar">
							<div className="form-group">
							      <label htmlFor="name">* First Name:</label>
							      <input type="text" className="form-control" id="name" name="name" />
							</div>
							<div className="form-group">
							    <label htmlFor="message">* Enquiry:</label>
							    <textarea className="form-control" id="message" name="message" rows="3"></textarea>
							</div>
							<div className="form-group">
							    <label htmlFor="email">* Email address:</label>
							    <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" />
							</div>
							
							<button className="button-success pure-button button-xlarge">
								<i className="fa fa-paper-plane"></i>&nbsp;Send
							</button>
							
						</form>
						
					</div>
				</div>
			</div>

		)
	}
}
export default withRouter(Contact);
		