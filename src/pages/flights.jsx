import React, {useEffect, useRef, useState} from 'react';
import '../styles/flights.css';
import {Col, Container, Row} from "react-bootstrap";
import FlightsTable from "../components/UI/FlightsTable/FlightsTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Button, Typography} from "@mui/joy";
import FlightSideEditForm from "../components/UI/form/FlightSideEditForm";
import {AUTH_TOKEN, BEARER, FLIGHTS_URL, FlightTypes} from "../constants";
import {Stack} from "@mui/material";

const Flights = () => {
    const sideFormRef = useRef();

    const [tableData, setTableData] = useState();

    const fetchFlights = async () => {
        try {
            const response = await fetch(FLIGHTS_URL, {
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                }
            });
            if (response.ok) {
                const flights = await response.json();
                setTableData(flights.map(flight => {
                    return {...flight, flightType: FlightTypes[flight.flightType]}
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
                    <h1>Полеты</h1>
                    <hr/>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} marginY={2} justifyContent="space-between" alignContent="baseline">
                        <Typography level="body-lg" alignSelf="center">
                            Здесь отображается информация по существующим соревновательным вылетам голубей
                        </Typography>
                        <Button
                            variant="solid"
                            size="lg"
                            sx={{backgroundColor: "#337ab7", minWidth: "180px"}}
                            onClick={() => sideFormRef.current.setOpen(true)}
                        >
                            Добавить вылет
                        </Button>
                    </Stack>
                    {tableData ? <FlightsTable data={tableData}/> : <TableSkeletonLoader/>}
                    <FlightSideEditForm ref={sideFormRef} onSubmit={fetchFlights} />
                </Col>
            </Row>
        </Container>
    );
};

export default Flights;