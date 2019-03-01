import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import Review from './ReviewComp';
import PhotoDisplay from '../../utils/PhotoDisplay';
import Map from '../../utils/Map';

import store from '../../redux/store';
import constants from '../../redux/constants';

import defaultLogo from '../../assets/images/default.jpg'

import LocalStorage from '../../utils/LocalStorage';


export default class SingleBusinessPage extends Component{
	
	
	componentWillMount() {
		window.scrollTo(0, 0);

		// get previous page from redux for back button
		let storeState = store.getState();
		let previousPage = storeState.prevPage;
		
		this.user = LocalStorage.loadState("user");

		// save current page ref to redux
		let pageString = `/SingleBusiness/${this.props.match.params.BusinessKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});

		//create ref to firestore
		this.firestore = firebase.firestore();
		
		//save state
		this.setState({
			previousPage:previousPage,
			reviews:[],
			owner:false
		})
		
		//collect business information and reviews
		this._getBusinessInfo();
		this._getReviews();
		
	    
	}

	_getBusinessInfo(){
		
		//create reference to business section of firestore
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

		let owner = false;
		//gather all business data
		ref.get().then((snapshot)=>{ 
			
			//check whether person viewing page is owner/creator so they can alter content
			
			if(snapshot.data().creator === this.user){
	    		owner = true;	
	    	}

	    	//save returned data to state
			this.setState({
	    		businessName:snapshot.data().businessName,
				location:snapshot.data().location,
				businessLogo:snapshot.data().businessLogo,
				summary:snapshot.data().summary,
				fullDescription:snapshot.data().description,
				phone:snapshot.data().phone,
				email:snapshot.data().email,
				owner:owner,
				items:snapshot.data(),
				images:snapshot.data().businessImages
	    	},function(){
	    		//call map update 
	    		this.child._updateMap(snapshot.data().lng, snapshot.data().lat, "SingleBusinessPage", "10");
	    		
	    	});
		});

	}
	

	_getReviews(){

		// set up review section ref
		let firebaseRef = this.firestore.collection("Reviews").doc(this.props.match.params.BusinessKey).collection("Review")

		//set review array
		let reviews = [];

		//get data
		firebaseRef.get().then((snapshot)=>{

			//loop through snapshot
			snapshot.forEach((snap)=>{
				//push to review array
				reviews.push(snap.data());
			})
			//save review array to state
			this.setState({
				reviews:reviews
			})
		})


	}


	render(){

		let EditPage,AddImages,EditLogo;

		//map state review array to Review components
		let reviews = this.state.reviews.map((review) => {
			
			return <Review title={review.Title} body={review.Comment} userUID={review.UserUID} user={review.Username} stars={review.Stars} key={review.Title} />
		})

		if(this.state.owner === true){
			
			EditPage = <Link to={`/EditBusiness/${this.props.match.params.BusinessKey}`}><p>Edit the information on this page</p></Link>
			AddImages = <Link to={`/AddBusinessImages/${this.props.match.params.BusinessKey}`}><p>Click here to add images to your page</p></Link>
			EditLogo = <div><Link to={`/EditBusinessLogo/${this.props.match.params.BusinessKey}`}><p>Edit your business logo</p></Link></div>
		}

		let leaveReview;

		if(this.user && !this.state.owner){
			leaveReview = <div className="row"><div className="box"><Link to={`/Review/${this.props.match.params.BusinessKey}`}><p>Leave a review for this business</p></Link></div></div>
		}else if(this.state.owner){
			leaveReview = null
		}else{
			leaveReview = <div className="row"><div className="box">Please sign in to leave a review of this business</div></div>
		}

		return(
			<div className="container">
				<section className="content-wrapper">
					
					<div className="row">
						<div className="box">
							<Link to={'/' + this.state.previousPage}>&#60; Back</Link>
							
						</div>
					</div>

					<div className="row">

						<div className="col-sm-9">
							<div className="row">
								
								<div className="text-center">
									<h2 className="box">{this.state.businessName}</h2>
								</div>
								
							</div>
							<div className="row">
								
								<div className="box">
									<p>{this.state.location}</p>
									<p>{this.state.phone}</p>	
									<p>{this.state.email}</p>
								</div>
									
								
							</div>	
							<div className="row">
								<Map initialCenter={this.state.initialCenter} data={this.state.items} onRef={ref =>(this.child = ref)}/>
							</div>

							<div className="row">
								
								<p className="box">{this.state.summary}</p>
								
							</div>
							
								
							
							<div className="row">
								
								<p className="box">{this.state.fullDescription}</p>
								
							</div>
							<div>
								{reviews}
							</div>

							{leaveReview}
							
							<div className="row">
								<div className="box">
									{EditPage}
								</div>
							</div>

						</div>

						<div className="col-sm-3 text-center">
							<div className="text-center">
								<img src={this.state.businessLogo ? this.state.businessLogo: defaultLogo}  width="100%"  alt="Business logo" />
							</div>
							<div className="text-center">
								{EditLogo}
							</div>
							<PhotoDisplay data={this.props.match.params.BusinessKey} page="SingleBusinessPage" />
							<div className="text-center">
								{AddImages}
							</div>
						</div>

					</div>	
					

				</section>
			</div>

		)
	}
}