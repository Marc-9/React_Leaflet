import React, {Component} from 'react';
import { TeamMember } from "../TeamMember";
import JM_photo from '../../static/images/jm.jpg';
import LD_photo from '../../static/images/ld.jpg';
import BS_photo from '../../static/images/bs.jpg';
import OF_photo from '../../static/images/OF.jpg';
import AZ_photo from '../../static/images/az.jpg';
import bios from '../../static/text/bios.json';

import {Container, Row, Col, Button, CardGroup} from 'reactstrap';





import {CLIENT_TEAM_NAME} from "../../utils/constants";

export default class About extends Component {

    render() {
      return (
        <Container id="about">
          <Row>
            <Col>
              <h2>{CLIENT_TEAM_NAME}</h2>
            </Col>
              <Col id="closeAbout" xs='auto' >
                  <Button color="primary" onClick={this.props.closePage} xs={1} >
                      Close
                  </Button>
              </Col>
          </Row>
            <Row>
                <h3> Mission Statement </h3>
                <p> T11 also known as the NULL Terminators is a team composed of 5 members who all possess Computer Science skills. This team was created to compose a website while gaining experience working in a professional environment. Their goal is to work as a team to develop a well-structured website while personalizing and improving the structures they were already given. </p>
            </Row>
            <Row>
                <h3> Team Members </h3>
            </Row>
          <Row>
              <CardGroup>
                  <TeamMember name={"JeanMarc Ruffalo-Burgat"} image={JM_photo} bio={bios['jm']}/>
                  <TeamMember name={"Lauren Dziak"} image={LD_photo} bio={bios['ld']}/>
                  <TeamMember name={"Braeden Smith"} image={BS_photo} bio={bios['bs']}/>
                  <TeamMember name={"Ofe Fonseca"} image={OF_photo} bio={bios['of']}/>
                  <TeamMember name={"Anteneh Zeleke"} image={AZ_photo} bio={bios['az']}/>
              </CardGroup>
          </Row>
        </Container>
      )
    }
}
