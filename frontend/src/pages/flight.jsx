import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import '../styles/flight.css';
import LoadingButton from "../components/UI/button/LoadingButton";
import FlightTable from "../components/UI/FlightTable/FlightTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Button} from "@mui/joy";
import FlightSideEditForm from "../components/UI/form/FlightSideEditForm";
import {FLIGHTS_URL} from "./flights";
import dayjs from "dayjs";
import FlightResultEditDialog from "../components/UI/form/dialog/FlightResultEditDialog";

export const flightTypes = {
    CUP: "Кубковое соревнование",
    COMPETITION: "Соревнование",
    TRAINING: "Тренировка",
    JUNIOR_COMPETITION: "Юниорское соревнование"
}

const Flight = () => {
    let { id } = useParams();
    const flightEditRef = useRef();
    const flightResultEditRef = useRef();
    const FLIGHT_RESULTS_URL = `/api/v1/flights/${id}/flight-results`;

    const [flight, setFlight] = useState();
    const [flightResults, setFlightResults] = useState();
    const [departure, setDeparture] = useState({date: null, time: null});


    const fetchFlight = async () => {
        try {
            const response = await fetch(`${FLIGHTS_URL}/${id}`);
            if (response.ok) {
                const flight = await response.json();
                setFlight(flight);
                const rawDepartureDateTime = dayjs.utc(flight.departure).local();
                setDeparture({
                    date: rawDepartureDateTime.format("DD.MM.YYYY"),
                    time: rawDepartureDateTime.format("HH:mm")
                })
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке данных вылета", e);
        }
    }

    const fetchFlightResults = async () => {
        try {
            const response = await fetch(FLIGHT_RESULTS_URL);
            if (response.ok) {
                const flightResults = await response.json();
                setFlightResults(flightResults);
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке результатов вылета");
        }
    }

    const openEditForm = () => {
        flightEditRef.current.setOpen(true);
    }

    useEffect(() => {
        fetchFlight();
        fetchFlightResults();
    }, [id])

    return (
        <>
            {flight &&
                <Container>
                    <Row>
                        <Col>
                            <div className="flight-page">
                                <div className="flight-header">
                                    <div className="flight-header-box">
                                        <h1>Вылет -  {flightTypes[flight.flightType]}</h1>
                                        <div>{flight.launchPoint.name}: {flight.launchPoint.distance} км</div>
                                        <div>Выпуск голубей: <strong>{departure.date}</strong> {departure.time}</div>
                                    </div>
                                    <hr/>
                                </div>
                                <div className="flight-info">
                                    <div>Голубей участвовало: </div>
                                    <div>Всего: {flight.totalParticipants ? flight.totalParticipants : "i"} / Мои: {flight.numberParticipants}</div>
                                    <div>Из них призовых (20%): </div>
                                    <div>Всего: {flight.totalParticipants ? (flight.totalParticipants * 0.2) : "i"} / Мои: {flight.myPassed ? flight.myPassed : "i"}</div>
                                    <Button
                                        variant="soft"
                                        size="lg"
                                        onClick={openEditForm}
                                        sx={{margin: "20px 0"}}
                                    >
                                        Изменить данные
                                    </Button>
                                    <FlightSideEditForm flight={flight} ref={flightEditRef} onSubmit={fetchFlight} />
                                </div>
                                <div className="switch">
                                    <div>Мои голуби</div>
                                    <label className="switch-button">
                                        <input type="checkbox"/>
                                        <span className="slider"></span>
                                    </label>
                                    <div>Все участники</div>
                                </div>
                                <div className="manage-zone">
                                    <p>Загрузить информацию о полете из внешнего источника</p>
                                    <div><LoadingButton name={"Подгрузить данные"}/></div>
                                </div>
                                <div className="flight-result-table">
                                    {flightResults ? <FlightTable data={flightResults}/>
                                    : <TableSkeletonLoader/>}
                                </div>
                                <div className="flight-add-button">
                                    <Button
                                        onClick={() => flightResultEditRef.current.setOpen(true)}
                                        variant="solid"
                                        size="lg"
                                    >
                                        Добавить участника
                                    </Button>
                                    <FlightResultEditDialog
                                        ref={flightResultEditRef}
                                        flight={flight}
                                        onSubmit={[fetchFlightResults]}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
        </>
    );
};

export default Flight;