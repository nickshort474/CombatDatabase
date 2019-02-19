import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import Geosuggest from 'react-geosuggest';
import $ from 'jquery';

import store from '../../redux/store';
import constants from '../../redux/constants';

import {_disable,_enable} from '../../utils/DisableGreyOut';


const google = window.google;

export default class EditBusiness extends Component{

	constructor(){
		super()

		this.state = {
			businessName:"",
			businesslocation:"",		
			businessSummary:"",
			businessDescription:"",
			businessEmail:"",
			businessPhone:"",
		}
	}


	componentWillMount() {
		window.scrollTo(0, 0);

		// get previous page from redux for back button
		//let storeState = store.getState();
		let pageString = `EditBusiness/${this.props.match.params.BusinessKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});


		//create ref to firestore
		this.firestore = firebase.firestore();
						
		//collect business information and reviews
		this._getBusinessInfo();
	}

	_getBusinessInfo(){
		
		//create reference to business section of firestore
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

		
		//gather all business data
		ref.get().then((snapshot)=>{ 
			

	    	//save returned data to state
			this.setState({
	    		businessName:snapshot.data().businessName,
				businessLocation:snapshot.data().location,
				businessSummary:snapshot.data().summary,
				businessDescription:snapshot.data().description,
				businessPhone:snapshot.data().phone,
				businessEmail:snapshot.data().email,
				lat:snapshot.data().lat,
				lng:snapshot.data().lng
				
	    	})
		})

	}


	_handleInput(e){
		this.setState({
			[e.target.id]:e.target.value
		})

		$(`#${e.target.id}`).removeClass('formError');
	}

	

	_onSuggestSelect(suggest) {
		
		if(suggest){
			this.setState({
				businessLocation:suggest.gmaps.formatted_address,
				lat:suggest.location.lat,
				lng:suggest.location.lng
			})
		$('#geoSuggest').removeClass('formError');	
		}else{
			$('#geoSuggest').addClass('formError');
			this.setState({
				businessLocation:""
			})
		}
		
    	
  	}

  	

	_onSubmit(e){
		e.preventDefault();
		_disable();

		let errorMsgs = this._validate(this.state.businessName,this.state.businessLocation,this.state.businessSummary,this.state.businessDescription)
		
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
				
			let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

			let obj = {
				businessName:this.state.businessName,
				location:this.state.businessLocation,
				summary:this.state.businessSummary,
				description:this.state.businessDescription,
				phone:this.state.businessPhone,
				email:this.state.businessEmail,
				lat:this.state.lat,
				lng:this.state.lng
				
			}

			ref.update(obj).then(()=>{
				
				this.props.history.push(`/Business/${this.props.match.params.BusinessKey}`);
			});
		}
	}
	
	

	_validate(name, location, summary, description){
		
		//store error messages in array
		const errorMsgs = [];

		if (name.length < 1) {
		   errorMsgs.push("Please provide a business name");
		   $('#businessName').addClass('formError');
		}

		if (location.length < 1) {
		   errorMsgs.push("Please provide a location for your business");
		    $('#geoSuggest').addClass('formError');
		}
		if (summary.length < 1) {
		   errorMsgs.push("Please provide a summary for your business");
		   $('#businessSummary').addClass('formError');
		}
		if (description.length < 1) {
		   errorMsgs.push("Please provide a description for your business");
		   $('#businessDescription').addClass('formError');
		}
  		return errorMsgs;
	}


	render(){
		return(
			<div className="container">
				<section className="content-wrapper">
					
					<div className="row">
						<div className="col-sm-12 box">
							<Link to={'/Business/' + this.props.match.params.BusinessKey}>&#60; Back</Link>
							
						</div>
					</div>

					<div className="row">
						<div className="box">
							<form onSubmit={this._onSubmit.bind(this)}>

		                    	<div className="form-group">
		                            <label>Business name</label>
		                            <input type="text" className="form-control" id="businessName" value={this.state.businessName} onChange={this._handleInput.bind(this)} />
		                        </div>

		                        <div className="form-group">
		                            <label>Business Address</label><br />
		                           
		                            <Geosuggest
							          ref={el=>this._geoSuggest=el}
							          placeholder="Search for your address"
							          initialValue={this.state.businessLocation}
							          onSuggestSelect={this._onSuggestSelect.bind(this)}
							          location={new google.maps.LatLng(this.state.lat, this.state.lng)}
							          radius="20" 
							          id="geoSuggest"
							        />

		                        </div>

		                        <div className="form-group">
		                            <label htmlFor="businessSummary">Please give a quick Summary of your business:</label><br />
		                            <textarea  id="businessSummary" value={this.state.businessSummary} onChange={this._handleInput.bind(this)}></textarea>
		                        </div>

		                        <div className="form-group">
		                            <label htmlFor="businessDescription">Please provide a full description here:</label><br />
		                            <textarea  id="businessDescription" value={this.state.businessDescription} onChange={this._handleInput.bind(this)}> </textarea>
		                        </div>

		                        <div className="form-group">
		                            <label htmlFor="businessPhone">Please provide contact number:</label><br />
		                            
		                            <input type="text" id="businessPhone" value={this.state.businessPhone} onChange={this._handleInput.bind(this)}/>
		                        </div>

		                        <div className="form-group">
		                            <label htmlFor="businessEmail">Please provide contact email:</label><br />
		                            
		                            <input type="email" id="businessEmail" value={this.state.businessEmail} onChange={this._handleInput.bind(this)}/>
		                        </div>
		                        
		                       
								
								{this.state.errors}
								
		                        <button type="submit" id="submitbusiness" className="btn btn-primary">Update</button>
				                 		 
				            </form>
				        </div>    
					</div>	
					

				</section>
			</div>
		)
	}
}