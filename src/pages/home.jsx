import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {Typography} from "@mui/joy";

const Home = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Главная</h1>
                    <hr/>
                    <Typography level="body-lg">
                        Скоро здесь будет сводная информация по всем данным
                    </Typography>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;