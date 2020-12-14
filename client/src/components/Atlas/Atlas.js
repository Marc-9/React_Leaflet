import React, {Component} from 'react';
import {Button, ButtonGroup, Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {PROTOCOL_VERSION} from "../../utils/constants";
import { getOriginalServerPort, sendServerRequest, isJsonResponseValid, sendConfigRequest } from "../../utils/restfulAPI";
import * as configSchema from "../../../schemas/ResponseConfig";
import * as distanceSchema from "../../../schemas/ResponseDistance";
import Control from 'react-leaflet-control';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import homeicon from '../../static/images/man.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';



import 'leaflet/dist/leaflet.css';
import Find from "../Margins/Find";
import Trip from "../Margins/Trip";

let MAP_BOUNDS = [[-90, -180], [90, 180]];
let MAP_CENTER_DEFAULT = [40.5734, -105.0865];
const MARKER_ICON = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 40] });
const HOME_ICON = L.icon({iconUrl: homeicon, iconAnchor : [12, 40]});
const MAP_LAYER_ATTRIBUTION = "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors";
const MAP_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 19;




export default class Atlas extends Component {


  constructor(props) {
    super(props);

    this.setMarker = this.setMarker.bind(this);
    this.goHome = this.goHome.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.sendDistanceRequest = this.sendDistanceRequest.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);
    this.alterAtlas = this.alterAtlas.bind(this);
    this.state = {
        showFind: false,
        showTrip: false,
        markers: [],
        homeMarker: null,
        polyLine: L.layerGroup(),
        data: {'distance' : 0},
        units: "miles"
    }


  }

  render() {
    return (
        <div>
          <Container>
            <Row>
              <Col sm={12} md={{size: 10, offset: 1}}>
                {this.renderLeafletMap()}
              </Col>
            </Row>
          </Container>
        </div>
    );

  }

  renderLeafletMap() {
    return (
        <div>
        <Map
            ref={(ref) => { this.map = ref; }}
            className={'mapStyle'}
            boxZoom={false}
            useFlyTo={true}
            zoom={15}
            minZoom={MAP_MIN_ZOOM}
            maxZoom={MAP_MAX_ZOOM}
            maxBounds={MAP_BOUNDS}
            center={MAP_CENTER_DEFAULT}
            onClick={this.setMarker}
        >
          <TileLayer url={MAP_LAYER_URL} attribution={MAP_LAYER_ATTRIBUTION}/>
            {this.state.markers.map((position, idx) =>
                <Marker key={`marker-${idx}`} position={position.coords} icon={MARKER_ICON}>
                    <Popup offset={[0, -18]} className="font-weight-bold">{this.getStringMarkerPosition(position.coords)}</Popup>
                </Marker>
            )}
            {this.homeMarker()}
            <Control position="topleft" >
            <Button color="primary" size="sm" onClick={this.goHome}>Home</Button>
            </Control>
            <Control position="topleft" >
            <Button color="primary" size="sm" onClick={this.clearMarkers}>Clear</Button>
            </Control>
        </Map>
            <ButtonGroup>
                <Button color="primary" onClick={this.drawLine}>Calculate Distance</Button>
                {this.renderFind()}
                {this.renderCreateTrip()}
                {this.renderUnits()}
            </ButtonGroup>
            {"Total Distance: " + this.state.data.distance + " " + this.state.units}
        </div>
  );

  }

  goHome(){
      this.map.leafletElement.flyTo(MAP_CENTER_DEFAULT);
  }

  drawLine(){
      if(!this.markersValid()) {
          return
      }
      this.sendRequest();
      let markersLength = this.state.markers.length;
      let latlngs = [

          this.state.markers[markersLength-2].coords,
          this.state.markers[markersLength-1].coords
      ];

      let polyLine = L.polyline(latlngs, {color:'red'});
      this.state.polyLine.addLayer(polyLine);
      this.state.polyLine.addTo(this.map.leafletElement);
      this.map.leafletElement.fitBounds(polyLine.getBounds());
  }

  clearMarkers(){
//      if(this.map != undefined){
//            this.state.polyLine.removeFrom(this.map.leafletElement);
//            this.setState({polyLine: L.layerGroup()});
//      }
      this.clearLine();
      let marker = [];
      this.setState({markers:marker});
      this.setState({data: {'distance' : 0}});
  }
    // Deprecated for now
    selectMarker(position){
        let markers = this.state.markers;
        let index = null;
        for (let i = 0; i < markers.length; i++) {
            if (markers[i][0] == position[0] && markers[i][1] == position[1]) {
                index = i;
            }
        }
        markers.splice(index);
        markers.push(position);
        this.setState({markers:markers});
    }

    clearLine(){
    if(this.map != undefined){
                this.state.polyLine.removeFrom(this.map.leafletElement);
                this.setState({polyLine: L.layerGroup()});
          }
    }

    homeMarker(){
      if(this.state.homeMarker == null){
          return;
      }
      let fauxClickInfo = {
          "latlng": {
              "lat": this.state.homeMarker[0],
              "lng": this.state.homeMarker[1]
          }
      }
      return (
          <Marker key={`marker-home`} position={this.state.homeMarker} icon={HOME_ICON} onClick={()=> this.setMarker(fauxClickInfo)}>
              <Popup offset={[0, -18]} className="font-weight-bold">{this.getStringMarkerPosition(this.state.homeMarker)}</Popup>
          </Marker>
      )
    }

    renderFind(){
        return (
            <div>
                <Button color="primary" onClick={() => this.setState({showFind: true})}>Find...</Button>
                {this.showFindModal()}
            </div>
        );
    }
    showFindModal(){
        return (
            <Find
                isOpen={this.state.showFind}
                toggleOpen={(isOpen = !this.state.showFind) => this.setState({showFind: isOpen})}
                setMarker={this.setMarker}
                places={this.state.markers}
                filters={this.props.config}
            />
        );
    }
    renderCreateTrip(){
        return (
            <div>
                <Button color="primary" onClick={() => this.setState({showTrip:true})}>Create A Trip</Button>
                {this.showTripModal()}
            </div>
        );
    }
    showTripModal() {
      return (
          <Trip
              isOpen={this.state.showTrip}
              toggleOpen={(isOpen=!this.state.showTrip) => this.setState({showTrip: isOpen})}
              places={this.state.markers}
              units={this.state.units}
              updateMarkers={this.updateMarkers}
              alterAtlas={this.alterAtlas}
          />
      );

    }

    renderUnits() {
       return (
           <UncontrolledDropdown>
               <DropdownToggle caret>
                    Units
               </DropdownToggle>
               <DropdownMenu>
                   <DropdownItem header>Units</DropdownItem>
                   <DropdownItem
                       onClick={() => this.alterUnits(0)}>Miles</DropdownItem>
                   <DropdownItem
                       onClick={() => this.alterUnits(1)}>Kilometers</DropdownItem>
               </DropdownMenu>
           </UncontrolledDropdown>
       );
    }

    alterUnits(flag){
      let currentDistance = this.state.data.distance;
      if(flag){
          currentDistance *= 1.609;
          this.setState({units:"kilometers", data: {'distance' : Math.round(currentDistance)}});
      }
      else{
          currentDistance *= 0.621371;
          this.setState({units:"miles", data: {'distance' : Math.round(currentDistance)}});
      }
    }

  setMarker(mapClickInfo) {
      if(mapClickInfo === undefined){
          return;
      }
      this.clearLine();
      let markers = this.state.markers;
      let markerName = this.setMarkerName(mapClickInfo);

      markers.push({"name": markerName, "coords" : [mapClickInfo.latlng.lat,mapClickInfo.latlng.lng]});
      this.setState({markers: markers});
      this.checkDistance(markers);
  }

  setMarkerName(mapClickInfo){
    let markerName = "";
    if(mapClickInfo.hasOwnProperty('name')){
        markerName = mapClickInfo.name;
    }
    else {
        markerName = "Location" + (this.state.markers.length+1);
    }
    return markerName;
  }

  checkDistance(markers){
      if(this.map == undefined){
          return;
      }
      let mostRecent = markers[markers.length-1];
      if(markers.length < 2){
          this.map.leafletElement.flyTo(mostRecent.coords);
      }
      else {
          let beforeRecent = markers[markers.length - 2];
          if (Math.abs(mostRecent.coords[0] - beforeRecent.coords[0]) > 2 || Math.abs(mostRecent.coords[1] - beforeRecent.coords[1]) > 5) {
              this.map.leafletElement.flyTo(mostRecent.coords);
          }
      }
  }


    componentDidMount() {
    let getPosition = function (options) {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    }

    getPosition()
        .then((position) => {
            let coords =  [position.coords.latitude, position.coords.longitude];
            MAP_CENTER_DEFAULT = [position.coords.latitude, position.coords.longitude];
            this.setState({homeMarker: coords});
        })
        .catch((err) => {
          console.log(err.message);
        });

  }

  alterAtlas(polyline,distance){
      this.state.polyLine.removeFrom(this.map.leafletElement);
      this.setState({polyLine: L.layerGroup()});
      this.state.polyLine.addLayer(polyline);
      this.state.polyLine.addTo(this.map.leafletElement);
      this.map.leafletElement.fitBounds(polyline.getBounds());
      this.setState({data: {"distance" : distance}});
  }


  getStringMarkerPosition(position) {
      return position[0].toFixed(2) + ', ' + position[1].toFixed(2);
  }

  sendRequest() {
      sendConfigRequest(this.sendDistanceRequest)
  }


    sendDistanceRequest(config) {
      if(config["supportedRequests"].includes("distance"))
        {
            let markersLength = this.state.markers.length;
            sendServerRequest({
                requestType: "distance",
                requestVersion: PROTOCOL_VERSION,
                earthRadius: 3959,
                place1: {
                    latitude: this.state.markers[markersLength - 2].coords[0].toString(),
                    longitude: this.state.markers[markersLength - 2].coords[1].toString()
                },
                place2: {
                    latitude: this.state.markers[markersLength - 1].coords[0].toString(),
                    longitude: this.state.markers[markersLength - 1].coords[1].toString()
                },
            }, getOriginalServerPort())
                .then(distance => {
                    if (distance) {
                        this.processDistanceResponse(distance.data)
                    } else {
                        this.setState({data: distance.data})
                    }
                })
        }

    }

    processDistanceResponse(distance) {
        if(!isJsonResponseValid(distance, distanceSchema)){
            this.setState({data: false})}
        else{
            this.setState({data:distance})
        }
    }

    updateMarkers(newMarkers){
      this.clearMarkers()
      this.setState({markers:newMarkers});
    }

    markersValid() {
        return (this.state.markers.length > 1);
    }


}
