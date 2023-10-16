import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import SideEditForm from "./SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider} from "@mui/material";
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import InputLaunchPointAutocompleteCreatable from "../input/Autocomplete/InputLaunchPointAutocompleteCreatable";
import ErrorSnackbar from "../ErrorSnackbar";
import InputDateTime from "../input/InputDateTime";
import SelectCommon from "../input/SelectCommon";
import {Stack} from "@mui/joy";
import Button from "@mui/material/Button";
import {CloseOutlined, DoneOutlined, RestoreOutlined} from "@mui/icons-material";
import dayjs from "dayjs";
import {FLIGHTS_URL} from "../../../constants";

const FlightSideEditForm = (props, ref) => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(!!props.flight);
    const [initialized, setInitialized] = useState(false);
    const [formError, setFormError] = useState(null);
    const [fieldErrorData, setFieldErrorData] = useState({});
    const [loadedLaunchPointField, setLoadedLaunchPointField] = useState(false);

    const [flightId, setFlightId] = useState(null);
    const [launchPoint, setLaunchPoint] = useState(null);
    const [departureDateTime, setDepartureDateTime] = useState(null);
    const [flightType, setFlightType] = useState("");

    const launchPointData = new InputFieldData(
        "launchPoint",
        launchPoint,
        "Точка вылета"
    );
    const departureDateTimeData = new InputFieldData(
        "departureDateTime",
        departureDateTime,
        "Дата и время выпуска"
    );
    const flightTypeData = new InputFieldData(
        "flightType",
        flightType,
        "Тип вылета *",
        "",
        [
            {value: "CUP", label: "Кубковое соревнование"},
            {value: "COMPETITION", label: "Соревнование"},
            {value: "TRAINING", label: "Тренировка"},
            {value: "JUNIOR_COMPETITION", label: "Юниорское соревнование"}
        ]
    )

    const handleSubmit = async (e) => {
        e.preventDefault();
        const flight = {
            id: flightId,
            launchPointId: launchPoint && launchPoint.id,
            departure: departureDateTime,
            flightType: flightType
        }
        try {
            const url = editMode ? `${FLIGHTS_URL}/${flightId}` : FLIGHTS_URL
            const response = await fetch(url, {
                method: editMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(flight)
            });
            if (response.ok) {
                setFormError(null);
                setFieldErrorData({});
                setOpen(false);
                props.onSubmit();
            } else {
                const apiError = await response.json();
                setFormError(apiError);
                if (apiError.fields) {
                    for (const [key, value] of Object.entries(apiError.fields)) {
                        value.disable = disableErrorByFieldName;
                    }
                    setFieldErrorData(apiError.fields);
                }
            }
        } catch (e) {
            throw new Error("Ошибка при сохранении данных вылета", e)
        }
    }

    const showError = (error) => {
        setFormError(error)
    }

    const resetForm = () => {
        if (editMode) {
            initFormWith(props.flight);
            return;
        }
        setLaunchPoint(null);
        setDepartureDateTime(null);
        setFlightType("");
    }

    const initFormWith = (flight) => {
        setFlightId(flight.id)
        setLaunchPoint(flight.launchPoint);
        setDepartureDateTime(flight.departure ? dayjs.utc(flight.departure).local() : null);
        setFlightType(flight.flightType);

        setInitialized(true);
    }

    const disableErrorByFieldName = (fieldName) => {
        setFieldErrorData(prevState => {
            return {...prevState, [fieldName]: null};
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFormError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [formError]);

    useEffect(() => {
        if (loadedLaunchPointField && editMode && !initialized) {
            initFormWith(props.flight);
        }
    }, [loadedLaunchPointField]);

    useImperativeHandle(ref, ()=>({
        setOpen
    }))

    return (
        <React.Fragment>
            <SideEditForm open={open} onClose={() => setOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Typography variant="h4" align="center" gutterBottom>
                            {editMode
                                ? `Вылет`
                                : "Новый вылет"}
                        </Typography>
                        <Divider>
                            <Chip label="Данные вылета" sx={{fontSize: "1.2rem"}}/>
                        </Divider>
                        <InputLaunchPointAutocompleteCreatable
                            data={launchPointData}
                            onChange={setLaunchPoint}
                            error={null}
                            showError={showError}
                            onLoad={setLoadedLaunchPointField}
                            variant="standard"
                            required
                        />
                        <InputDateTime
                            data={departureDateTimeData}
                            onChange={setDepartureDateTime}
                            error={fieldErrorData.departure}
                            slotProps={{textField: {variant: "standard", fullWidth: true, required: true}}}
                        />
                        <SelectCommon
                            data={flightTypeData}
                            onChange={setFlightType}
                            error={fieldErrorData.flightType}
                            withoutAny
                            required
                            variant={"standard"}
                        />
                    </Stack>
                    <Stack direction="row" spacing={4} mt={4} mb={4}>
                        <Button
                            variant="outlined"
                            size="large"
                            type="button"
                            onClick={resetForm}
                            sx={{
                                borderColor:"#337ab7",
                                color:"#337ab7",
                                '&:hover': {
                                    borderColor:"#337ab7"
                                }
                            }}
                            startIcon={
                                editMode
                                    ?
                                    <RestoreOutlined size="large" color="#337ab7"/>
                                    :
                                    <CloseOutlined fontSize="large" color="#337ab7"/>
                            }>
                            {editMode ? "Вернуть" : "Очистить"}
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            sx={{
                                backgroundColor:"#337ab7",
                                borderColor:"#337ab7",
                                '&:hover': {
                                    backgroundColor:"#286093"
                                }
                            }}
                            endIcon={<DoneOutlined fontSize="large"/>}>
                            Сохранить
                        </Button>
                    </Stack>
                </form>
            </SideEditForm>
            {formError && <ErrorSnackbar
                message={formError.message}
                anchorOrigin={{horizontal: "left", vertical: "bottom"}}
                sx={{zIndex: 1400}}
            />}
        </React.Fragment>
    );
};

export default forwardRef(FlightSideEditForm);