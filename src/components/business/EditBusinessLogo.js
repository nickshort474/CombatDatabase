import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import GetImage from '../../utils/GetImage';
import {_disable,_enable} from '../../utils/DisableGreyOut';


import store from '../../redux/store';
/*import constants from '../../redux/constants';*/


export default class EditBusinessLogo extends Component{

	constructor(){
		super();
		this.state = {
			caption0:"",
			urlReturned:false
		}

		
		
	}

	componentWillMount(){
		this.firestore = firebase.firestore()
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

		ref.get().then((snapshot)=>{
		
			this.setState({
				businessLogo:snapshot.data().businessLogo,
				urlReturned:true
			})
			
		})
	}

	

	_handleImageSubmit(e){
		
		//disable
		_disable();

		//set references
		let storageRef = firebase.storage().ref();
		
		//set variables
		let img  = store.getState().businessImg;
		console.log(img);	
			
		let messageImageFileLocation = `businessLogos/${this.props.match.params.BusinessKey}.jpg`;
		let uploadTask = storageRef.child(messageImageFileLocation).put(img);
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
		    // eslint-disable-next-line
		}, () => {
		    // Handle successful uploads on complete
		    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
		    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
				console.log(downloadURL);
				this._uploadRefToFirestore(downloadURL);		
		    });
		})
		
				
	}

	_uploadRefToFirestore(downloadURL){
		
				
		//create ref for  image
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

			
		// create data from downloadURL
		let obj = {
			businessLogo:downloadURL
		}

		// commit batch write
		ref.update(obj).then(()=>{
			_enable();
			this.props.history.push(`/Business/${this.props.match.params.BusinessKey}`)
			console.log("commited");
		});
		
		
	}

	render(){
		
		
		let imagePicker;

		if(this.state.urlReturned){
			imagePicker = <GetImage prompt="Please choose new business logo" src={this.state.businessLogo} comp="EditBusinessLogo"/>
		}

		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/Business/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
						</div>
					</div>

					<div className="box text-center">
						<h1>Edit Business logo</h1>

					
						{imagePicker}


						<div className="row text-center">

							<button className="btn-primary" onClick={this._handleImageSubmit.bind(this)}>Upload</button>
						</div>
					</div>
				</div>
			</div>

		)
	}
}