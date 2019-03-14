import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import SingleEventComp from './SingleEventComp';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';

export default class EventsPage extends Component{
	
	
	constructor(){
		super();
		
		//save event page to store ready for rapge reloads
		store.dispatch({type:constants.SAVE_PAGE, page:"/Events"});

		//save event page as previous page for routing back to after either search or newly listed.
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"/Events"});


		this.state = {
			items:[]
		}
		this.showLimit = 10;
		
	}
	

	componentWillMount() {
		
		window.scrollTo(0, 0);
		this.items = [];
		this.counter = 0;

		this.firestore = firebase.firestore();

		let ref = this.firestore.collection("Events").orderBy("creationDate","desc").limit(this.showLimit);
		
		ref.get().then((snapshot)=>{
			//this.lastVisible = snapshot.docs[snapshot.docs.length - 1];

			snapshot.forEach((element)=>{
				
				this.items.push(element.data());
				this.counter++;
			})
			
			if(this.mounted){
				this.setState({
					items:this.items
				})
				
			}
		})
		
	    
	}

	componentDidMount(){
		
		this.mounted = true;
	}

	componentWillUnmount(){
		this.mounted = false;
	}

	_addEvent(){
		let userUID = LocalStorage.loadState("user");
		
		
		if(userUID){
			// redirect to AddEvents page
			this.props.history.push('/AddEvents');
			

		}else{
			window.alert("please create an account or sign in to add a business to our databases");
		}
	}


	render(){



		let events = this.state.items.map((event)=>{
			
			return <SingleEventComp name={event.eventName}  logo={event.eventLogo} description={event.eventDescription} date={event.eventTime} location={event.eventLocation} id={event.eventID} key={event.eventID} />
		})

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			                <div className="col-sm-3 text-center">

				                
									<Link to="FindEvents"><button type="button" className="btn btn-primarySmall extraMargin">Find an event</button></Link>
									<button type="button" className="btn btn-primarySmall extraMargin" onClick={this._addEvent.bind(this)}>Add an event</button>

				                
				                
			                </div>
			            	<div className="col-sm-9">
			                	<div className="box">
			                		<h2 className="text-center">Newly listed Events</h2>
			                		
			                		{events}
			                		
			                	</div>
			                	
			                </div>

			                
			            </div>
			        </section>
			    </div>
			</div>

		)
	}
}