import React, {Component} from 'react';

export default class Response extends Component{
	
	constructor(){
		super();

		

		this.state ={
			styles:{
				width:"300px",
				height:"150px"
			}
		}

		


	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}

	
	
	render(){
		return(
			<div>
				<div className="container"> 
					<div className="content-wrapper text-center">
						<h2>Thank you</h2>
						
						<div>
							<p>Thank you for your enquiry, we will aim to respond to you within three working days</p>
							<p>Until then heres a puppy!</p>
							<img src="../../assets/images/puppy.jpg" style={this.state.styles} alt="a puppy" />
						</div>
					
						
						
					</div>
				</div>
			</div>

		)
	}
}
