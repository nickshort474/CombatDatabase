import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import store from '../../redux/store';
import constants from '../../redux/constants';
import PersonComp from './PersonComp';
import { withFirebase } from '../Firebase';

class Community extends Component{

	constructor(){
		super();
		
		store.dispatch({type:constants.SAVE_PAGE, page:"Community"});

		let storeState = store.getState();
		this.userUID = storeState.userUID;
		
		this.state = {
			latestUser:[]
		}
		
		
		
	}


	render(){
		let signOrContact, latestUser;

		if(this.userUID){
			signOrContact = <Link to="/ContactsList"><button type="button" className="btn btn-primary extraMargin">Your Contacts</button></Link>
		}else{
			signOrContact = <p>Please <Link to="/Signin">sign in</Link> to see your contact list</p>
		}
		latestUser = this.state.latestUser.map((user)=>{
			return <PersonComp  userName={user.userName} uid={user.userUID}  key={user.userUID} />
		})

		return(
		    <div className="container">
				<div className="content-wrapper">
					<div className="row box text-center">
						<div className="row">
							<Link to="/FindPeople"><button type="button" className="btn btn-primary extraMargin">Find people</button></Link>
							{signOrContact}

						</div>
					</div>
					<div className="row box text-center">	
						<div className="row">
							{latestUser}
						</div>
					</div>

				</div>
			</div>
		)
	}
}

export default withFirebase(Community);