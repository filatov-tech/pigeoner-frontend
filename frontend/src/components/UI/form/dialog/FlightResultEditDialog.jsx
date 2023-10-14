import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Button, DialogContent, DialogTitle, Modal, ModalDialog, Stack} from "@mui/joy";
import {InputFieldData} from "../../PigeonTable/PigeonFilterForm";
import {FLIGHTS_URL, PIGEONS_URL} from "../../../../constants"
import ErrorSnackbar from "../../ErrorSnackbar";
import InputPigeonAutocomplete from "../../input/Autocomplete/InputPigeonAutocomplete";
import InputDateTime from "../../input/InputDateTime";
import dayjs from "dayjs";
import SelectCommon from "../../input/SelectCommon";
import {Box} from "@mui/material";

const emptyFlightResult = {
    id: null,
    pigeon: null,
    arrivalTime: null,
    afterFlightCondition: "NORMAL"
};

const FlightResultEditDialog = (props, ref) => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [flightResult, setFlightResult] = useState(emptyFlightResult);
    const [pigeons, setPigeons] = useState([]);

    const [error, setError] = useState(null);
    const [fieldError, setFieldError] = useState({});

    const pigeonData = new InputFieldData("pigeon", flightResult.pigeon, "Голубь", "", pigeons);
    const arrivalTimeData = new InputFieldData("arrivalTime", flightResult.arrivalTime, "Финиш");
    const afterFlightConditionData = new InputFieldData(
        "afterFlightCondition",
        flightResult.afterFlightCondition,
        "Состояние после финиша",
        "",
        [
            {value: "NORMAL", label: "Нормальное"},
            {value: "TIRED", label: "Уставший"}
        ]
    )

    const disableErrorByFieldName = (fieldName) => {
        setFieldError(prevState => {
            return {...prevState, [fieldName]: null};
        })
    }

    const fetchPigeons = async () => {
        try {
            const response = await fetch(PIGEONS_URL);
            if (response.ok) {
                setFieldError({});
                const pigeons = await response.json();
                setPigeons(pigeons);
            } else {
                const apiError = await response.json();
                setError(apiError);
                if (apiError.fields) {
                    for (const [key, value] of Object.entries(apiError.fields)) {
                        value.disable = disableErrorByFieldName;
                    }
                    setFieldError(apiError.fields);
                }
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке данных голубей", e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const method = editMode ? "PUT" : "POST";
        flightResult.pigeonId = flightResult.pigeon.id;
        try {
            const response = await fetch(getSubmitUrl(method), {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(flightResult)
            });
            if (response.ok) {
                setError(null);
                setFieldError({});
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
                handleClose();
            } else {
                const apiError = await response.json();
                setError(apiError);
                if (apiError.fields) {
                    setFieldError(apiError.fields);
                }
            }
        } catch (e) {
            throw new Error(`Ошибка при сохранении данных участника вылета${e.message && `: ${e.message}`}`, e)
        }
    }

    const getSubmitUrl = (method) => {
        if (!props.flight && !props.flight.id) {
            throw new Error ("Невозможно сохранить данные участника без идентификатора вылета");
        }
        let url = `${FLIGHTS_URL}/${props.flight.id}/flight-results`;
        if (method === "PUT") {
            if (!flightResult.id) {
                throw new Error("Невозможно сохранить измененные данные участника без его идентификатора")
            }
            url += `/${flightResult.id}`
        }
        return url;
    }

    const openInEditMode = (flightResult) => {
        setEditMode(true);
        setFlightResult({
            ...flightResult,
            id: flightResult.id,
            pigeon: pigeons.find(pigeon => pigeon.id === flightResult.pigeonId),
            arrivalTime: dayjs.utc(flightResult.arrivalTime).local(),
            afterFlightCondition: flightResult.afterFlightCondition
        })
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setFlightResult(emptyFlightResult);
    }

    useEffect(() => {
        fetchPigeons();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
        }, 4000);
        return () => clearTimeout(timer);
    }, [error]);

    useImperativeHandle(ref, () => ({
        setOpen,
        openInEditMode
    }))

    return (
        <React.Fragment>
            <Modal open={open} onClose={handleClose}>
                <ModalDialog  sx={{maxWidth: "370px"}}>
                    <DialogTitle>{editMode ? "Участник" : "Новый участник"}</DialogTitle>
                    <DialogContent>
                        {editMode
                            ? "Здесь можно изменить итоговый результат вылета"
                            : "Добавьте результат вылета для голубя"
                        }
                    </DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <InputPigeonAutocomplete
                                data={pigeonData}
                                error={fieldError.pigeon}
                                disabled={editMode}
                                onChange={(newValue) => {
                                    setFlightResult({...flightResult, pigeon: newValue})
                                }}
                            />
                            <InputDateTime
                                data={arrivalTimeData}
                                error={fieldError.arrivalTime}
                                onChange={(newValue) => {
                                    setFlightResult({...flightResult, arrivalTime: newValue})
                                }}
                                withMillis
                                viewRenderers={{
                                    hours: null,
                                    minutes: null,
                                    seconds: null
                                }}
                                view={{
                                    rowReverse: true
                                }}
                            />
                            {!fieldError.arrivalTime && <Box sx={{height: "8px", width: "100%"}}></Box>}
                            <SelectCommon
                                data={afterFlightConditionData}
                                onChange={(newValue) => {
                                    setFlightResult({...flightResult, afterFlightCondition: newValue})
                                }}
                                withoutAny
                                error={fieldError.afterFlightCondition}
                                variant="outlined"
                            />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Button
                                onClick={handleClose}
                                variant="soft"
                                size="lg"
                                sx={{marginTop: "20px"}}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" size="lg" sx={{marginTop: "20px"}}>Сохранить</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            {error && <ErrorSnackbar
                message={error.message}
                anchorOrigin={{horizontal: "left", vertical: "bottom"}}
            />}
        </React.Fragment>
    );
};

export default forwardRef(FlightResultEditDialog);