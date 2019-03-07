import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import '@firebase/storage';

import {Link, withRouter} from 'react-router-dom';
import $ from 'jquery';

import Geosuggest from 'react-geosuggest';

import store from '../../redux/store';
import constants from '../../redux/constants';

import defaultLogo from '../../assets/images/default.jpg';
import {_disable,_enable} from '../../utils/DisableGreyOut';
import {_compressImage} from '../../utils/CompressImage';

import LocalStorage from '../../utils/LocalStorage';
		
const google = window.google;


class AddBusiness extends Component{

	constructor(){
		super();

		console.log("constructor");

		this.state = {
			businessName:"",
			businessLocation:"",			
			businessSummary:"",
			businessDescription:"",
			businessEmail:"",
			businessPhone:"",
			
		}


		this.userUID = LocalStorage.loadState("user");
		
		store.dispatch({type:constants.SAVE_PAGE, page:"AddBusiness"});

  		this.textStyle = {
    		fill: '#ffffff',
   			textAnchor: 'middle'
  		};
		
  		this.businessThumbnail = null;

  		// prevent enter key from submiting data too early
		$(document).on("keypress", ":input:not(textarea):not([type=submit]):not(button)", function(event) {
   			
   			 if(event.keyCode === 13){
   			 	event.preventDefault();
   			 }
		});

	}

	componentWillMount(){
		window.scrollTo(0, 0);
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
		
		}
		$('#geoSuggest').removeClass('formError');
    	
  	}

  	_previewImage(e){
		
		let reader = new FileReader();

		reader.onload = (e) =>{
			
			_compressImage(e.target.result, 200, (result)=>{
								
				this.businessThumbnail = result;
				
				
			})
			$('#previewImage').attr("src", e.target.result);
		}

		reader.readAsDataURL(e.target.files[0]);
		
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
			console.log("can be submitted");
			this.firestore = firebase.firestore();
			let docId = this.firestore.collection("Business").doc();
							
			//add business image to storage
			this._addBusinessImage(docId.id, (callBackParam) =>{
				
				
				let businessLogo;

				//when finished route back to business listing
				if(callBackParam === "noImage"){
					businessLogo = false;
					
				}else{
					businessLogo = callBackParam;
					
				}

				let now = Date.now();

				//create data object
				let postData = {
					businessName:this.state.businessName,
					location:this.state.businessLocation,
					lng:this.state.lng,
					lat:this.state.lat,
					summary:this.state.businessSummary,
					description:this.state.businessDescription,
					phone:this.state.businessPhone,
					email:this.state.businessEmail,
					key:docId.id,
					businessLogo:businessLogo,
					date:Date.now(),
					creator:this.userUID,
					creationDate:now

				}

				//write data to firebase
				docId.set(postData);
				

				this._addBusinessToUserProfile(docId.id, () =>{
					
					this.props.history.push('/BusinessPage');
				})
				
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


	_addBusinessToUserProfile(key, funcToCallBack){
		

		let ref = this.firestore.collection("People");

		let query = ref.where("uid", "==", this.userUID);
		query.get().then((snapshot)=>{
			
			snapshot.forEach((element)=>{
				this.firestore.collection("People").doc(this.userUID).update({business:key});
			})
			//
			funcToCallBack();
		})
		
	}


	_addBusinessImage(key, funcToCallBack){
		
		let storageRef = firebase.storage().ref();

		/*let files = document.getElementById("fileUpload").files;
		let file;*/

		//get resulting file from _compressIMAGE TO UPLOAD INSTEAD
		
		if(this.businessThumbnail !== null){

			
			let businessImageFileLocation = `businessLogos/${key}.jpg`;
			let uploadTask = storageRef.child(businessImageFileLocation).put(this.businessThumbnail);
			
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
			   
			  	uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
					funcToCallBack(downloadURL);
			  	})
			   
			});

		}else{
			funcToCallBack("noImage");
		}
				
		
	}

	

	




  
	render(){

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	
			        	<div className="box">
					   		<Link to="/Business">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
				                	<h2>Register</h2>
				                    <p>Register your business and get the benefits of CombatDB registration</p>
				                    <ul>
				                    	<li>Free advertising on the site.</li>
				                        <li>A means to connect to other business and students.</li>
				                        <li>A host for blogs and information related to your business.</li>
				                    </ul>
			                    </div>
			                </div>

			                <div className="col-sm-9">
			                	<div className="box">

			                    <form onSubmit={this._onSubmit.bind(this)}>

			                    	<div className="form-group">
			                            <label htmlFor="businessName">Business name<span>*</span></label>
			                            <input type="text" className="form-control" id="businessName" value={this.state.businessName} onChange={this._handleInput.bind(this)}/>
			                        </div>

			                        <div className="form-group">
			                            <label>Business Address<span>*</span></label><br />
			                           
			                           <div>
				                            <Geosuggest
									          ref={el=>this._geoSuggest=el}
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng()}
									          radius="20" 
									          id="geoSuggest"
									        />
								        </div>
			                        </div>
									<div className="form-group">
			                            <label htmlFor="businessSummary">Please give a quick Summary of your business:<span>*</span></label><br />
			                            <textarea  id="businessSummary" value={this.state.businessSummary} onChange={this._handleInput.bind(this)}></textarea>
			                        </div>

			                       

			                        <div className="form-group">
			                            <label htmlFor="businessDescription">Please provide a full description here:<span>*</span></label><br />
			                            <textarea id="businessDescription" value={this.state.businessDescription} onChange={this._handleInput.bind(this)}></textarea>
			                        </div>

			                        <div className="form-group">
			                            <label htmlFor="businessPhone">Please provide contact number:</label><br />
			                            
			                            <input type="text" id="businessPhone" value={this.state.businessPhone} onChange={this._handleInput.bind(this)}/>
			                        </div>

			                        <div className="form-group">
			                            <label htmlFor="businessEmail">Please provide contact email:</label><br />
			                            
			                            <input type="email" id="businessEmail" value={this.state.businessEmail} onChange={this._handleInput.bind(this)}/>
			                        </div>
			                        
			                        <div className="form-group">
										Add a business logo or image:<input type="file" id="fileUpload" name="pic" onChange={this._previewImage.bind(this)} accept="image/*" />
										<img src={defaultLogo} id="previewImage" className="img-thumbnail" width="200px" height="200px" alt="Preview" />
										
									</div>  
									{this.state.errors}
			                        <button type="submit" className="btn btn-primary">Submit</button>
			                 		 
			                    </form>
			                     
			                    </div>
			                </div>

	                    </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}

export default withRouter(AddBusiness);