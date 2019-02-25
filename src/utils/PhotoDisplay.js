import React, {Component} from 'react';
import { firebase } from '@firebase/app';

import Lightbox from 'react-images';


export default class PhotoDisplay extends Component{
	
	constructor(){
		super();

		this.state = {
			folderName:"",
			lightboxIsOpen:false,
			currentImage:0,
			gallery:false
		}
		
			this.imgStyle = {
			width:"100%"
		}
		this.firestore = firebase.firestore();
		
	}

	componentDidMount(){
		
		if(this.props.page === "SingleBusinessPage"){
			
			let items = []
						
			let ref = this.firestore.collection("Business").doc(this.props.data).collection("businessThumbnailImages");
			ref.get().then((snapshot)=>{
				snapshot.forEach((snap)=>{	
					
					items.push(snap.data().url)
				})
			}).then(()=>{
				this.setState({
					items:items,
					gallery:true,
					alt:"business images"
				})
			});
		}else if (this.props.page === "SinglePersonPage"){

			console.log("SinglePersonPage");

		}else if(this.props.page === "SingleEventPage"){

			let items = []
						
			let ref = this.firestore.collection("Events").doc(this.props.data).collection("eventImages");
			ref.get().then((snapshot)=>{
				snapshot.forEach((snap)=>{	
					
					items.push(snap.data().url)
				})
			}).then(()=>{
				this.setState({
					items:items,
					gallery:true,
					alt:"event images"
				})
			});
		}

	}

	_openLightBox(){
		
		this._getFullSizeImages();
		this.setState({
			currentImage: 0,
			lightboxIsOpen:true
		})
		

	}

	closeLightbox(){
		this.setState({
			lightboxIsOpen:false,
			currentImage:0
		})
	}

	gotoPrevLightboxImage(){
		this.setState({
          currentImage: this.state.currentImage - 1,
        });
	}

	gotoNextLightboxImage(){
		this.setState({
          currentImage: this.state.currentImage + 1,
        });
	}


	_getFullSizeImages(){
		if(this.props.page === "SingleBusinessPage"){
			let items = []
					
			let ref = this.firestore.collection("Business").doc(this.props.data).collection("businessImages");
			ref.get().then((snapshot)=>{
				snapshot.forEach((snap)=>{	
					items.push(snap.data().url)
				})
			}).then(()=>{
				this.setState({
					items:items,
				})
			});
		}
	}


	render(){

		

		if(this.state.gallery){
			//console.log(this.state.items);
			let images = this.state.items.map((img)=>{
				return <img  style={this.imgStyle} src={img} alt={this.state.alt} key={img}/>
			})


			let imageArray = this.state.items.map((item)=>{
				return {src:item};
			})

			
			//const LIGHTBOX_IMAGE_SET = [{srcSet:this.state.items}];

			return(
			
				<div className="gallery">
					{this.state.items.length > 0 ?<div className="box">
						
						<Lightbox
						 
						  images={imageArray}
						  currentImage={this.state.currentImage}
						  isOpen={this.state.lightboxIsOpen}
						  onClickPrev={this.gotoPrevLightboxImage.bind(this)}
						  onClickNext={this.gotoNextLightboxImage.bind(this)}
						  onClose={this.closeLightbox.bind(this)}
						/>
						
						<div onClick={this._openLightBox.bind(this)}>{images}</div>
						
					</div> : null}
				</div>		
		)
		}else{
			return null
		}

		
			
	}
}