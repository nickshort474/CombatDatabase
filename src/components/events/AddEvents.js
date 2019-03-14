import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {firebase} from '@firebase/app';


import Datetime from 'react-datetime';
import moment from 'moment';
import Geosuggest from 'react-geosuggest'; 
import $ from 'jquery';

import GetImage from '../../utils/GetImage';
import {_disable,_enable} from '../../utils/DisableGreyOut';


import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';


const google = window.google;


class AddEvents extends Component{

	constructor(){
		super();
		
		this.state = {
			eventName:"",
			eventLocation:"",
			eventDescription:"",
			eventPhone:"",
			eventEmail:"",
			eventWebPage:"",
			eventTime:"",
			eventTimeFormat:false
			
		}

		store.dispatch({type:constants.SAVE_PAGE, page:"AddEvents"});
		store.dispatch({type:constants.EVENT_HAS_IMAGE, eventHasImg:false})

		
		
		this.userUID = LocalStorage.loadState("user");
		
		//firestore ref
		this.firestore = firebase.firestore();
		this.hasImage = false;
		

		// prevent enter key from submiting data too early
		$(document).on("keypress", ":input:not(textarea):not([type=submit])", function(event) {
   			
   			 if(event.keyCode === 13){
   			 	event.preventDefault();
   			 }
		});

	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}

	componentDidMount(){
		this.eventDateTimeDiv = document.getElementById("dateTimeContainer");
	}


	_onSuggestSelect(suggest) {
		
		if(suggest){
			
	    	this.setState({
	    		eventLocation:suggest.gmaps.formatted_address,
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,

	    	})
				    	
	    }
	    $('#geoSuggest').removeClass('formError');
  	}

	
	_handleInput(e){
		//this._testInput();
		
		this.setState({
			[e.target.id]:e.target.value
		})

		// remove formError class on user input
		$(`#${e.target.id}`).removeClass('formError');
	}


	_handleDateTimeChange(dateObject){
		if(typeof dateObject === 'object'){
			
			let unix = moment(dateObject).unix() * 1000;
			console.log(unix);
				
			this.setState({
				eventTime:unix,
				eventTimeFormat:true
			})
			
			
			this.eventDateTimeDiv.setAttribute("style", "border:none")
		}else{
			
			this.setState({
				eventTime:1,
				eventTimeFormat:false
			})
			//add immediate red border for text input of time suggest box
			this.eventDateTimeDiv.setAttribute("style", "border:2px solid red")
		}
	}
		
	

	_onSubmit(e){
		e.preventDefault();
		_disable();
				
		let errorMsgs = this._validate();
		
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
			console.log("can be submitted");

			let storeState = store.getState();
			this.hasImage = storeState.eventHasImg;

			//test for matching event names
			this._testForName(()=>{
				
				

				let ref = this.firestore.collection("Events").doc();
				let docRef = ref.id;
				
				let now = Date.now();

				let eventObj = {
					eventName:this.state.eventName,
					eventLocation:this.state.eventLocation, 
					eventDescription:this.state.eventDescription,
					eventPhone:this.state.eventPhone,
					eventEmail:this.state.eventEmail,
					eventWebPage:this.state.eventWebPage,
					eventTime:this.state.eventTime,
					lat:this.state.lat,
					lng:this.state.lng,
					creator:this.userUID,
					hasLogo:this.hasImage,
					eventID:docRef,
					creationDate:now
				}

				if(this.hasImage){
					this._addEventImage(docRef,(url)=>{
						
						eventObj["eventLogo"] = url;
						
						ref.set(eventObj).then(()=>{
							
							this.props.history.push('/Events');
						})
					})
				}else{
					
					eventObj["eventLogo"] = false;
					
					ref.set(eventObj).then(()=>{
						
						this.props.history.push('/Events');
					})
				}
			});
		}
		

		
	
	}

	_validate(name, location, time, description){
	
		//store error messages in array
		const errorMsgs = [];

		if (this.state.eventName.length < 1) {
		   errorMsgs.push("Please provide an event name");
		   $('#eventName').addClass('formError');
		}

		if (this.state.eventLocation.length < 1) {
		   errorMsgs.push("Please provide a location for your event");
		    $('#geoSuggest').addClass('formError');
		}
		if (this.state.eventTime === 1) {
		   errorMsgs.push("Please provide a time for your event");
		   $('#dateTimeContainer').addClass('formError');
		}
		if (this.state.eventDescription.length < 1) {
		   errorMsgs.push("Please provide a description for your event");
		   $('#eventDescription').addClass('formError');
		}
  		return errorMsgs;
	}

	_testForName(callback){

		let nameMatch = false;

		//check whether event name already exists
		let nameCheckRef = this.firestore.collection("Events");
		let query = nameCheckRef.where("eventName", "==", this.state.eventName);

		query.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				
				if(snap.data().eventName){
					nameMatch = true;
				}else{
					nameMatch = false
				}
			})

			if(nameMatch === true){
				alert("Event name already exists please try another");
				_enable();
			}else{
				callback();
			}

			
			
		})
	}


	_addEventImage(key, funcToCallBack){
		
		let storageRef = firebase.storage().ref();
		/*let files = document.getElementById("browse").files;
		let file;*/

		

		// get image from redux
		let file = store.getState().eventImg;

		
		let eventImageFileLocation = `eventLogos/${key}.jpg`;
		let uploadTask = storageRef.child(eventImageFileLocation).put(file);
		
		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		uploadTask.on('state_changed', (snapshot)=>{
		    // Observe state change events such as progress, pause, and resume
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

		    console.log('Upload is ' + this.progress + '% done');
		    switch (snapshot.state) {

		    	case firebase.storage.TaskState.PAUSED: // or 'paused'
		        	console.log('Upload is paused');
		        	break;

		    		case firebase.storage.TaskState.RUNNING: // or 'running'
		        	console.log('Upload is running');
		       	 break;
		       	 default:
		       	 	console.log("defaulting");

		    }

		}, (error)=> {
		    // Handle unsuccessful uploads
		    console.log(error);
		}, () => {
		    // Handle successful uploads on complete
		    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
		  
		  	uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			    console.log('File available at', downloadURL);
			    funcToCallBack(downloadURL);
			 });

		   
		});

		
				
		
	}

	render(){
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	
			        	<div className="box">
					   		<Link to="Events">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
				                	<h2>Event registration</h2>
				                   
				                    <ul>
				                    	<li>Free event advertising on the site.</li>
				                        <li>A place to promote your organization.</li>
				                        <li>Attract more people, sell more tickets</li>
				                        
				                    </ul>
			                    </div>
			                </div>

			                <form onSubmit={this._onSubmit.bind(this)}>
				                <div className="col-sm-9">
				                	<div className="box">
				                    

				                    	<div className="form-group">
				                            <label htmlFor="eventName">Event name <span>*</span></label>
				                           <input type="text" className="form-control"   id="eventName" value={this.state.eventName} onChange={this._handleInput.bind(this)} />
				                        </div>

				                        <div className="form-group">
				                            <label>Event location <span>*</span></label>
				                            <Geosuggest ref={el=>this._geoSuggest=el}	
				                              	placeholder="Search for your address"
								          		onSuggestSelect={this._onSuggestSelect.bind(this)}
								          		location={new google.maps.LatLng()}
								         		radius="20"
								         		id="geoSuggest"
								         		
								         	/>

					                       
				                        </div>

				                       <div className="form-group">
				                       		
				                       		<label>Event time <span>*</span></label>
				                       		<div id='dateTimeContainer' style={this.dateTimeStyle}>
				                       			<Datetime id="dateTime"  dateFormat="dddd, MMMM Do YYYY"  onChange={this._handleDateTimeChange.bind(this)}/>
				                       		</div>
				                       </div>

										<div className="form-group">
				                            <label htmlFor="eventDescription">Description<span>*</span></label><br />
				                            <textarea  id="eventDescription"  value={this.state.eventDescription} className="form-control"   onChange={this._handleInput.bind(this)}></textarea>
				                        </div>


				                        <div className="form-group">
				                            <label htmlFor="eventPhone">Phone number</label><br />
				                            <input type="text" id="eventPhone" value={this.state.eventPhone} className="form-control"   onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <div className="form-group">
				                            <label htmlFor="eventEmail">Contact Email address</label><br />
				                            <input type="text" id="eventEmail" value={this.state.eventEmail} className="form-control"   onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <div className="form-group">
				                            <label htmlFor="eventWebPage">Event Webpage</label><br />
				                            <input type="text" id="eventWebPage" value={this.state.eventWebPage} className="form-control"   onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <GetImage prompt="Please provide an image for your Event" comp="AddEvents" />

				                        <div className="text-center">
				                        	{this.state.errors}
											<button type="submit" className="btn btn-primary">Submit</button>
				                        	

				                        </div>
				                       
				                    
				                    </div>
				                </div>
				            </form>
	                    </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}
export default withRouter(AddEvents);