import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';
import {_compressImage} from '../../utils/CompressImage';
import defaultLogo from '../../assets/images/default.jpg'



export default class AddBusinessImages extends Component{

	constructor(){
		super();
		
		this.state = {};
		
		this.thumbnailArray = [];
		this.imageArray = [];

		this.storageRef = firebase.storage().ref();
		this.firestore = firebase.firestore();
	}

	componentWillMount(){
		
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessThumbnailImages");

		ref.get().then((snapshot)=>{
			console.log(snapshot);
			
			snapshot.forEach((snap)=>{
				
				this.setState({
					[snap.id]:snap.data().url
				})
				
				this.thumbnailArray.push(snap.data().url);
				
			})
		})

		let ref2 = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessImages");

		ref2.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				console.log(snap.data().url)
				this.imageArray.push(snap.data().url);
				
			})
		})

	}

	_handleBrowseClick(e){
	   
		let fileinput = document.getElementById(e.target.id);
	    fileinput.click();
	}

	



	_handleMessagePic(e){
		
		
		let imageDisplayKey = `businessPic${e.target.id}`;
		

		let blobKey = `imageBlob${e.target.id}`

		let reader = new FileReader();
		
		 reader.onload = (e) => {
			
			_compressImage(e.target.result, 600, (result)=>{
				
				//add full size picture to storage
				this._addImageToStorage(result,imageDisplayKey);
				
			})
			_compressImage(e.target.result, 200, (result)=>{
				
				//display thumbnail result on screen
				var urlCreator = window.URL || window.webkitURL;
				let objUrl = urlCreator.createObjectURL(result);
				
				this.setState({
					[imageDisplayKey]:objUrl,
					[blobKey]:result
				})
				//add thumbnail to storage
				this._addThumbnailToStorage(result,imageDisplayKey);
				
			})
		}

		reader.readAsDataURL(e.target.files[0]);
	}

	

	_addImageToStorage(image,imageName){



		let messageImageFileLocation = `businessImages/${this.props.match.params.BusinessKey}/${imageName}.jpg`;
		let uploadTask = this.storageRef.child(messageImageFileLocation).put(image);
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
				
		    	let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessImages").doc(imageName);
		    	let obj = {
		    		url:downloadURL,
				}

		    	ref.set(obj);

		    });
		})
	}


	_addThumbnailToStorage(image,imageName){



		let messageImageFileLocation = `businessThumbnails/${this.props.match.params.BusinessKey}/${imageName}.jpg`;
		let uploadTask = this.storageRef.child(messageImageFileLocation).put(image);
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
				
		    	let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessThumbnailImages").doc(imageName);
		    	let obj = {
		    		url:downloadURL,
				}

		    	ref.set(obj);
		    });
		})
	}



	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/SingleBusiness/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
						</div>
					</div>

					<div className="box text-center">
						<h1>Add Business images</h1>



						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 1</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="1" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="1" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic1 ? this.state.businessPic1 : defaultLogo}  id="businessPic1"  alt="" />
								</div>
							</div>

							
						</div>
					


						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 2</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="2" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="2" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic2 ? this.state.businessPic2 : defaultLogo}  id="businessPic2"  style={{"width":"100%"}} alt="" />
								</div>
							</div>

							
							
						</div>


						<div className="box">	
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 3</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="3" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="3" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic3 ? this.state.businessPic3 : defaultLogo}  id="businessPic3"  alt="" />
								</div>
							</div>

							
							
						</div>


						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 4</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="4" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="4" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic4 ? this.state.businessPic4 : defaultLogo}  id="businessPic4"  alt="" />
								</div>
							</div>

							
							
						</div>



						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 5</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="5" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="5" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic5 ? this.state.businessPic5 : defaultLogo }  id="businessPic5"  alt="" />
								</div>
							</div>

							
							
						</div>


						{/*<div className="row text-center">

							<button onClick={this._handleImageSubmit.bind(this)}>Upload images</button>
						</div>*/}
					</div>
				</div>
			</div>

		)
	}
}