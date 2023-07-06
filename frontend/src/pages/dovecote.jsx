import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DovecoteAccordion from "../components/UI/DovecoteAccordion/DovecoteAccordion";

const Dovecote = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Голубятня</h1>
                    <hr/>
                    <DovecoteAccordion />
                </Col>
            </Row>
        </Container>);
};

export default Dovecote;