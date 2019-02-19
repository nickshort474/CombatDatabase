import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import Map from '../../utils/Map';
import Geosuggest from 'react-geosuggest';

import store from '../../redux/store';
import constants from '../../redux/constants';
import SingleEventComp from './SingleEventComp';

const google = window.google;

export default class FindEvents extends Component{

	constructor(){
		super();

		store.dispatch({type:constants.SAVE_PAGE, page:"FindEvents"});
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"FindEvents"});
		//store.dispatch({type:constants.HAS_SAVED_EVENT_SEARCH, hasSavedEventSearch:false})
		this.first = false;
  		this.firestore = firebase.firestore();	

		this.state = {
			items:[],
			eventComps:[],
		}
	}

	componentWillMount(){
		window.scrollTo(0, 0);
			   
	}

	componentDidMount(){
		
		let storeState = store.getState();

		// get state of previouslySavedeventSearch from redux
		let hasSavedSearch = storeState.hasSavedEventSearch;
		
		//if true load state and apply
		if(hasSavedSearch){
			console.log("has saved search");
			let eventSearchValues = storeState.eventSearchValues;

			this.lat = eventSearchValues.lat;
			this.lng = eventSearchValues.lng;
			this.radius = eventSearchValues.radius;

			this.setState({
				location:storeState.eventSearchTerm,
				items:storeState.eventSearchObj,
				eventComps:storeState.eventSearchObj
			},()=>{
				this.child._updateMap(this.lng, this.lat, "FindEvents",this.radius, this.state.items);
			})
		}else{

		}

	}

	_distanceChange(evt){
		this.radius = evt.target.value;
		
				
		if(!this.first){
			this.first = true;
		}else{
			this._gatherCoords();
		}
		
		
	}

	_onSuggestSelect(suggest) {
		if(suggest){
	    	this.location = suggest.gmaps.formatted_address;
	    	this.lat = suggest.location.lat;
	    	this.lng = suggest.location.lng;
	    	
	    	let searchValues = {
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,
	    		radius:this.radius
	    	}

	    	store.dispatch({type:constants.SAVE_EVENT_SEARCH_TERM, eventSearchTerm:this.location})
	    	store.dispatch({type:constants.SAVE_EVENT_SEARCH_VALUES, eventSearchValues:searchValues})
	    	store.dispatch({type:constants.HAS_SAVED_EVENT_SEARCH, hasSavedEventSearch:true})
	    	this._gatherCoords()

    	}
    	

  	}


	_gatherCoords(){
  			   
	    let latDifference =   this.radius / 69;
	    let lowerLat = this.lat - latDifference;
	    let upperLat = this.lat + latDifference;

	    
	    let longRadians = this._toRadians(this.lat);
	    
	    let milesPerLong = longRadians * 69.172;
	   

	    let longDifference = this.radius / milesPerLong;
	    let lowerLong = this.lng - longDifference;
	    let upperLong = this.lng + longDifference;
	   


	    
	    let eventReference = this.firestore.collection("Events");
	    let query = eventReference.where("lat","<=" , upperLat).where("lat", ">=", lowerLat);
	 
	    

		let items = [];

	    query.get().then((snapshot)=>{
	    	snapshot.forEach((doc)=> {
	    		// statements
	    		
	    		if(doc.data().lng >= lowerLong && doc.data().lng <= upperLong){
					
					items.push(doc.data());
					
	    		}

	    	});
	    	store.dispatch({type:constants.SAVE_SEARCHED_EVENTS,eventSearchObj:items})

	    	this.setState({
	    		eventComps:items
	    	});
			this.child._updateMap(this.lng,this.lat, "FindEvents",this.radius, items);

	    })
	   

	    

  	}
	_toRadians (angle) {

  		return angle * (Math.PI / 180);
	}


	render(){

		let eventComps;

		eventComps = this.state.eventComps.map((event,index)=>{

			return <SingleEventComp name={event.eventName} description={event.eventDescription} location={event.eventLocation}  logo={event.eventLogo} date={event.creationDate} id={event.eventID} key={index}/>		
		})



		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box">
					   		<Link to="Events">&#60; Back to events</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
					   
				                	<h2>Find an Event</h2>
				                    <p>Find a event near you!</p>
				                    
				                        <ul>
				                        	<li>Tournaments</li>
				                        	<li>Displays</li>
				                        	<li>Challenge Matches</li>
				                        </ul>
				                        
				                       
				                    
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box">        
				                    <form>
				                    	<div className="form-group">
				                            <label htmlFor="distance">Distance from:</label>
				                           
				                           	<select value={this.radius} onChange={this._distanceChange.bind(this)} >
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
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng(53.558572, 9.9278215)}
									          radius="20"
									          initialValue={this.state.location} 

									        />

				                           	<Map data={this.state.items} onRef={ref =>(this.child = ref)} />

				                        </div>
				                        <div className="box">
				                        	{eventComps}
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