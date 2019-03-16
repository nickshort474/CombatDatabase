import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import Map from '../../utils/Map';

/*import MapContainer from '../../utils/MapComponent2';*/

import Geosuggest from 'react-geosuggest';

import constants from '../../redux/constants';
import store from '../../redux/store';

import BusinessComp from './BusinessComp';

const google = window.google;


export default class FindBusiness extends Component{

	constructor(){
		super();
		
		store.dispatch({type:constants.SAVE_PAGE, page:"FindBusiness"});
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"FindBusiness"});
		
		this.first = false;
		this.firestore = firebase.firestore();
		
		

		this.state = {
			items:"",
			businessComps:[],
			radius:"25"
			
		}
		//store.dispatch({type:constants.HAS_SAVED_BUSINESS_SEARCH, hasSavedBusinessSearch:false})
	}
	
	componentWillMount(){
		window.scrollTo(0, 0);

	}

	componentDidMount(){

		let storeState = store.getState();

		// get state of previouslySavedBusinessSearch from redux
		let hasSavedSearch = storeState.hasSavedBusinessSearch;
		
		//if true load state and apply
		if(hasSavedSearch){
			let businessSearchValues = storeState.businessSearchValues;

			this.lat = businessSearchValues.lat;
			this.lng = businessSearchValues.lng;
			

			this.setState({
				location:storeState.businessSearchTerm,
				items:storeState.businessSearchObj,
				businessComps:storeState.businessSearchObj,
				radius:businessSearchValues.radius
			},()=>{
				this.child._updateMap(this.lng, this.lat, "FindBusiness",this.state.radius, this.state.items);
			})
		}else{

		}
		
		
	}
	
	_distanceChange(evt){
		
		this.setState({
			radius:evt.target.value,
		})
		
				
		if(!this.first){
			this.first = true;
		}else{
			if(this.hasSuggestion){
				this._gatherCoords();
			}
		}
		
		
	}

	_onSuggestSelect(suggest) {
		if(suggest){

			this.hasSuggestion = true;
			
	    	this.location = suggest.gmaps.formatted_address;
	    	this.lat = suggest.location.lat;
	    	this.lng = suggest.location.lng;
	    	
	    	let searchValues = {
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,
	    		radius:this.radius
	    	}


	    	store.dispatch({type:constants.SAVE_BUSINESS_SEARCH_TERM, businessSearchTerm:this.location})
	    	store.dispatch({type:constants.SAVE_BUSINESS_SEARCH_VALUES, businessSearchValues:searchValues})
	    	store.dispatch({type:constants.HAS_SAVED_BUSINESS_SEARCH, hasSavedBusinessSearch:true})
	    	this._gatherCoords();
    	}
		
  	}


  	_gatherCoords(){
  			   
	    let latDifference =   this.state.radius / 69;
	    let lowerLat = this.lat - latDifference;
	    let upperLat = this.lat + latDifference;

	    
	    let longRadians = this._toRadians(this.lat);
	    
	    let milesPerLong = longRadians * 69.172;
	   

	    let longDifference = this.state.radius / milesPerLong;
	    let lowerLong = this.lng - longDifference;
	    let upperLong = this.lng + longDifference;
	  


	    
	    let businessReference = this.firestore.collection("Business");
	    let query = businessReference.where("lat","<=" , upperLat).where("lat", ">=", lowerLat);
	   
		let items = [];

	    query.get().then((snapshot)=>{
	    	snapshot.forEach((doc)=> {
	    		// statements
	    		
	    		if(doc.data().lng >= lowerLong && doc.data().lng <= upperLong){
									
					items.push(doc.data());
					
	    		}
	    	});

			store.dispatch({type:constants.SAVE_SEARCHED_BUSINESS,businessSearchObj:items})

	    	this.setState({
	    		businessComps:items
	    	});

			this.child._updateMap(this.lng, this.lat, "FindBusiness",this.state.radius, items);
	    })

  	}


  	_toRadians (angle) {

  		return angle * (Math.PI / 180);
	}

	

	render(){
		let businessComps;

		
		businessComps = this.state.businessComps.map((business,index)=>{
			return <BusinessComp businessName={business.businessName} summary={business.summary} location={business.location} key={index} businessLogo={business.businessLogo} businessKey={business.key} />		
		})
		

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box  greyedContent">
					   		<Link to="/Business">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box greyedContent">
					   
				                	<h2>Find A Business</h2>
				                    <p>Find somewhere to train, shop or anything martial arts related near you.</p>
				                    
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box greyedContent">


				                    <form>

				                    	<div className="form-group">
				                            <label htmlFor="distance">Distance from:</label>
				                           
				                           	<select value={this.state.radius} onChange={this._distanceChange.bind(this)} >
				                           		<option value="10">10</option>
				                           		<option value="25">25</option>
				                           		<option value="50">50</option>
				                           		<option value="100">100</option>
				                           		<option value="1000">World</option>
				                           	</select>
				                        </div>

				                    	<div className="form-group">
				                            <label htmlFor="searchTerm">Location</label>
				                            <Geosuggest
									          ref={el=>this._geoSuggest=el}
									          initialValue={this.state.location}
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng()}
									          radius="20" 

									        />
				                           
				                        </div>
				                      
				                        <Map data={this.state.items} onRef={ref =>(this.child = ref)} />

				                        {/*<p>What would you like to search by?</p>
				                        <div className="form-group">
				                        	<input type="radio" name="search" defaultValue="style" onChange={this._handleSearchChoice.bind(this)}  />Style<br />
				                        	<input type="radio" name="search" defaultValue="description" onChange={this._handleSearchChoice.bind(this)}/>Description
				                        </div>
										

				                        
				                        <div className="form-group">
				                            {this.searchChoice}											
				                        </div>
				                       
				                        <button type="submit" className="btn btn-primary">Submit</button>*/}

				                        <div className="box">
				                        	{businessComps}
				                        </div>
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