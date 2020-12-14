import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TabPane, TabContent, NavItem, NavLink, Nav } from "reactstrap";
import {PROTOCOL_VERSION} from "../../utils/constants";

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader toggle={() => this.props.toggleOpen()}>Results
                    </ModalHeader>
                    <ModalBody>
                        {this.renderResults()}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.resetFormStatus()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    renderResults(){
        let places = this.props.places
        return (
            <div>
            {places.map((position, idx) =>
                this.renderFindResults(position, idx)
            )}
            </div>
        );
    }

    handleFindClick(latlng){
        this.props.toggleOpen();
        this.props.toggleFind();
        this.props.setMarker(latlng);
    }

    renderFindResults(location, idx){
        let latlng = {"latlng": {"lat": parseFloat(location.latitude), "lng": parseFloat(location.longitude)}, "name" : location.name};
        return(
            <p key={idx} onClick={() =>this.handleFindClick(latlng)}>{location.name} - {location.region}</p>
        )
    }

    resetFormStatus(){
        this.props.toggleOpen();
    }

}