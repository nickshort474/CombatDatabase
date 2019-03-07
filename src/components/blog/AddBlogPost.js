import React, {Component} from 'react';
import { withRouter,Link } from 'react-router-dom';
import {firebase} from '@firebase/app';

import TextArea from '../../utils/TextArea'
import {_compressImage} from '../../utils/CompressImage';
import {_disable} from '../../utils/DisableGreyOut';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';
		

import $ from 'jquery';


 class AddBlogPost extends Component{

	constructor(){
		super();
		
		this.state = {
			blogContent:[],
			firstPara:"",
			firstImage:"",
		}
		this.contentNum = 0;
		this.contentLog = [];
		this.imgArray = [];
		this.paraArray = [];
		this.imageUploadCounter = 0;
		this.paraUploadCounter = 0;
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
	}

	componentWillMount(){
		window.scrollTo(0, 0);
		store.dispatch({type:constants.SAVE_PAGE, page:`/AddBlogPost/${this.props.match.params.BlogName}`});
		
		this.hasImage = false;
	    this._addPara();
	    
	   	
	}



	_addPara(){

		this.contentNum++
		let currentVal = `par${this.contentNum}`;
		this.removeParaId = currentVal;

		this.contentLog.push(currentVal);
		this.paraArray.push(currentVal);

		let newblogContent = this.state.blogContent;
		
		
		newblogContent.push(<div key={currentVal}><TextArea rows="3" id={currentVal} key={currentVal}  /></div>);
		
		this.setState({
			blogContent:newblogContent,
			
		},function(){
			
			document.getElementById(currentVal).focus();
			
		});
	
	}

	_removePara(e){

		let id = e.target.id;
		//let currentVal = `par${id}`;

		let existingBlogContent = this.state.blogContent;

		let index = existingBlogContent.indexOf(<div key={id}><TextArea  rows="3" id={id}  /></div>)
		existingBlogContent.splice(index,1);
		

		let index2 = this.contentLog.indexOf(id);
		this.contentLog.splice(index2,1);

		let index3 = this.paraArray.indexOf(id);
		this.paraArray.splice(index3,1);
		
		
		this.setState({
			blogContent:existingBlogContent
		})
	}

	_handleBrowseClick(){
	   
	    var fileinput = $("#browse");
	    fileinput.click();
	}


	_handleImageChange(event){
		

		var reader = new FileReader();
		
		reader.onload = (e) => {
			
			this.contentNum++;
		
			let currentVal = `img${this.contentNum}`;
			this.contentLog.push(currentVal);

			_compressImage(e.target.result,400,(result)=>{
				this.imgArray.push(result);
				
			})
			

			let newblogContent = this.state.blogContent;
			newblogContent.push(<div key={currentVal}><img src={e.target.result} width='50%' height='50%' id={currentVal} alt="" /><br /></div>);
			
			this.setState({
				blogContent:newblogContent,
				
			});
		}

		reader.readAsDataURL(event.target.files[0]);
		this.hasImage = true;
		console.log(this.hasImage)
	}


	_handleSubmit(){
		
		_disable();
		this._validate()
		
		this.isFirstPara = true;
		this.isFirstImage = true;
		
		this.blogPostListAdded = false;
		
		let ref = this.firestore.collection("Blogs").doc(this.userUID).collection(this.props.match.params.BlogName).doc(this.state.postName).collection("contentBlocks");
		
		
		this.arrayNum = 0;
		
		console.log(this.contentLog);
		console.log(this.imgArray);

		this.contentLog.forEach((object) =>{
			

			//then save to firebase Database
			let strObj = object.toString().slice(0,3);
			
			let time = Date.now();
			
			if(strObj === "par"){
				

				let content = $(`#${object}`).val();
				
				if(this.isFirstPara === true){
					
					this.isFirstPara = false;
					this.firstPara = content;
					
				}
				
				let obj = {
					type:"para",
					data:content,
					time:time
				}

				ref.add(obj).then((docRef)=>{
					this.paraUploadCounter++;
					// test whether firstImage has been assigned a url or post has no image and firstPara has content 
					if((this.isFirstImage === false || this.hasImage === false) && this.isFirstPara === false && this.blogPostListAdded === false){
						this._addBlogPostList();
						this.blogPostListAdded = true;
					}

					if(this.imageUploadCounter === this.imgArray.length && this.paraUploadCounter === this.paraArray.length){
						// All content has been uploaded can route back to display

						this.props.history.push("/MyBlogPostList/" + this.userUID + "/" + this.props.match.params.BlogName);
					}
				});
				
			}else{
				
				let docRef = ref.doc();
				let img = this.imgArray[this.arrayNum];
				
				this.arrayNum++;
				
				this._addImageToStorage(docRef.id, img, (url)=>{
					
					if(this.isFirstImage === true){
						this.isFirstImage = false;
						this.firstImage = url;
					}

					
					let obj = {
						type:"img",
						data:url,
						time:time
					}
					docRef.set(obj).then(()=>{

						if(this.isFirstImage === false && this.isFirstPara === false && this.blogPostListAdded === false){
							
							this._addBlogPostList();
							this.blogPostListAdded = true;
						}

						if(this.imageUploadCounter === this.imgArray.length && this.paraUploadCounter === this.paraArray.length){
							// All content has been uploaded can route back to display

							this.props.history.push("/MyBlogPostList/" + this.userUID + "/" + this.props.match.params.BlogName);
						}

						
					});

					
					
				});
				
			}
		})
		this._addFollowersReference();
	}

	_validate(){

	}

	_addImageToStorage(imgRef,img,callback){
		
		
		let storageRef = firebase.storage().ref();
		console.log("trying to add image");
		// upload img to storage
		let blogImageFileLocation = `blogImages/${this.props.match.params.BlogName}/${imgRef}.jpg`;
		let uploadTask = storageRef.child(blogImageFileLocation).put(img);

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
					console.log(this.imageUploadCounter);
					this.imageUploadCounter++;
					callback(downloadURL);
					


			    });
			})
	}


	_addFollowersReference(){
		
		let ref = this.firestore.collection("BlogNames").doc(this.props.match.params.BlogName).collection("Followers");
		
		let followerArray = [];
		let postName = this.state.postName;

		ref.get().then((snapshot)=>{
			
			
			snapshot.forEach((snap)=>{
				
				followerArray.push(snap.id);
			})
			return followerArray
		}).then((array)=>{
			
			let batch = this.firestore.batch();
			
			let now = Date.now();
			
			array.forEach((value)=>{
				let ref = this.firestore.collection("userUIDs").doc(value).collection("PostFollowing").doc();
				batch.set(ref, {blogName:this.props.match.params.BlogName,postName:postName,date:now,type:"blog"})
			})
			batch.commit().then((value)=>{
				
			})

		})
	}


	_addBlogPostList(){


		let ref = this.firestore.collection("BlogPostList").doc(this.userUID).collection(this.props.match.params.BlogName);
		
		let currentDate = Date.now();
		
		let obj = {
			postIntro:this.firstPara,
			postName:this.state.postName,
			date:currentDate
		}

		if(this.hasImage === true){
			obj["firstImage"] = this.firstImage;
		}else{
			obj["firstImage"] = false;
		}

		ref.add(obj).then(()=>{
			
		})
	}


	
	_handlePostName(e){
		this.setState({
			postName:e.target.value
		})
	}

	

	render(){
		
		let blogContent = this.state.blogContent.map((content)=>{
			
			return <div key={content.key}>{content}</div>
		})


		const style = {
			width:"60%",
			fontSize:"18px"
		}
		
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row box">
			        		<div className="col-sm-12">
			        		
			        			<Link to={`/MyBlogPostList/${this.state.user}/${this.props.match.params.BlogName}`}>&lt; Go back</Link>
			        		
			        		</div>
			        	</div>
			        	<div className="row box text-center">
				        	<div className="col-sm-12">
				        		
				        		<div className="">
				        			
				        			
				        			<input type="text" id="postNameBox" style={style} rows="1" placeholder="Post name"  onChange={this._handlePostName.bind(this)} /><br /><br />
				        			{/*this.state.blogContent.map((content)=><div key={content}>{content}</div>)*/}
				        			{blogContent}
									<button className="btn btn-primarySmall" onClick={this._addPara.bind(this)}>Add paragraph</button>
									<button className="btn btn-primarySmall" id={this.removeParaId} onClick={this._removePara.bind(this)}>Remove last paragraph</button>

									<input type="file" id="browse" name="fileupload" style={{display:"none"}} onChange={this._handleImageChange.bind(this)} />
									<input type="button" className="btn btn-primarySmall" value="Add Image" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} /><br />
				        		</div>
				    		</div>
				        </div>
				      
						<div className="row text-center">	
							
								
							<input type="button" className="btn btn-primarySmall" value="Save blog post" id="save" onClick={this._handleSubmit.bind(this)} />
													
								
							 

						</div>
						
		            </section>
		        </div>
                
			</div>

		)
	}

}
export default  withRouter(AddBlogPost);