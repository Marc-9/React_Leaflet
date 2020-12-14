import React from "react";
import {Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";


export class TeamMember extends React.Component {

    render() {
        return (

            <Card>
                <CardImg top width="100%" src={this.props.image} alt="Card image cap" />
                <CardBody>
                    <CardTitle>{this.props.name}</CardTitle>
                    <CardText>{this.props.bio}</CardText>
                </CardBody>
            </Card>
        );
    }
}

