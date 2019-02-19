import React,{Component} from 'react';


export default class SideBarAdvert extends Component{
	
	constructor(){
		super();
		
		this.state = {
			styles:{
				width:"50%",
				height:"150px",
				float:"left"
			},
			containerStyle:{
				height:'150px'
			}
		}
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}

	render(){
		return(
			<div>
            	<div className="box colored site-partner">
                   	<h3 className="text-center">Our partners</h3>			
                    
                    <div style={this.state.containerStyle}>
                    
                    	<img src="../images/blitz.png"  className="img-responsive center-block" alt="Our partner" style={this.state.styles} />
                    	{/*<img src="../../assets/images/under_armour.png"  className="img-responsive center-block" alt="Our 2nd partner" style={this.state.styles} />*/}
                    	<img src="/images/under_armour.png" className="img-responsive center-block" alt="Our 3rd partner" style={this.state.styles} />
                    	
                    </div>
                </div>
			</div>
		)
	}
}