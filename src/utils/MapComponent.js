import React, {Component} from 'react';
import {GoogleApiComponent} from 'google-maps-react';
import ReactDOM from 'ReactDOM';

export class MapComponent extends Component{
	
	render(){
		
		const style = {
			width:'100vw',
			height:'100vh'
		}

		if(!this.props.loaded){
			return <div>Loading</div>
		}

		return(
			<div style={style}>
			<Map google={this.props.google} />
			</div>
		)
	}
}

export default GoogleApiComponent({
	apiKey:"AIzaSyBfYqB4OCQeiDmzsDh4gBY1E_y6IKwdbJw"
})(MapComponent)


class Map extends Component{
	
	componentDidMount(){
   		this._loadMap();
  	}

	componentDidUpdate(){
		if(prevProps.google !== this.props.google){
			this._loadMap();
		}
	}


	_loadMap(){
		if(this.props && this.props.google){
			
			const {google} = this.props;
			const maps = google.maps;

			const mapRef = this.refs.map;
			const node = ReactDOM.findDOMNode(mapRef)

			let zoom = 14;
      		let lat = 37.774929;
      		let lng = -122.419416;

      		const center = new maps.LatLng(lat, lng);

      		const mapConfig = Object.assign({}, {
        		center: center,
        		zoom: zoom
     		})

      		this.map = new maps.Map(node, mapConfig);
		}
	}

	render(){
		return(
			<div id="map" ref="map">
				Loading map
			</div>
		)
	}
}