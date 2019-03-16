import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import EditLink from "./EditLink";

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';


export default class Styles extends Component{
	
	constructor(){
		super();

		this.dropDownStyle = {
			color:"black"
		}

		let storeState = store.getState();
		let style = storeState.style;
		

		if(style === undefined){
			this.currentSelectedStyle = "Karate";
		}else{
			this.currentSelectedStyle = style;
		}

		store.dispatch({type:constants.SAVE_PAGE, page:"Styles"});
		

		this.state = {
			styleItems:[],
			styleName:"",
			countryOfOrigin:"",
			dateCreated:"",
			definingFeatures:"",
			famousPractitioners:"",
			fulldescription:"",
			history:""
		}

		
		let styleItems = [];
		this.userUID = LocalStorage.loadState("user");
		
		this.firestore = firebase.firestore();
		let ref = this.firestore.collection("Styles");

		ref.get().then((snapshot)=>{
			
			snapshot.forEach((element)=> {
				// statements
				styleItems.push(element.data().Name);
			});

			this.setState({
				styleItems:styleItems
			},(initialStyle)=>{
				this._handleStyleClick(false);
			})
		})

		
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}

	_handleStyleClick(event){
		
		if(event !== false){
			
			this.currentSelectedStyle = event.target.value;
			
		}
		
		store.dispatch({type:constants.SAVE_STYLE, style:this.currentSelectedStyle});
		

		if(this.currentSelectedStyle !== "Select style to view"){
			
			
			let ref = this.firestore.collection("Styles").doc(this.currentSelectedStyle); 
			
			ref.get().then((snapshot)=>{
				
				this.setState({
					styleName:snapshot.data().Name,
					countryOfOrigin:snapshot.data().Country,
					dateCreated:snapshot.data().Created,
					definingFeatures:snapshot.data().Features,
					famousPractitioners:snapshot.data().Practitioners,
					fullDescription:snapshot.data().Description,
					history:snapshot.data().History
				})
			})

			
		}else{
			console.log("no value");
		}
	}

	_addStyle(){

		if(this.userUID){
			this.props.history.push('/AddStyle');
		}else{
			alert('Please sign in to add to the style wiki');
		}
	}


	render(){
		
		var styleList = this.state.styleItems.map((styleName) => {
			
			let routeString = styleName.replace(/\s+/g, '');
			
			if(styleName === this.currentSelectedStyle){
				return <option key={routeString}  value={styleName}>{styleName}</option>
			}else{
				return <option key={routeString} value={styleName}>{styleName}</option>
			}

			
		})


		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			        		
			        		{/*Start of Sidebar*/}
			        		<div className="col-sm-3">
			        			
			        			<div className="row">
			        				<div className="col-sm-12">
			        					<div className="style-box-less-padding  greyedContent">
					        				<div className="text-center">
						        				<p>Style:</p>
							        			<select onChange={this._handleStyleClick.bind(this)} value={this.currentSelectedStyle} style={this.dropDownStyle}>
							        				<option>Select style:</option>
							        				{styleList}
							        			</select><br /><br />
						        			</div>
					        			</div>
				        			</div>
			        			</div>

			        			
			        			
			        			
			        		</div>



			        		{/*Start of main window*/}
							<div className="col-sm-9">
			                    
								<div className="row">

									<div className="col-sm-6">
										<div className="box text-center greyedContent">
											<h1><b>{this.state.styleName}</b></h1>
											<h2>{this.state.countryOfOrigin}</h2>
										</div>
									</div>


									<div className="col-sm-6">
										<div className="box greyedContent">
											<div className="row">
												<div className="col-xs-6">
													<p><i><b>Date created:</b></i></p>
												</div>
												<div className="col-xs-6 text-right">
													<EditLink data="Created" style={this.state.styleName} />
													
												</div>
												
											</div>
											<div> {this.state.dateCreated ? this.state.dateCreated : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

										</div>
									</div>

								</div>


			                    <div className="box greyedContent">
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>Defining features:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="Features" style={this.state.styleName} />
										</div>
									</div>
									<div> {this.state.definingFeatures ? this.state.definingFeatures : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>
								
								
								
								<div className="box greyedContent">
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>Famous practitioners:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="Practitioners" style={this.state.styleName} />
										</div>
									</div>



									

									<div>{this.state.famousPractitioners ? this.state.famousPractitioners : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>

								<div className="box greyedContent">
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>Full description:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="Description" style={this.state.styleName} />
										</div>
									</div>

									

									

									<div>{this.state.fullDescription ? this.state.fullDescription : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>
								<div className="box greyedContent">
									
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>History:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="History" style={this.state.styleName} />
										</div>
									</div>
									

									

									<div>{this.state.history ? this.state.history : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>
								<div className="row">
			        				<div className="col-sm-12">
			        					
			        					
				        					<div className="col-sm-4 addStyleButton" onClick={this._addStyle.bind(this)}>
				        						{/*<Link to="/AddStyle" className="clearFloat">*/}
					        						<div className="box text-center greyedContent">
					        							<h4>Add Style</h4><i className="fa fa-plus-circle fa-3x" alt="Add Style"></i>
								                	</div>
							                	{/*</Link>*/}
							                </div>

							                <div className="col-sm-4">
								                <Link to={"/EditHistory/" + this.state.styleName}>
								                <div className="box text-center greyedContent">	
									                <h4>Edit History</h4><i className="fa fa-history fa-3x" alt="Edit History" ></i>
												</div>
												</Link>
										 	</div>
										 	
										 	<div className="col-sm-4">
								                <Link to={`/Report/${this.currentSelectedStyle}`}>
									                <div className="box text-center greyedContent">	
										                <h4>Report Content</h4><i className="fa fa-flag-checkered fa-3x" alt="Report content" ></i>
													</div>
												</Link> 
										 	</div>

			        				</div>
			        			</div>
								

								
			            	</div>

			            	

			        	</div>
			        	
			        </section>
			    </div>
			</div>
			

		)
	}
}