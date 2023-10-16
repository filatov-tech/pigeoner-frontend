import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import BootstrapContainer from "react-bootstrap/Container"
import '../styles/flight.css';
import FlightTable from "../components/UI/FlightTable/FlightTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Button, Tooltip, Typography} from "@mui/joy";
import FlightSideEditForm from "../components/UI/form/FlightSideEditForm";
import dayjs from "dayjs";
import FlightResultEditDialog from "../components/UI/form/dialog/FlightResultEditDialog";
import {FLIGHTS_URL, FlightTypes} from "../constants";
import {ArrowBackIosNewOutlined, DeleteOutline, InfoOutlined} from "@mui/icons-material";
import {Divider, IconButton, Stack} from "@mui/material";
import SimpleDeletionConfirmDialog from "../components/UI/form/confirm-action/SimpleDeletionConfirmDialog";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import InfoUnit from "../components/UI/info-unit/InfoUnit";
import InfoUnitTitle from "../components/UI/info-unit/InfoUnitTitle";
import InfoUnitContent from "../components/UI/info-unit/InfoUnitContent";
import {useMediaQuery} from "react-responsive";

const Flight = () => {
    const navigate = useNavigate();
    const isSm = useMediaQuery({query: "(max-width: 501px)"});

    let { id } = useParams();
    const flightEditRef = useRef();
    const flightResultEditRef = useRef();
    const FLIGHT_RESULTS_URL = FLIGHTS_URL + `/${id}/flight-results`;

    const [flight, setFlight] = useState();
    const [flightResults, setFlightResults] = useState();
    const [departure, setDeparture] = useState({date: null, time: null});

    const flightDeleteDialogRef = useRef();
    const [openFlightDeleteDialog, setOpenFlightDeleteDialog] = useState(false);


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

    const removeFlight = async () => {
        try {
            const response = await fetch(FLIGHTS_URL + `/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                // forward on Flights page
                navigate("/flights");
            }
        } catch (e) {
            throw new Error("Ошибка при попытке удалить вылет", e);
        }
    }

    const removeFlightResult = async (flightResultId) => {
        try {
            const response = await fetch(FLIGHT_RESULTS_URL + `/${flightResultId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                fetchFlightResults();
                fetchFlight();
            }
        } catch (e) {
            throw new Error("Ошибка при попытке удалить участника вылета")
        }
    }

    const openEditForm = () => {
        flightEditRef.current.setOpen(true);
    }

    const handleEdit = (flightResult) => {
        flightResultEditRef.current.openInEditMode(flightResult);
    }

    useEffect(() => {
        fetchFlight();
        fetchFlightResults();
    }, [id])

    return (
        <>
            <FlightResultEditDialog
                ref={flightResultEditRef}
                flight={flight}
                onSubmit={[fetchFlightResults, fetchFlight]}
            />
            {flight &&
                <BootstrapContainer>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <IconButton onClick={() => navigate(-1)}>
                                    <ArrowBackIosNewOutlined/>
                                </IconButton>
                                <Typography level="h3">
                                    Вылет - {FlightTypes[flight.flightType]}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12}><Divider /></Grid>
                        <Grid container xs={12} md={6} lg={6}>
                            <Grid xs={12} lg={6}>
                                <InfoUnit>
                                    <InfoUnitTitle>Дистанция:</InfoUnitTitle>
                                    <InfoUnitContent>
                                        {flight.launchPoint.name}: {flight.launchPoint.distance} км
                                    </InfoUnitContent>
                                </InfoUnit>
                            </Grid>
                            <Grid xs={12} lg={6}>
                                <InfoUnit>
                                    <InfoUnitTitle>Старт:</InfoUnitTitle>
                                    <InfoUnitContent>
                                        <strong>{departure.date}</strong> {departure.time}
                                    </InfoUnitContent>
                                </InfoUnit>
                            </Grid>
                        </Grid>
                        <Grid container xs={12} md={6} lg={6}>
                            <Grid xs={12} lg={6}>
                                <InfoUnit>
                                    <InfoUnitTitle>Участники:</InfoUnitTitle>
                                    <InfoUnitContent>
                                        <Tooltip title="Мои голуби" variant="outlined" placement="top-end" arrow>
                                            <span>{flight.numberParticipants}</span>
                                        </Tooltip>
                                        &nbsp;/&nbsp;
                                        <Tooltip title="Всего участников" variant="outlined" placement="top-start" arrow>
                                            <span>{flight.totalParticipants ? flight.totalParticipants : <NoDataIcon/>}</span>
                                        </Tooltip>
                                    </InfoUnitContent>
                                </InfoUnit>
                            </Grid>
                            <Grid xs={12} lg={6}>
                                <InfoUnit>
                                    <InfoUnitTitle>В призах:</InfoUnitTitle>
                                    <InfoUnitContent>
                                        <Tooltip title="Мои голуби" variant="outlined" placement="top-end" arrow>
                                            <span>{flight.myPassed ? flight.myPassed : <NoDataIcon/>}</span>
                                        </Tooltip>
                                        &nbsp;/&nbsp;
                                        <Tooltip title="Всего участников" variant="outlined" placement="top-start" arrow>
                                            <span>
                                                {
                                                    flight.totalParticipants
                                                        ? (flight.totalParticipants * 0.2)
                                                        : <NoDataIcon/>
                                                }
                                            </span>
                                        </Tooltip>
                                    </InfoUnitContent>
                                </InfoUnit>
                            </Grid>
                        </Grid>
                        <Grid container xs={12} justifyContent="space-between">
                            <Grid>
                                <Button
                                    onClick={() => flightResultEditRef.current.setOpen(true)}
                                    variant="solid"
                                    size="lg"
                                >
                                    Добавить участника
                                </Button>
                                <FlightSideEditForm flight={flight} ref={flightEditRef} onSubmit={fetchFlight}/>
                            </Grid>
                            <Grid>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="soft"
                                        size="lg"
                                        onClick={openEditForm}
                                        fullWidth
                                    >
                                        {isSm ? "Изменить" : "Изменить данные"}
                                    </Button>
                                    <Button
                                        variant="soft"
                                        color="danger"
                                        onClick={() => flightDeleteDialogRef.current.startDeletion(flight.id)}
                                    >
                                        <DeleteOutline fontSize="small"/>
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid xs={12}>
                            {flightResults ? <FlightTable
                                    data={flightResults}
                                    flight={flight}
                                    official={flight.flightType !== "TRAINING"}
                                    onEdit={handleEdit}
                                    onDelete={removeFlightResult}
                                />
                                : <TableSkeletonLoader/>
                            }
                        </Grid>
                    </Grid>
                </BootstrapContainer>
            }
            <SimpleDeletionConfirmDialog
                ref={flightDeleteDialogRef}
                open={openFlightDeleteDialog}
                setOpen={setOpenFlightDeleteDialog}
                handleDelete={removeFlight}
                title="Удаление вылета"
                content="Внимание! Данный вылет будет удален"
            />
        </>
    );
};

const NoDataIcon = () => {
    return (
        <Tooltip
            title="Даные будут доступны после синхронизации с данными организатора гонки"
            arrow
            color="warning"
            variant="outlined"
        >
            <InfoOutlined color="action" fontSize="small" sx={{alignSelf: "center", paddingBottom: "3px"}}/>
        </Tooltip>
    );
};

export default Flight;