import React, {useEffect, useRef, useState} from 'react';
import '../styles/flights.css';
import {Col, Container, Row} from "react-bootstrap";
import FlightsTable from "../components/UI/FlightsTable/FlightsTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Button} from "@mui/joy";
import {Add} from "@mui/icons-material";
import FlightSideEditForm from "../components/UI/form/FlightSideEditForm";
import {flightTypes} from "./flight";

export const FLIGHTS_URL = "/api/v1/flights";

const Flights = () => {
    const sideFormRef = useRef();

    const [tableData, setTableData] = useState();

    const fetchFlights = async () => {
        try {
            const response = await fetch(FLIGHTS_URL);
            if (response.ok) {
                const flights = await response.json();
                setTableData(flights.map(flight => {
                    return {...flight, flightType: flightTypes[flight.flightType]}
                }));
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке вылетов", e);
        }
    }

    useEffect(() => {
        fetchFlights()
    }, [])

    return (
        <Container>
            <Row>
                <Col>
                    <div className="flights-page">
                        <div className="flights-header">
                            <h1>Полеты</h1>
                            <hr/>
                            <p>Здесь отображается информация по существующим соревновательным вылетам голубей</p>
                        </div>
                        <div className="flights-table">
                            {tableData ? <FlightsTable data={tableData}/> : <TableSkeletonLoader/>}
                        </div>
                        <div className="flights-add-button">
                            <Button
                                onClick={() => sideFormRef.current.setOpen(true)}
                                startDecorator={<Add />}
                                size="lg"
                                variant="solid"
                                sx={{backgroundColor: "#337ab7"}}
                            >
                                Добавить Вылет
                            </Button>
                            <FlightSideEditForm ref={sideFormRef} onSubmit={fetchFlights} />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Flights;