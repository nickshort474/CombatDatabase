import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {withRouter, Link} from 'react-router-dom';

import store from '../../redux/store';
import $ from 'jquery';

import GetImage from '../../utils/GetImage';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import LocalStorage from '../../utils/LocalStorage';
		

class AddBlog extends Component{

	constructor(){
		super();
		
		this.state = {
			blogName:"",
			blogDescription:"",
			keyWord1:"",
			keyWord2:"",
			keyWord3:"",
			keyWord4:"",
			keyWord5:"",
		}
		
		
		this.firestore = firebase.firestore();
		this.user = LocalStorage.loadState("user");
		//this.keyWordArray = [];
		this.blogKeywordObj = {};
	}
	
	componentWillMount() {
	    window.scrollTo(0, 0); 
   		
	}

	

	_handleSearchChoice(e){
		
		this.setState({
			blogType:e.target.value
		})
			
					
	}

	_handleKeywordInput(e){
		this.setState({
			[e.target.id]:e.target.value
		})
		this.blogKeywordObj[e.target.id] = e.target.value.trim().toLowerCase();;
		$(`#${e.target.id}`).removeClass('formError');
	}

	_handleInput(e){
		this.setState({
			[e.target.id]:e.target.value
		})
		// remove formError class on user input
		$(`#${e.target.id}`).removeClass('formError');
	}

	_submitForm(e){
		e.preventDefault();
		
		_disable();

		let errorMsgs = this._validate(this.state.blogName,this.state.blogDescription,this.state.keyWord1,this.state.keyWord2);
		
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
			
			let storeState = store.getState();
			this.hasImage = storeState.has_img;

			

			this._testForName(()=>{
				

				let ref = this.firestore.collection("BlogNames").doc(this.state.blogName);
				let docRef = ref.id;

				let now = Date.now();
				
				let obj = {
					name:this.state.blogName,
	    			user:this.user,
	    			description:this.state.blogDescription,
	    			keywords:this.blogKeywordObj,
	    			creationDate:now
	    		}
	  		

	    		if(this.hasImage){
	    			
	    			this._addBlogImage(docRef,(url)=>{

	    				obj["blogLogo"] = url;

	    				ref.set(obj).then((result)=>{
	    					this._sendFinalReferences();
	    					this._createKeywordReferences()
	    				})
					})

	    		}else{
	    			obj["blogLogo"] = false;

	    			ref.set(obj).then((result)=>{
						this._sendFinalReferences();
						this._createKeywordReferences()
	    			})
	    		}
			})
		}
	}

	_testForName(callback){

		let nameMatch = false;

		//check whether event name already exists
		let nameCheckRef = this.firestore.collection("BlogNames");
		let query = nameCheckRef.where("name", "==", this.state.blogName);

		query.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				
				if(snap.data().blogName){
					nameMatch = true;
				}else{
					nameMatch = false
				}
			})

			if(nameMatch === true){
				alert("Blog name already exists please try another");
				_enable();
			}else{
				callback();
			}
		})
	}



	_sendFinalReferences(){
		let newRef = this.firestore.collection("BlogUserList").doc(this.user).collection("blogs");
		newRef.add({"blogName":this.state.blogName});

		let BlogRef = this.firestore.collection("Blogs").doc(this.user).collection(this.state.blogName);
		BlogRef.add({"empty":true});

		this.props.history.push('/MyBlogList');
	}


	_createKeywordReferences(){
		
		let now = Date.now();

		let batch = this.firestore.batch();

		for(let val in this.blogKeywordObj){
			
			console.log(this.blogKeywordObj[val]);

			let ref = this.firestore.collection("KeyWords").doc(this.blogKeywordObj[val]).collection("blogs").doc();
			let obj = {
				blogName:this.state.blogName,
				creationDate:now
			}
			batch.set(ref,obj);
		}
		batch.commit();


		//copy complete keyword object
		let keyWordsToUpload = this.blogKeywordObj;
		
		//set counters
		let keyWordObjectLength = 0;
		let keyWordCounter = 0;

		
		for(let val in this.blogKeywordObj){
			
			//increment counter to hold reference for number of items in object
			keyWordObjectLength++;

			//test for whether there is already occurance of keyword in firestore
			let ref = this.firestore.collection("KeyWords").doc("KeyWordList").collection("list");
			let query = ref.where("word", "==", this.blogKeywordObj[val]);
			
			// eslint-disable-next-line
			query.get().then((snapshot)=>{
				
				//increment counter
				keyWordCounter++;

				snapshot.forEach((snap)=>{
					
					// if word exists snapshot will return with data, use this to remove that keyword from keyWordsToUpload
					if(snap.data().word){
						// word exists so delete from object
						delete keyWordsToUpload[val];
					}
				})
			// eslint-disable-next-line					
			}).then(()=>{
				
				//once all keywoprd have been tested keyWordCOunter matches keywordObject length so can upload non-matching keywords
				if(keyWordCounter === keyWordObjectLength){
					
					//loop through keyWordsToUpload and u 
					Object.keys(keyWordsToUpload).forEach((word)=>{
						
						ref.add({word:keyWordsToUpload[word]});
					})
				}
			})
		}

	}

	_addBlogImage(key, funcToCallBack){
		console.log("adding image")
		let storageRef = firebase.storage().ref();
		/*let files = document.getElementById("browse").files;
		let file;*/

		

		// get image from redux
		let file = store.getState().blogImg;

		console.log(file);
		let blogImageFileLocation = `blogLogo/${key}.jpg`;
		let uploadTask = storageRef.child(blogImageFileLocation).put(file);
		
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

	_validate(name, description,keyWord1,keyWord2){
	
		//store error messages in array
		const errorMsgs = [];

		if (name.length < 1) {
		   errorMsgs.push("Please provide an blog name");
		   $('#blogName').addClass('formError');
		}

		
		if (description.length < 1) {
		   errorMsgs.push("Please provide a description for your blog");
		   $('#blogDescription').addClass('formError');
		}

		if(keyWord1 < 1){
			errorMsgs.push("Please provide a primary keyword");
		    $('#keyWord1').addClass('formError');
		}
		if(keyWord2 < 1){
			errorMsgs.push("Please provide a secondary keyword");
		    $('#keyWord2').addClass('formError');
		}
  		return errorMsgs;
	}

	render(){
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box">
					   		<Link to="/MyBlogList">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
					   
				                	<h2>Add a blog</h2>
				                    
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box">        
				                    <form onSubmit={this._submitForm.bind(this)}>
				                    	<div className="form-group">
				                            <label htmlFor="blogName">Blog name</label>
				                            <input type="text"  id="blogName" className="form-control" value={this.state.blogName} placeholder="Give your blog" onChange={this._handleInput.bind(this)}  />
				                           
				                        </div>
				                        

				                        <div className="form-group">
				                        	<label htmlFor="blogDescription">Blog Description</label>
				                        	<input type="text" id="blogDescription" className="form-control"  value={this.state.blogDescription} placeholder="Describe your blog" onChange={this._handleInput.bind(this)} />
				                        </div>
				                        
				                        <div className="form-group">
				                        	<p>Please provide some keywords or phrases to help people find your blog:</p>
				                            <label htmlFor="BlogKeyword1">Keyword 1</label>
				                            <input type="text" id="keyWord1" value={this.state.keyWord1} onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 1" /><br />

				                            <label htmlFor="BlogKeyword2">Keyword 2</label>
				                            <input type="text" id="keyWord2" value={this.state.keyWord2}onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 2" /><br />

				                            <label htmlFor="BlogKeyword3">Keyword 3</label>
				                            <input type="text" id="keyWord3" value={this.state.keyWord3} onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 3" /><br />

				                            <label htmlFor="BlogKeyword4">Keyword 4</label>
				                            <input type="text" id="keyWord4" value={this.state.keyWord4} onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 4" /><br />

				                            <label htmlFor="BlogKeyword5">Keyword 5</label>
				                            <input type="text" id="keyWord5" value={this.state.keyWord5} onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 5" /><br />								
				                        </div>
				                        <GetImage prompt="Image for blog listing display" comp="AddBlog" />
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

export default withRouter(AddBlog);