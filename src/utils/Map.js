

import React,  {Component} from 'react';


const google = window.google;

export default class Map extends Component {

  constructor(){
      super();
      this.state = { 
          zoom:9,
          data:"",
          centerLng:"",
          centerLat:"" 
      };


  }
 

  static propTypes() {
  	  //initialCenter: PropTypes.objectOf(React.PropTypes.number).isRequired
  }

	render() {
    return( 
        <div className="GMap" >
            <div className='GMap-canvas msgCompStyle' ref="mapCanvas">
        </div>
      </div>
    )
  }

  componentDidMount() {

      this.props.onRef(this);


      // create the map, marker and infoWindow after the component has
      // been rendered because we need to manipulate the DOM for Google =(
   
   
      //this.infoWindow = this.createInfoWindow()
  
      // have to define google maps event listeners here too
      // because we can't add listeners on the map until its created
    
  }

  componentWillUnmount(){
      this.props.onRef(undefined);
  }


  // clean up event listeners when component unmounts
  componentDidUnMount() {
      google.maps.event.clearListeners(this.map, 'zoom_changed') 
  }

  _updateMap(lng,lat,page,radius,items){
      let zoom;
     
      switch(radius){
          case "10":
              zoom = 9
              break;
          case "25":
              zoom = 8
              break;
          case "50":
              zoom = 7
              break;
          case "100":
              zoom = 6
              break;
          default:
              zoom = 1
      }

      this.items = items;

      this.setState({
          centerLat:lat,
          centerLng:lng,
          page:page,
          radius:radius,
          zoom:zoom
      },()=>{
          
          
          this.map = this._createMap();
          this.marker = this._createMarker();
                   
          google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
      })

    
  }

  _createMap() {
      
      let mapOptions = {
          zoom: this.state.zoom,
          center: this._mapCenter(),
          streetViewControl:false,
          
        }
        return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  _mapCenter() {
    
      return new google.maps.LatLng(
          this.state.centerLat,
          this.state.centerLng
      )
  }



  _createMarker() {

      // if coming from findbusiness do as is 
      if(this.state.page === "FindBusiness"){
          
          for(let obj of this.items){
             
              let businessLink = "<a class='compTextStyle' href='#/SingleBusiness/" + obj.key +"'>Visit business page</a>"
              let contentString = "<div class='InfoWindow'><h2>" + obj.businessName + "</h2><br /><p>" + businessLink + "</p></div>"
              
              let infowindow = new google.maps.InfoWindow({
                  content:  contentString
              })

              
              let coords = new google.maps.LatLng(obj.lat,obj.lng)
              
              this.marker = new google.maps.Marker({
                  position:coords,
                  map:this.map,
                  visible: true,


              })
              this.marker.setMap(this.map);

              this.marker.addListener('click',()=>{
              
                  infowindow.setPosition(coords)
                  infowindow.open(this.map);

              })
           
          }
      }else if(this.state.page === "SingleBusinessPage"){
          //else gather data from passed parameters?
           
          
          let infowindow = new google.maps.InfoWindow({
              content: this.props.data.businessName
          })

         
          let coords = new google.maps.LatLng(this.props.data.lat, this.props.data.lng)
          
          this.marker = new google.maps.Marker({
              position:coords,
              map:this.map,
              visible: true
          })
          this.marker.setMap(this.map);

          this.marker.addListener('click',()=>{
              
              infowindow.setPosition(coords)
              infowindow.open(this.map);
          })

      }else if(this.state.page === "FindEvents"){

          let obj;

          for(obj of this.items){
             
              let eventLink = "<a class='compTextStyle' href='/#/SingleEvent/" + obj.eventID +"'>Visit event page</a>"
              let contentString = "<div class='InfoWindow'><h2>" + obj.eventName + "</h2><br /><p>" + obj.eventType + "</p></p>" + eventLink + "</p></div>"
              
              //let contentString = "Hello";

              let infowindow = new google.maps.InfoWindow({
                  content:  contentString
              })

              
              let coords = new google.maps.LatLng(obj.lat, obj.lng)
              
              this.marker = new google.maps.Marker({
                  position:coords,
                  map:this.map,
                  visible: true
              })
              this.marker.setMap(this.map);

              this.marker.addListener('click',()=>{
              
                  infowindow.setPosition(coords)
                  infowindow.open(this.map);

              })
           
          }
      }else if(this.state.page === "SingleEventPage"){
          
          console.log(this.props.data);

          let contentString = "<div class='InfoWindow'><h2>" + this.props.data.name + "</h2></div>"

          let infowindow = new google.maps.InfoWindow({
              content: contentString
          })

     
          let coords = new google.maps.LatLng(this.state.centerLat, this.state.centerLng)
      
          this.marker = new google.maps.Marker({
              position:coords,
              map:this.map,
              visible: true
          })
          this.marker.setMap(this.map);

          this.marker.addListener('click',()=>{
              
              infowindow.setPosition(coords)
              infowindow.open(this.map);
          })
      }else if(this.state.page === "FindPeople"){

          let obj;

          for(obj of this.items){
             
             let peopleLink = "<a class='compTextStyle' href='/#/PersonProfile/" + obj.uid +"'>Visit users profile</a>"
               /* let people2Link = "<Link className='compTextStyle' to='/Person" + obj.uid + "'>Visit users profile</Link>"*/
              let contentString = "<div class='InfoWindow'><h2>" + obj.firstName + "</h2><br><p>" + obj.lastName + "</p><p>" + peopleLink + "</p></div>"
              
              //let contentString = "Hello";

              let infowindow = new google.maps.InfoWindow({
                  content: contentString
              })

              
              let coords = new google.maps.LatLng(obj.lat, obj.lng)
              
              this.marker = new google.maps.Marker({
                  position:coords,
                  map:this.map,
                  visible: true
              })
              this.marker.setMap(this.map);

              this.marker.addListener('click',()=>{
              
                  infowindow.setPosition(coords)
                  infowindow.open(this.map);

              })
           
          }
      }
      
	}

  
  handleZoomChange() {

      this.setState({
          zoom: this.map.getZoom()
      })
      
  }
}