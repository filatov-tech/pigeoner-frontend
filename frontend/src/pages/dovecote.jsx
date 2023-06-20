import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MyAccordion from "../components/UI/dovecoteAccordion/MyAccordion";

const Dovecote = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <MyAccordion />
                </Col>
            </Row>
        </Container>);
};

export default Dovecote;