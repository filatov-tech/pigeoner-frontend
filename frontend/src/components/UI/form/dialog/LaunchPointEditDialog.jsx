import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
    Button,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalDialog,
    Stack
} from "@mui/joy";
import {InfoOutlined} from "@mui/icons-material";
import {getHelperText} from "../../../../util/utils";
import {LAUNCH_POINTS_URL} from "../../input/Autocomplete/InputLaunchPointAutocompleteCreatable";

const emptyValue = {id: null ,name:"", distance: null, label: ""}

const LaunchPointEditDialog = (props, ref) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(emptyValue);
    const [editMode, setEditMode] = useState(false);

    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [distanceError, setDistanceError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await fetch(`${LAUNCH_POINTS_URL}${editMode ? `/${value.id}` : ""}`, {
                method: editMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(value)
            });
            if (response.ok) {
                const created = await response.json();
                cleanErrors();
                props.onChange(created);
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
            } else {
                const apiError = await response.json();
                setError(apiError);
                setNameError(apiError.fields.name);
                setDistanceError(apiError.fields.distance);
                return;
            }
        } catch (e) {
            throw new Error("Ошибка при сохранении данных точки запуска", e);
        }
        handleClose()
    }

    const handleClose = () => {
        setValue(emptyValue);
        setOpen(false);
    }

    const cleanErrors = () => {
        setError(null);
        setNameError(null);
        setDistanceError(null);
    }

    const openWithValue = (incomingValue) => {
        setOpen(true);
        setValue({...value, name: incomingValue});
    }

    const openInEditMode = (incomingValue) => {
        setEditMode(true);
        setValue({
            ...value,
            name: incomingValue.name,
            distance: incomingValue.distance,
            id: incomingValue.id,
            label: incomingValue.label
        })
        setOpen(true);
    }

    useImperativeHandle(ref,  () => ({
        openWithValue,
        openInEditMode
    }))

    return (
        <Modal open={open} onClose={handleClose}>
            <ModalDialog>
                <DialogTitle>{editMode ? "Редактирование точки выпуска" : "Новая точка выпуска"}</DialogTitle>
                <DialogContent>Заполните информацию о точке выпуска голубей</DialogContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3} direction="row">
                        <FormControl error={nameError}>
                            <FormLabel>Название точки</FormLabel>
                            <Input
                                autoFocus
                                id="name"
                                type="text"
                                variant="outlined"
                                size="lg"
                                value={value.name}
                                onChange={(e) => {
                                    setNameError(null);
                                    setValue({
                                        ...value,
                                        name: e.target.value
                                    })
                                }}
                            />
                            <FormHelperText>
                                {nameError && <InfoOutlined/>}
                                {getHelperText(nameError)}
                            </FormHelperText>
                        </FormControl>
                        <FormControl error={distanceError}>
                            <FormLabel>Дистанция, км</FormLabel>
                            <Input
                                id="distance"
                                type="number"
                                variant="outlined"
                                size="lg"
                                value={value.distance}
                                onChange={(e) => {
                                    setDistanceError(null);
                                    setValue({
                                        ...value,
                                        distance: e.target.value
                                    })
                                }}
                            />
                            <FormHelperText>
                                {distanceError && <InfoOutlined/>}
                                {getHelperText(distanceError)}
                            </FormHelperText>
                        </FormControl>
                    </Stack>
                    <Stack direction="row-reverse">
                        <Button type="submit" size="lg" sx={{marginTop: "20px"}}>Сохранить</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default forwardRef(LaunchPointEditDialog);