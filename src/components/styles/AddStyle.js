import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';



export default class AddStyle extends Component{
	


	componentWillMount(){
		window.scrollTo(0, 0);

	}

	_handleInput(e){
		this.setState({
			[e.target.id]:e.target.value
		})
	}




	_addStyle(event){
		event.preventDefault();
		let firestore = firebase.firestore();

		let ref = firestore.collection("Styles").doc(this.state.style);
		console.log(ref);

		let styleObject = {
			Name:this.state.styleName,
			Country:this.state.countryOfOrigin,
			Created:this.state.date,
			Features:this.state.definingFeatures,
			Practioners:this.state.famousPractioners,
			Description:this.state.fullDescirption,
			History:this.state.history,
			
			
		}
		ref.set(styleObject);
		
		this.props.history.push('/Styles');
	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="Styles">&lt; Go back to style list</Link>
					</div>

					<div className="box">

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="styleName">Style name:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="styleName" onChange={this._handleInput.bind(this)}/><br />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="countryOfOrigin">Country of origin:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="countryOfOrigin" onChange={this._handleInput.bind(this)} />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="dateCreated">Date created:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="dateCreated" onChange={this._handleInput.bind(this)} />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="definingFeatures">Defining features:</label>
							</div>
							<div className="col-sm-6">
								<textarea id="definingFeatures" onChange={this._handleInput.bind(this)}></textarea>
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="famousPractioners">Famous Practioners:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="famousPractioners" onChange={this._handleInput.bind(this)} />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="fullDescirption">Full description:</label>
							</div>
							<div className="col-sm-6">
								<textarea id="fullDescription" onChange={this._handleInput.bind(this)} ></textarea>
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								<label htmlFor="history">History:</label>
							</div>
							<div className="col-sm-6">
								<textarea id="history" onChange={this._handleInput.bind(this)}></textarea>
							</div>
						</div>
						


						<button className="btn-primary" onClick={this._addStyle.bind(this)}>Click me</button>
					</div>
				</div>
			</div>
		)
	}
}