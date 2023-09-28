import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import SideEditForm from "./SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider} from "@mui/material";
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import InputLaunchPointAutocompleteCreatable from "../input/Autocomplete/InputLaunchPointAutocompleteCreatable";
import ErrorSnackbar from "../ErrorSnackbar";

export const flightTypes = {
    CUP: "Кубковое соревнование",
    COMPETITION: "Соревнование",
    TRAINING: "Тренировка",
    JUNIOR_COMPETITION: "Юниорское соревнование"
}

const FlightSideEditForm = (props, ref) => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(null);
    const [formError, setFormError] = useState(null);

    const [launchPoint, setLaunchPoint] = useState(null);
    const [departureDateTime, setDepartureDateTime] = useState(null);
    const [flightType, setFlightType] = useState(null);

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
        "Тип вылета",
        "",
        [
            {value: "CUP", label: "Кубковое соревнование"},
            {value: "COMPETITION", label: "Соревнование"},
            {value: "TRAINING", label: "Тренировка"},
            {value: "JUNIOR_COMPETITION", label: "Юниорское соревнование"}
        ]
    )

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    const showError = (error) => {
        setFormError(error)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFormError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [formError]);

    useImperativeHandle(ref, ()=>({
        setOpen
    }))

    return (
        <React.Fragment><SideEditForm open={open} onClose={() => setOpen(false)}>
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" align="center" gutterBottom>
                    {editMode
                        ? `Вылет`
                        : "Новый вылет"}
                </Typography>
                <Divider sx={{marginBottom: "15px"}}>
                    <Chip label="Данные вылета" sx={{fontSize: "1.2rem"}}/>
                </Divider>
                {/*    autocomplete, datepicker, select    */}
                <InputLaunchPointAutocompleteCreatable
                    data={launchPointData}
                    onChange={setLaunchPoint}
                    error={null}
                    showError={showError}
                    variant="standard"
                />
            </form>
        </SideEditForm>
            {formError && <ErrorSnackbar
                message={formError.message}
                anchorOrigin={{horizontal: "left", vertical: "bottom"}}
                sx={{zIndex:1400}}
            />}</React.Fragment>
    );
};

export default forwardRef(FlightSideEditForm);