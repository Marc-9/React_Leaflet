import {Col, Input, Row} from "reactstrap";
import React from "react";

export function renderRow(element1, element2){
    return (
        <Row className="m-2">
            <Col xs={2}>
                {element1}
            </Col>
            <Col xs={{offset: 1}}>
                {element2}
            </Col>
        </Row>
    );
}

export function renderGenericInput(onChangeEvent, value){
    return (
        <Input onChange={(e) => onChangeEvent(e.target.value)}
               placeholder={value}
        />
    );
}

export function renderInputWithValidation(onChangeEvent, value, valid){
    return (
        <Input onChange={(e) => onChangeEvent(e.target.value)}
               placeholder={value}
               valid={valid}
               invalid={!valid}
        />
    );
}