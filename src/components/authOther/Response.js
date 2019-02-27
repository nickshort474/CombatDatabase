import React, {Component} from 'react';


class Response extends Component{
	
	render(){
		return(
			<div className="container"> 
				<div className="content-wrapper text-center">
					<h2>Thank you</h2>
					
					<div>
						<p>Thank you for your enquiry, we will aim to respond to you within three working days</p>
						<p>Until then heres a puppy!</p>
						<img src="../../assets/images/puppy.jpg" style={{"width":"100%"}} alt="a puppy" />
					</div>
				
					
					
				</div>
			</div>
		)
	}
	

}
	
export default Response;