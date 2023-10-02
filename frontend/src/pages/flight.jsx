import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import '../styles/flight.css';
import LoadingButton from "../components/UI/button/LoadingButton";
import FlightTable from "../components/UI/FlightTable/FlightTable";
import BigButton from "../components/UI/button/BigButton";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Button} from "@mui/joy";
import FlightSideEditForm from "../components/UI/form/FlightSideEditForm";
import {FLIGHTS_URL} from "./flights";

export const flightTypes = {
    CUP: "Кубковое соревнование",
    COMPETITION: "Соревнование",
    TRAINING: "Тренировка",
    JUNIOR_COMPETITION: "Юниорское соревнование"
}

const Flight = () => {
    let { id } = useParams();
    const editFormRef = useRef();
    const FLIGHT_RESULTS_URL = `/api/v1/flights/${id}/flight-results`;

    let [flight, setFlight] = useState();
    let [flightResults, setFlightResults] = useState();
    let [departureDate, setDepartureDate] = useState();
    let [departureTime, setDepartureTime] = useState();

    const fetchFlight = async () => {
        try {
            const response = await fetch(`${FLIGHTS_URL}/${id}`);
            if (response.ok) {
                const flight = await response.json();
                setFlight(flight);
                let date = new Date(Date.parse(flight.departure));
                setDepartureDate(date.toLocaleDateString('ru'));
                setDepartureTime(`${date.getHours()}:${date.getMinutes()}`);
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
        editFormRef.current.setOpen(true);
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
                                        <div>Запуск: <strong>{departureDate}</strong> {departureTime}</div>
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
                                    <FlightSideEditForm flight={flight} ref={editFormRef} onSubmit={fetchFlight} />
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
                                    <BigButton name={"Добавить участника"}/>
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