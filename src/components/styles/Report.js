import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import LocalStorage from '../../utils/LocalStorage';

export default class Report extends Component{
	
	constructor(){
		super();

		this.state = {
			report:"",
			category:"Date created"
		}
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
	}

	componentWillMount(){
		window.scrollTo(0, 0);
		
	}

	_handleInput(e){
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	_onSubmit(e){
		
		if(this.state.report.length > 4){
		
			let ref = this.firestore.collection("ReportContent")
			let user;
			if(this.userUID){
				user = this.userUID
			}else{
				user = "anonymous";
			}

			let obj = {
				category:this.state.category,
				report:this.state.report,
				user:user
			}

			ref.add(obj).then(()=>{
				this.props.history.push(`/Styles/${this.props.match.params.ItemName}`)
			})
		}else{
			alert("Please fill in both fields")
		}
		
		
	}
	
	render(){
		

		return(

			
				
			<div className="container">	
				<div className="content-wrapper">
					<div className="box">
						<Link to={`/Styles/${this.props.match.params.ItemName}`}>&#60; Back</Link>
					</div>
					<div className="box">
						
						<h2 className="text-center">Report issue with content:</h2>
						<form onSubmit={this._onSubmit.bind(this)}>
							<div className="row form-group">
								<div className="col-xs-4">
									<label htmlFor="cateogory">Category</label>
								</div>
								<div className="col-xs-8">
									<select id="category" className="form-control" onChange={this._handleInput.bind(this)} value={this.state.category}>
										<option value="Date created">Date created</option>
										<option value="Defining features">Defining features</option>
										<option value="Famous practitoners">Famous practitioners</option>
										<option value="Full description">Full description</option>
										<option value="History">History</option>
									</select>
								</div>
							</div>
							
							<div className="row form-group">
								<div className="col-xs-4">
									<label htmlFor="report">Report:</label>
								</div>
								<div className="col-xs-8">
									<textarea value={this.state.report} onChange={this._handleInput.bind(this)} className="form-control" id="report" />
								</div>
							</div>
							<div className="text-center">
								<input className="btn btn-primarySmall" type="submit" value="report" />
							</div>

						</form>
					</div>
				</div>
			</div>
							

		)
	}
}