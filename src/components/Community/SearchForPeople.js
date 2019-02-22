import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import Map from '../../utils/Map';
import Geosuggest from 'react-geosuggest';

import store from '../../redux/store';
import constants from '../../redux/constants';

const google = window.google;

export default class SearchForPeople extends Component{
	

	constructor(){
		super();
		store.dispatch({type:constants.SAVE_PAGE, page:"SearchForPeople"});
		
		this.state = {
			items:[],
			searchName:""
		}
		this.firestore = firebase.firestore();
		this.radius = "10";
  		this.first = false;	
	}

	componentWillMount(){
		window.scrollTo(0, 0);

	}

	

	_distanceChange(e){
		this.radius = e.target.value;

		if(!this.first){
			this.first = true;
		}else{
			this._gatherCoords();
		}

		
		//this.child._updateMap(this.state.lng, this.state.lat, "FindPeople",this.radius);
		
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
	   


	    
	    let ref = this.firestore.collection("People");
	    let query = ref.where("lat","<=" , upperLat).where("lat", ">=", lowerLat);
	 
	    

		let items = [];

	    query.get().then((snapshot)=>{
	    	snapshot.forEach((doc)=> {
	    		// statements
	    		
	    		if(doc.data().lng >= lowerLong && doc.data().lng <= upperLong){
					
					console.log("pushing item: " + doc.data().lng)	
					items.push(doc.data());
					
	    		}
	    	});
			this.child._updateMap(this.lng,this.lat, "FindPeople",this.radius, items);
	    })
	   

	    

  	}
	_toRadians (angle) {

  		return angle * (Math.PI / 180);
	}

	_onSuggestSelect(suggest) {
		
		if(suggest){
			this.location = suggest.gmaps.formatted_address;
			this.lat = suggest.location.lat;
    		this.lng = suggest.location.lng;
    		this._gatherCoords()
		}
    	
    	//this.child._updateMap(this.lng,this.lat, "FindPeople","25");
  	}

  	_handleInput(e){
  		this.setState({
  			searchName:e.target.value
  		})
  	}


	_submitNameForm(e){
		
		console.log(this.state.searchName);
		this.firestore.collection()

	}

	render(){
		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">

			        	<div className="box">
					   		<Link to="/Community">&lt; Go back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
					   
				                	<h2>Find people</h2>
				                    <p>Find people near you!</p>
				                    <ul>
				                    	<li>Find someone to train with</li>
				                        <li>Search for sparring match</li>
				                        <li>Search for a challenge</li>
				                        <li>Search for similar people to connect with</li> 
					                </ul>
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box">        
				                    <form>
				                    	<h3>Search by location:</h3>
				                    	<div className="form-group">
				                            <label htmlFor="distance">Distance from:</label>
				                           
				                           	<select onChange={this._distanceChange.bind(this)} >
				                           		<option value="10">10</option>
				                           		<option value="25">25</option>
				                           		<option value="50">50</option>
				                           		<option value="100">100</option>
				                           		<option value="world">World</option>
				                           	</select>
				                        </div>
				                    	<div className="form-group">
				                            
				                            <Geosuggest
									          ref={el=>this._geoSuggest=el}
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng()}
									          radius="20" 

									        />
				                        
				                        </div>
				                        <Map data={this.state.items} onRef={ref =>(this.child = ref)} />
				                    </form>

				                    <hr />

				                    <form onSubmit={this._submitNameForm.bind(this)}>
				                        <h3>Search by name:</h3>
				                        <input type="text" value={this.state.searchName} onChange={this._handleInput.bind(this)} /><br />
				                       
				                        <hr />

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