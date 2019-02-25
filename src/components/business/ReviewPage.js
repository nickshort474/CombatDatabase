import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';
		

export default class ReviewPage extends Component{
	
	constructor(){
		super();

		let pageString = `Review/${this.props.match.params.BusinessKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});
		
		this.firestore = firebase.firestore();

		this._getUserName()
		
		

		this.state = {
			reviewTitle:"Title",
			reviewComment:"Comment",
			firstTitleClick:true,
			firstCommentClick:true,
			stars:"1"
		}
	}

	_getUserName(){
		this.userUID = LocalStorage.loadState("user");
		let ref = this.firestore.collection("Users").doc(this.userUID);
		ref.get().then((snapshot)=>{
			this.userName = snapshot.data().userName;
		})
	}


	
	_handleTitleInput(e){
		this.setState({
			reviewTitle:e.target.value
		})
	}

	_handleCommentInput(e){
		this.setState({
			reviewComment:e.target.value
		})
	}
	_handleStarInput(e){
		this.setState({
			stars:e.target.value
		})
	}

	

	_handleFirstClick(e){
		
		if(e.target.value === "Title" && this.state.firstTitleClick === true){
			this.setState({
				reviewTitle:"",
				firstTitleClick:false
			})
		}else if(e.target.value === "Comment" && this.state.firstCommentClick === true){
			this.setState({
				reviewComment:"",
				firstCommentClick:false
			})
		}
	}


	_handleSubmit(e){
		

		
		let reviewRef = this.firestore.collection("Reviews").doc(this.props.match.params.BusinessKey).collection("Review").doc(this.userName);

		let obj = {
			Username:this.userName,
			Title:this.state.reviewTitle,
			Comment:this.state.reviewComment,
			Stars:this.state.stars
		}
		reviewRef.set(obj)
	}

	render(){
		return(
			<div className="container">
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/Business/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
						</div>
					</div>
					<div className="box">
						<div className="row">
							<p className="text-20 text-center">Review</p>
						</div>	

						<div className="row">
							<div className="col-sm-6">
								Review Title:
							</div>
							<div className="col-sm-6">
								<input type="text" value={this.state.reviewTitle} onClick={this._handleFirstClick.bind(this)} onChange={this._handleTitleInput.bind(this)} />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								Review comment:
							</div>
							<div className="col-sm-6">
								<textarea  value={this.state.reviewComment} onClick={this._handleFirstClick.bind(this)} onChange={this._handleCommentInput.bind(this)} />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-6">
								Star Rating:
							</div>
							<div className="col-sm-6">
								<select name="starRating" value={this.state.optionState} onChange={this._handleStarInput.bind(this)}>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>
							</div>
						</div>
						<button onClick={this._handleSubmit.bind(this)} value="Submit" className="btn-primary">Submit</button>
					</div>
				</section>
			</div>

		)
	}
}