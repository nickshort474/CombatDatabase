import React, {Component} from 'react';
import firebase from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';
import defaultLogo from '../../assets/images/defaultLarge.jpg';
import {_compressImage} from '../../utils/CompressImage';
import {_disable, _enable} from '../../utils/DisableGreyOut';
import LocalStorage from '../../utils/LocalStorage';


class HomeImageUpload extends Component{
	
	constructor(){
		super();

		store.dispatch({type:constants.SAVE_PAGE, page:"HomeImageUpload"});
		this.state = {
			homeImage:""
		}
		this.storageRef = firebase.storage().ref();
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
		console.log(this.userUID);
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}


	_handleBrowseClick(e){
	   
		let fileinput = document.getElementById(e.target.id);
	    fileinput.click();
	}

	_handleMessagePic(e){
		
		
	

		let reader = new FileReader();
		
		 reader.onload = (e) => {
			
			_compressImage(e.target.result, 600, (result)=>{
				
				//add full size picture to storage
				//this._addImageToStorage(result,imageDisplayKey);
				this.result = result;
				//display thumbnail result on screen
				var urlCreator = window.URL || window.webkitURL;
				let objUrl = urlCreator.createObjectURL(result);

				this.setState({
					homeImage:objUrl
				})
			})
			
		}

		reader.readAsDataURL(e.target.files[0]);
	}

	_onSubmit(){
		_disable()
		if(this.result){

			let ref = this.firestore.collection("HomeImages").doc();
			let id = ref.id;

			let messageImageFileLocation = `homepageImages/${id}.jpg`;
			let uploadTask = this.storageRef.child(messageImageFileLocation).put(this.result);
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
					
			    	let obj = {
			    		downloadURL:downloadURL,
			    		user:this.userUID

			    	}
					ref.set(obj).then(()=>{
						alert("Thank you for you submission")
						_enable();
						this.props.history.push("/Home")
					})
			    

			    });
			})
		}else{
			alert("please choose an image to upload")
			_enable()
		}
		
	}
	
	
	render(){
		return(
			<div>
				<div className="container"> 
					<div className="content-wrapper text-center">
						<h2>Upload Image</h2>
					

						<div className="box greyedContent">
							<div className="row">
								
								
								<input type="file" id="4" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
								<input type="button" value="Add Image" id="4" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								
								<img src={this.state.homeImage ? this.state.homeImage : defaultLogo}  id="businessPic4" style={{"width":"100%"}} alt="" />
								
								<button className="btn btn-primary" onClick={this._onSubmit.bind(this)}>Upload</button>
							</div>
						</div>
												
					</div>
				</div>
			</div>

		)
	}
}
export default HomeImageUpload;
		