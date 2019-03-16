import React, {Component} from 'react';
import store from '../../redux/store';
import constants from '../../redux/constants';
import {withRouter} from 'react-router';
import LocalStorage from '../../utils/LocalStorage';

class ReportContent extends Component{
	
	constructor(){
		super();

		store.dispatch({type:constants.SAVE_PAGE, page:"/Report"});

		//if user is signed in get their uid to submit with form
		this.userUID = LocalStorage.loadState('user');
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
						<h2>Report</h2>
						
						<div>
							<p>Please complete this report form and we will investigate the issue.</p>
							<p>All the fields marked with an asterisk (*) are mandatory. Please leave as much information about the issue as possible.</p>
						</div>
					
						<iframe name="votar" style={{display:"none"}} title="report form" ></iframe>

						<form method="POST" id="form" action="report_email.php" target="votar">
							<div className="form-group">
							      <label htmlFor="name">* First Name:</label>
							      <input type="text" className="form-control" id="name" name="name" />
							</div>
							<div className="form-group">
							    <label htmlFor="report">* Report:</label>
							    <textarea className="form-control" id="report" name="report" rows="3"></textarea>
							</div>
							<div className="form-group">
							    <label htmlFor="email">* Email address:</label>
							    <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" />
							</div>
							<input type="hidden" className="form-control" id="uid" name="uid" value={this.userUID}/>
							<button className="btn btn-primary">
								<i className="fa fa-paper-plane"></i>&nbsp;Send
							</button>
							
						</form>
						
					</div>
				</div>
			</div>

		)
	}
}
export default withRouter(ReportContent);
		