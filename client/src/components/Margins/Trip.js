import React, { Component } from "react";
import { Alert, Button, Row, Col, Input, Form, Modal, ModalBody, ModalFooter, ModalHeader, NavItem, NavLink, Nav, Table, UncontrolledDropdown, DropdownToggle,UncontrolledCollapse, DropdownMenu, DropdownItem, Card, CardBody} from "reactstrap";
import {PROTOCOL_VERSION} from "../../utils/constants";
import {sendServerRequest, isJsonResponseValid, getOriginalServerPort} from "../../utils/restfulAPI";
import {renderRow} from "../../utils/uiUtilities";
const {Parser} = require('json2csv')

import * as fileSchema from "../../../schemas/TripFile";
import * as tripSchema from "../../../schemas/ResponseTrip"

export default class Trip extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            loadFile: [],
            trip: {},
            optimize: "0.0",
            fileType: "JSON",
            alertVisible: false,
            downloadFileType: {
                "JSON": 'application/json',
                "CSV": 'text/csv;charset=utf-8;'
            },
            units: {
                "miles": "3959.0",
                "kilometers": "6371.0"
            }
        };
        this.setState = this.setState.bind(this);
        this.changeOptimize = this.changeOptimize.bind(this);
        this.hasValidTrip = this.hasValidTrip.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader toggle={() => this.props.toggleOpen()}>
                        {this.renderHeader()}
                    </ModalHeader>
                    <ModalBody>
                        {this.renderModalBody(this.state.activeTab)}
                    </ModalBody>
                    <ModalFooter>
                        {this.renderModalFooter()}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    renderHeader(){
        return (
            <div>
                My Trip
                <Nav tabs>
                    {this.createNavItem('1', "Create")}
                    {this.createNavItem('2', "Load")}
                    {this.createNavItem('3', "Itinerary")}
                </Nav>
            </div>
        );
    }

    renderModalBody(activeTab) {
        switch(activeTab){
            case '1':
                return this.renderCreateForm();
            case '2':
                return this.renderLoadForm();
            case '3':
                return this.renderItinerary();
        }
    }


    renderCreateForm() {
        if(this.props.places.length !== 0 ) {
            return (
                <div>
                    Places:
                    {this.renderAddedPlaces()}
                </div>
            );
        }
        else{
            return (
                <div>
                Either load a trip or click on the map to populate this list.
                </div>
            )
        }
    }

    renderAddedPlaces() {
        return this.props.places.map((place, index) =>
            <div key={index}>
                {renderRow(place.name , 'Lat: ' + place.coords[0].toFixed(2) + ' Long: ' + place.coords[1].toFixed(2))}
            </div>
        );
    }


    renderLoadForm() {
        return (
            <div>
                <Alert color={"warning"} isOpen={this.state.alertVisible} toggle={this.dismissAlert}>
                    Invalid File Format. Upload a JSON.
                </Alert>
                <Form>
                    <Input type={"file"} onChange={(e) => this.handleLoadFile(e)} accept={".json"} />
                </Form>
            </div>
        );
    }

    dismissAlert(){
        this.setState({alertVisible:false})
    }


    handleLoadFile(event){
        let reader = new FileReader()
        let file = event.target.files[0]
        reader.onloadend = this.loadFile.bind(this);
        reader.readAsText(file)
    }

    loadFile(event){
        const fileContent = event.target.result
        let response= null
        try {
            response = JSON.parse(fileContent)
        }
        catch {
            this.setState({alertVisible:true})
        }
        if(!isJsonResponseValid(response,fileSchema)){
            this.setState({alertVisible:true})
        }
        else{
            //assign instance variables and update markers
            this.setState({loadFile: response})
            this.props.updateMarkers(this.convertPlacesToAtlas(this.state.loadFile.places))
            this.sendTripRequest();

        }
    }

    renderItinerary() {
        return (
            <div>
                <Table striped responsive bordered >
                    <thead>
                        <tr>
                            <th>Info</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Miles Traveled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </Table>
            </div>
        )
    }


    renderTableData() {
        let retString = [];
            if(this.state.trip.places !== undefined && this.props.places.length > 1) {
                 for (let i = 0; i < this.state.trip.places.length - 1; i++) {
                     retString.push({"place1" : this.state.trip.places[i].name, "place2": this.state.trip.places[i + 1].name, "distance": this.state.trip.distances[i]});
                 }
                 retString.push({"place1" : this.state.trip.places[this.state.trip.places.length-1].name, "place2": this.state.trip.places[0].name, "distance": this.state.trip.distances[this.state.trip.distances.length-1]});
            }
        return (
            retString.map((position, idx) =>
                <tr key={`itinerary-${idx}`}>
                    <td>
                        <Button outline color="primary" id={`toggler-${idx}`} style={{ marginButton: '1rem'}}>+</Button>
                            <UncontrolledCollapse toggler={`toggler-${idx}`}>
                                <Card>
                                    <CardBody size="sm">
                                        {this.showInfo(this.state.trip.places[idx])}
                                    </CardBody>
                                </Card>
                            </UncontrolledCollapse>
                    </td>
                    <td>{position.place1}</td>
                    <td>{position.place2}</td>
                    <td>{position.distance} {this.props.units}</td>
                </tr>
            )
        );
    }

    showInfo(place) {
        return (
            <div>
                <p>Name: {place.name}</p>
                <p>Latitude: {place.latitude}</p>
                <p>Longitude: {place.longitude}</p>
            </div>
        );
    }

    renderModalFooter(){
        return(
            <div>
                <Row>
                    <Col>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.state.optimize === "1.0"}
                            onChange={this.changeOptimize}
                        />Optimize
                    </label>
                    </Col>
                    <Col>
                <Button color={"primary"}
                    onClick={() => this.sendTripRequest()}
                >
                Submit
                </Button>
                    </Col>
                    <Col>
                    {this.renderDropdown()}
                    </Col>
                    <Col>
                <Button color={"primary"}
                        enabled={this.hasValidTrip() ? "true": "false"}
                        disabled={(Object.keys(this.state.trip).length === 0 || this.props.places.length === 0)}
                        onClick={() => this.processDownloadClick(this.state.fileType)}
                >
                Save Trip
                </Button>
                    </Col>
                </Row>
            </div>
        );
    }
    renderDropdown(){
        return(
            <UncontrolledDropdown>
                <DropdownToggle caret>
                    {this.state.fileType}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>File Type</DropdownItem>
                    <DropdownItem onClick={() => this.setState({fileType: "JSON"})}>
                        JSON
                    </DropdownItem>
                    <DropdownItem onClick={() => this.setState({fileType: "CSV"})}>
                        CSV
                    </DropdownItem>
                    <DropdownItem disabled ={true}
                                  onClick={() => this.setState({fileType: "KML"})}>
                        KML
                    </DropdownItem>
                    <DropdownItem disabled ={true}
                                  onClick={() => this.setState({fileType: "SVG"})}>
                        SVG
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
    changeOptimize(){
        if(this.state.optimize === "0.0"){
            this.setState({optimize: "1.0"})
        }
        else{
            this.setState({optimize: "0.0"})
        }
    }
    createNavItem(tabName, label){
        return(
            <NavItem>
                <NavLink active={this.state.activeTab === tabName}
                         onClick={() => this.setState({activeTab: tabName})}>
                    {label}
                </NavLink>
            </NavItem>
        );
    }

    sendTripRequest(){
            let newMarker = [];
            this.props.places.map((position) =>
                newMarker.push({"name": position.name, "latitude":position.coords[0].toString(), "longitude": position.coords[1].toString()})
            )

        sendServerRequest({
            "requestType" : "trip",
            "requestVersion" : PROTOCOL_VERSION,
            "places" : newMarker,
            "options" : {"title": "Name", "earthRadius": this.state.units[this.props.units], "units": this.props.units, "response": this.state.optimize}
        }, getOriginalServerPort())
            .then(response => {
                this.processTripResponse(response.data)
            })
        this.props.toggleOpen();
    }
    processTripResponse(response){
        if(isJsonResponseValid(response, tripSchema)){
            let totDistance = 0;
            response.distances.map((position) =>
                totDistance += position
            )
            let latlngs = [];
            response.places.map((position) => (
                latlngs.push([
                    parseFloat(position.latitude),
                    parseFloat(position.longitude)
                    ])
            )
            )
            latlngs.push([
                parseFloat(response.places[0].latitude),
                parseFloat(response.places[0].longitude)
            ])
            let polyLine = L.polyline(latlngs, {color:'red'});
            this.props.updateMarkers(this.convertPlacesToAtlas(response.places));
            this.props.alterAtlas(polyLine,totDistance);
            this.setState({trip:response});
        }
        else{
            console.log("invalid response")

        }
    }
    hasValidTrip(){
        return(!(Object.keys(this.state.trip).length === 0 || this.props.places.length === 0));
    }

    processDownloadClick(type){
        if(type === "JSON") {
            this.downloadFile(JSON.stringify(this.state.trip), 'trip.json', this.state.downloadFileType[type])
        }
        if(type === "CSV") {
            const csvParser = new Parser();
            const csv = csvParser.parse(this.state.trip.places);
            this.downloadFile(csv,'trip.csv',this.state.downloadFileType[type])
        }
    }

    downloadFile(fileText, fileName, fileType) {
        let file = new Blob([fileText], {type: fileType});
        let a = document.createElement('a'),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    resetFormStatus() {
        this.props.toggleOpen();
        this.setState(
            {
                activeTab: '1',
            }
        );
    }

    convertPlacesToAPI(places){
        let newPlaces = [];
        places.map((position) =>
            newPlaces.push({
                "name": position.name,
                "latitude": position.coords[0],
                "longitude": position.coords[1]
            }));
        return newPlaces
    }

    convertPlacesToAtlas(places){
        let newPlaces = [];
        places.map((position) =>
            newPlaces.push({
                "name": position.name,
                "coords": [parseFloat(position.latitude), parseFloat(position.longitude)]
            }));
        return newPlaces
    }

}