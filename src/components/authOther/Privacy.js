import React, {Component} from 'react';


export default class Privacy extends Component{
	

	
	componentWillMount(){
		window.scrollTo(0, 0);
	}


	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box text-center">
						<h2>Our Privacy Policy</h2>
						<p>If you are reading this we now own your soul.... Mwa ha ha ha ha!</p>
					</div>
				</div>
			</div>

		)
	}
}