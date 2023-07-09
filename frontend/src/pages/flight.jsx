import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import '../styles/flight.css';
import LoadingButton from "../components/UI/button/LoadingButton";
import FlightTable from "../components/UI/FlightTable/FlightTable";
import BigButton from "../components/UI/button/BigButton";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";

const Flight = () => {
    let { id } = useParams();
    let [flight, setFlight] = useState();
    let [flightResults, setFlightResults] = useState();
    let [departureDate, setDepartureDate] = useState();
    let [departureTime, setDepartureTime] = useState();


    useEffect(() => {
        fetch(`/api/v1/flights/${id}`)
            .then(res => res.json())
            .then(json => {
                setFlight(json);
                let date = new Date(Date.parse(json.departure));
                setDepartureDate(date.toLocaleDateString('ru'));
                setDepartureTime(`${date.getHours()}:${date.getMinutes()}`);

            });
        fetch(`/api/v1/flights/${id}/flight-results`)
            .then(res => res.json())
            .then(json => setFlightResults(json));
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
                                        <h1>Полет -  {flight.flightType}</h1>
                                        <div>{flight.locationName}: {flight.distance} км</div>
                                        <div>Запуск: <strong>{departureDate}</strong> {departureTime}</div>
                                    </div>
                                    <hr/>
                                </div>
                                <div className="flight-info">
                                    <div>Голубей участвовало: </div>
                                    <div>Всего: {flight.totalParticipants ? flight.totalParticipants : "i"} / Мои: {flight.numberParticipants}</div>
                                    <div>Из них призовых (20%): </div>
                                    <div>Всего: {flight.totalParticipants ? (flight.totalParticipants * 0.2) : "i"} / Мои: {flight.myPassed ? flight.myPassed : "i"}</div>
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