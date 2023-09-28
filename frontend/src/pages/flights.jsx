import React, {useEffect, useRef, useState} from 'react';
import '../styles/flights.css';
import {Col, Container, Row} from "react-bootstrap";
import FlightsTable from "../components/UI/FlightsTable/FlightsTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Button} from "@mui/joy";
import {Add} from "@mui/icons-material";
import FlightSideEditForm from "../components/UI/form/FlightSideEditForm";

const Flights = () => {
    const sideFormRef = useRef();

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
                            <FlightSideEditForm ref={sideFormRef} />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Flights;