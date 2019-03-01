import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import $ from 'jquery';


import store from '../../redux/store';
import constants from '../../redux/constants';

import {_disable,_enable} from '../../utils/DisableGreyOut';

import LocalStorage from '../../utils/LocalStorage';
		

export default class ReviewPage extends Component{
	
	constructor(props){
		super(props);

		let pageString = `Review/${this.props.match.params.BusinessKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});
		
		this.firestore = firebase.firestore();

		this._getUserName()
		
		

		this.state = {
			reviewTitle:"",
			reviewComment:"",
			starRating:"3"
		}
	}

	_getUserName(){
		this.userUID = LocalStorage.loadState("user");
		let ref = this.firestore.collection("Users").doc(this.userUID);
		ref.get().then((snapshot)=>{
			this.userName = snapshot.data().userName;
		})
	}


	
	_handleInput(e){
		this.setState({
			[e.target.id]:e.target.value
		})

		$(`#${e.target.id}`).removeClass('formError');
	}



	

	
	_handleSubmit(e){

		e.preventDefault()

		_disable();

		let errorMsgs = this._validate()
		
		if(errorMsgs.length === 0){
			let reviewRef = this.firestore.collection("Reviews").doc(this.props.match.params.BusinessKey).collection("Review").doc(this.userName);

			let obj = {
				Username:this.userName,
				UserUID:this.userUID,
				Title:this.state.reviewTitle,
				Comment:this.state.reviewComment,
				Stars:this.state.starRating
			}
			reviewRef.set(obj).then(()=>{
				_enable();	
				this.props.history.push("/SingleBusiness/" + this.props.match.params.BusinessKey)
			})
			
		}else{
			_enable()

			let msgComp = errorMsgs.map((msg,index)=>{
				
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})

			let formattedComp = <div className="box">{msgComp}</div>
			
			this.setState({
				errors:formattedComp
			})
		}
		
		
	}


	_validate(){
		
		//store error messages in array
		const errorMsgs = [];

		if (this.state.reviewTitle.length < 1) {
		   errorMsgs.push("Please provide a review title");
		   $('#reviewTitle').addClass('formError');
		}

		if (this.state.reviewComment.length < 1) {
		   errorMsgs.push("Please provide a review comment");
		    $('#reviewComment').addClass('formError');
		}
		
  		return errorMsgs;
	}

	render(){
		return(
			<div className="container">
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/SingleBusiness/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
						</div>
					</div>
					<div className="box">
						<div className="row">
							<p className="text-20 text-center">Review</p>
						</div>	

						<div className="row form-group">
							<label className="col-sm-4">
								Review Title:
							</label>
							<div className="col-sm-8">
								<input type="text" value={this.state.reviewTitle} id="reviewTitle" className="form-control" onChange={this._handleInput.bind(this)} />
							</div>
						</div>

						<div className="row form-group">
							<label className="col-sm-4">
								Review comment:
							</label>
							<div className="col-sm-8">
								<textarea  value={this.state.reviewComment}  id="reviewComment" className="form-control" onChange={this._handleInput.bind(this)} />
							</div>
						</div>

						<div className="row form-group">
							<label className="col-sm-4">
								Star Rating:
							</label>
							<div className="col-sm-8">
								<select name="starRating" value={this.state.starRating}  className="form-control" id="starRating" onChange={this._handleInput.bind(this)}>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>
							</div>
						</div>
						<div className="text-center">
							<button onClick={this._handleSubmit.bind(this)} value="Submit" className="btn-primary">Submit</button>
						</div>
						<br />
						{this.state.errors}
					</div>
				</section>
			</div>

		)
	}
}