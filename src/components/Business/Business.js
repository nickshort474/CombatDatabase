import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
//import { firebase } from '@firebase/app';

import { withFirebase } from '../Firebase';

import BusinessComp from './BusinessComp';

import store from '../../redux/store';
import constants from '../../redux/constants';



class Business extends Component{
	

	constructor(props){
		super(props);

		store.dispatch({type:constants.SAVE_PAGE, page:"Business"});
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"Business"});
		
		this.state = {
			items:[],
			imageUrl:""
			
		}

		this.showLimit = 2;
	}

	
	
	componentWillMount() {
		window.scrollTo(0, 0);
		
		this.counter = 0;		
		this.items = [];
	    
	    let ref = this.props.firebase.mainRef().collection("Business").orderBy("creationDate","desc").limit(this.showLimit);

	    ref.get().then((snapshot)=>{
	    	this.lastVisible = snapshot.docs[snapshot.docs.length - 1];

	    	snapshot.forEach((element)=>{
			
				this.items.push(element.data());
				this.counter++;
			})
			console.log(this.counter);
			
			if(this.mounted){
				this.setState({
					items:this.items
				})
				
			}
	    })

		
	}

	componentDidMount(){
		this.mounted = true
	}

	componentWillUnmount(){
		this.mounted = false;
	}


	_handleMoreButton(){
		this.counter = 0;

		let ref = this.props.firebase.mainRef().collection("Business").orderBy("creationDate", "desc").startAfter(this.lastVisible).limit(this.showLimit);
		
		ref.get().then((snapshot)=>{
			this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
			
			snapshot.forEach((element)=> {
				this.items.push(element.data())
				this.counter++;
			});
			this.setState({
	    		items:this.items
	    	});
	    	
		})

	}

	_addBusiness(){
		
		let user = store.getState().userUID;
		
		if(user){
			// redirect to AddBusiness page
			this.props.history.push('/AddBusiness');
			

		}else{
			window.alert("please create an account or sign in to add a business to our databases");


		}
	}



	render(){

		let moreButton;

		if(this.counter === this.showLimit){
			console.log(this.counter)
			moreButton = <button className="btn-primary" onClick={this._handleMoreButton.bind(this)}>Show more businesses</button>
		}


		let business = this.state.items.map((business) =>{
			
			return <BusinessComp businessName={business.businessName} summary={business.summary} businessKey={business.key} location={business.location} businessLogo={business.businessLogo} key={business.key} />
		})

		
		return(
			<div className="container">
			 	<section className="content-wrapper">
					
					<div className="row">
						<div className="col-sm-3 text-center">
							
								<Link to="FindBusiness"><button type="button" className="btn btn-primary extraMargin">Find Business</button></Link>
								<button type="button" className="btn btn-primary extraMargin" onClick={this._addBusiness.bind(this)}>Add Business</button>

																
						</div>
						<div className="col-sm-9">
							<div className="box">
								<h2 className="text-center">Recently listed businesses</h2>
								<div>{business}</div>
								<div className="text-center">
									<p>{moreButton}</p>
								</div>	
							</div>

						</div>
						
					</div>
				</section>
			</div>

		)
	}
}
export default withRouter(withFirebase(Business));
