import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';



export class MapContainer extends Component {
    
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}
    };

    onMarkerClick(props, marker, e){
        
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }
    
    onClose = props => {
        if(this.state.showingInfoWindow) {
            this.setState({
               showingInfoWindow: false,
               activeMarker: null
             });
        }
    }
    

  render() {
    return (
      <div>
        <Marker onClick={this.onMarkerClick} name={'current location'} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
     </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBfYqB4OCQeiDmzsDh4gBY1E_y6IKwdbJw'
})(MapContainer);