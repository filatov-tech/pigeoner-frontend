import React, {useEffect, useState} from 'react';
import '../styles/flights.css';
import {Button, Col, Container, Row} from "react-bootstrap";
import FlightsTable from "../components/UI/FlightsTable/FlightsTable";

const Flights = () => {
    const [tableData, setTableData] = useState();

    useEffect(() => {
        fetch('/api/v1/flights')
            .then(res => res.json())
            .then(json => setTableData(json));
    }, [])

    return (
        <Container>
            <Row>
                <Col>
                    <div className="flights-page">
                        <div className="flights-header">
                            <h1>Полеты</h1>
                            <p>Здесь отображается информация по существующим соревновательным вылетам голубей</p>
                        </div>
                        <div className="flights-table">
                            {tableData
                                ? <FlightsTable data={tableData}/>
                                : <div className="spinner-border text-primary m-5" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>}
                        </div>
                        <div className="flights-add-button">
                            <Button bsPrefix="btn btn-primary btn-lg flights-add-button-style">Добавить Зачет</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Flights;