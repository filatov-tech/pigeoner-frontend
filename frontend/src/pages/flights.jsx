import React, {useEffect, useState} from 'react';
import '../styles/flights.css';
import {Button, Col, Container, Row} from "react-bootstrap";
import FlightTable from "../components/UI/FlightTable/FlightTable";

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
                        <div className="header">
                            <h1>Зачеты - Соревнования</h1>
                            <p>Здесь отображается информация по существующим соревновательным вылетам голубей</p>
                        </div>
                        <div className="flights-table">
                            {tableData
                                ? <FlightTable data={tableData}/>
                                : <div className="spinner-border text-primary m-5" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>}
                        </div>
                        <div className="add-button">
                            <Button>Добавить Зачет</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Flights;