import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TabPane, TabContent, NavItem, NavLink, Nav, FormGroup, Label, Input } from "reactstrap";
import {PROTOCOL_VERSION} from "../../utils/constants";

import {sendServerRequest, isJsonResponseValid, getOriginalServerPort, sendConfigRequest} from "../../utils/restfulAPI";
import {renderRow, renderGenericInput, renderInputWithValidation} from "../../utils/uiUtilities";

import * as findSchema from "../../../schemas/ResponseFind";
import Results from "./Results";



export default class Find extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            inputMatch: "Search...",
            inputLatitude: "Latitude...",
            inputLongitude: "Longitude...",
            showResults: false,
            find: [],
            selectOptionsType: [],
            selectOptionsCountry: []
            }
        ;

        this.updateLatitude = this.updateLatitude.bind(this);
        this.updateLongitude = this.updateLongitude.bind(this);
        this.updateName = this.updateName.bind(this);
        this.sendFindRequest = this.sendFindRequest.bind(this);
        this.setMarker = this.props.setMarker.bind(this);

        this.saveInputMatch = this.state.inputMatch;
        this.saveInputLatitude = this.state.inputLatitude;
        this.saveInputLongitude = this.state.inputLongitude;
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader toggle={() => this.props.toggleOpen()}>Find Location</ModalHeader>
                    <ModalBody>
                        {this.renderForms()}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                                disabled={!this.isSearchReady()}
                                onClick={() => this.sendRequest()}
                            >Find
                        </Button>
                        <Button color="primary" onClick={() => this.sendFeelingLucky()}>Feeling Lucky?</Button>
                        <Button color="primary" onClick={() => this.resetFormStatus()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    renderForms(){
        return (
            <div>
                <Nav tabs>
                    {this.createNavItem('1', "Find by Lat/Long")}
                    {this.createNavItem('2', "Find by Name")}
                </Nav>
                <div>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            {this.renderCoordinatesForm()}
                        </TabPane>
                        <TabPane tabId="2">
                            {this.renderNameForm()}
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        );
    }

    renderCoordinatesForm(){
        return(
            <div>
                {renderRow("Latitude", renderInputWithValidation(
                    this.updateLatitude,
                    this.state.inputLatitude,
                    this.isValidLatitude(this.state.inputLatitude)
                ))}
                {renderRow("Longitude", renderInputWithValidation(
                    this.updateLongitude,
                    this.state.inputLongitude,
                    this.isValidLongitude(this.state.inputLongitude)
                ))}
            </div>

        );
    }

    renderNameForm(){
        return(
            <div>
                {renderRow("Name", renderGenericInput(
                    this.updateName,
                    this.state.inputMatch
                    ))}
                <p>If no filters are selected the search will encapsulate all options in the database</p>
                {this.renderFilterForms()}
                {this.renderResultsModal()}
            </div>
        );
    }


    renderFilterForms(){
        if(this.props.filters != null && this.props.filters.filters != null){
            return(
            <div>
                <select name="selectOptionsType" multiple={true} onChange={this.handleChange}  value={this.state.selectOptionsType} >
                    {this.props.filters.filters.type.map((name, idx) =>
                        <option key={`type-${idx}`} value={name}>{name}</option>
                    )}
                </select>

                <select name="selectOptionsCountry" multiple={true} onChange={this.handleChange}  value={this.state.selectOptionsCountry} >
                    {this.props.filters.filters.where.map((name, idx) =>
                        <option key={`type-${idx}`} value={name}>{name}</option>
                    )}
                </select>

            </div>
            );
        }
    }
    // This Handle function was derived from https://codepen.io/papawa/pen/XExeZY
    handleChange = (e) => {
        let target = e.target
    	let name = target.name

        let value = Array.from(target.selectedOptions, option => option.value);
        this.setState({
          [name]: value
        });
      }

    handleFindClick(latlng){
        this.props.toggleOpen();
        this.props.setMarker(latlng)
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

    sendFeelingLucky(){
        sendServerRequest({
            requestType: "find",
            requestVersion: PROTOCOL_VERSION,
            narrow: {"type": this.state.selectOptionsType, "where": this.state.selectOptionsCountry }

        }, getOriginalServerPort())
            .then(find => {
                if (find) {
                    this.processFindResponse(find.data)
                } else { //this.setState({data:distance.data})
                    console.log(find)
                }
            })

    }


    sendRequest() {
        if(this.state.activeTab === '1'){ //mark map w/latlong
            let name = "Location" + (this.props.places.length + 1);
            let coords = {"latlng" : {"lat" : parseFloat(this.state.inputLatitude), "lng": parseFloat(this.state.inputLongitude)}, "name": name};
            this.handleFindClick(coords);
        }
        else if (this.state.activeTab === '2'){ //send find request
           sendConfigRequest(this.sendFindRequest);
        }
    }

    sendFindRequest(config) {
        let sanitationMatch = this.state.inputMatch.replace("'", "_");
        if (config["supportedRequests"].includes("find")) {
            sendServerRequest({
                requestType: "find",
                requestVersion: PROTOCOL_VERSION,
                match: sanitationMatch,
                limit: 10,
                narrow: {"type": this.state.selectOptionsType, "where": this.state.selectOptionsCountry }
            }, getOriginalServerPort())
                .then(find => {
                    if (find) {
                        this.processFindResponse(find.data)
                    } else { //this.setState({data:distance.data})
                        console.log(find)
                    }
                })
        }

    }

    processFindResponse(findResponse) {
        if(!isJsonResponseValid(findResponse, findSchema)){
            console.log('Invalid JSON response');
        }
        else{
            this.setState({
                find: findResponse.places,
                showResults: true})
        }
    }

    isSearchReady() {
        return (
            (this.state.activeTab === '1' && this.isValidLatitude(this.state.inputLatitude) && this.isValidLongitude(this.state.inputLongitude)) ||
            (this.state.activeTab === '2')
        )
    }

    updateLatitude(value){
        this.setState({inputLatitude: value})
    }

    updateLongitude(value){
        this.setState({inputLongitude:value})
    }

    updateName(value) {
        this.setState({
            inputMatch: value
        })
    }

    isValidLatitude(coordinate){
        const latitudeRegex = /^[+-]?([1-8]?[0-9](\.\d+)?$|90(\.0+)?$)/
        return coordinate.match(latitudeRegex) !== null
    }

    isValidLongitude(coordinate){
        const longitudeRegex = /^[+-]?(180(\.0+)?|(1[0-7]\d(\.\d+)?)|\d{1,2}(\.\d+)?)$/
        return coordinate.match(longitudeRegex) !== null
    }

    resetFormStatus() {
        this.props.toggleOpen();
        this.setState(
            {
                activeTab: '1',
                inputMatch: this.saveInputMatch,
                inputLatitude: this.saveInputLatitude,
                inputLongitude: this.saveInputLongitude
            }
        );
    }

    renderResultsModal(){
        return(
            <Results
                isOpen={this.state.showResults}
                toggleOpen={(isOpen = !this.state.showResults) => this.setState({showResults: isOpen})}
                places={this.state.find}
                setMarker={this.props.setMarker}
                toggleFind={this.props.toggleOpen}
            />
        );
    }


}
