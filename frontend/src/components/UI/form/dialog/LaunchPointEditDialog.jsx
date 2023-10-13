import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
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
import {KEEPER_URL, MAIN_KEEPER_URL, LAUNCH_POINTS_URL} from "../../../../constants";

const emptyValue = {id: null ,name:"", distance: null, mainKeeperPreciseDistance: null, label: ""}

const LaunchPointEditDialog = (props, ref) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(emptyValue);
    const [editMode, setEditMode] = useState(false);

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const [keepers, setKeepers] = useState([]);
    const [mainKeeper, setMainKeeper] = useState({});

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
                setError(null);
                setErrors({});
                props.onChange(created);
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
            } else {
                const apiError = await response.json();
                setError(apiError);
                if (apiError.fields) {
                    setErrors(apiError.fields)
                }
                return;
            }
        } catch (e) {
            throw new Error("Ошибка при сохранении данных точки запуска", e);
        }
        handleClose()
    }

    const fetchKeepers = async () => {
        try {
            const response = await fetch(KEEPER_URL);
            if (response.ok) {
                setKeepers(await response.json());
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке списка владельцев", e)
        }
    }

    const fetchMainKeeper = async () => {
        try {
            const response = await fetch(MAIN_KEEPER_URL + "/withPreciseDistances");
            if (response.ok) {
                const mainKeeper = await response.json();
                setMainKeeper(mainKeeper);
                setValue({...value, mainKeeperPreciseDistance: mainKeeper.preciseDistances[value.id]})

            }
        } catch (e) {
            throw new Error("Ошибка при загрузке основного владельца", e)
        }
    }

    useEffect(() => {
        fetchKeepers();
        fetchMainKeeper();
    }, []);

    const handleClose = () => {
        setValue(emptyValue);
        setOpen(false);
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
            label: incomingValue.label,
            mainKeeperPreciseDistance: incomingValue.mainKeeperPreciseDistance
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
                    <Stack spacing={3}>
                        <FormControl error={errors.name}>
                            <FormLabel>Название точки</FormLabel>
                            <Input
                                autoFocus
                                id="name"
                                type="text"
                                variant="outlined"
                                size="lg"
                                value={value.name}
                                onChange={(e) => {
                                    setErrors({
                                        ...errors,
                                        name: null})
                                    setValue({
                                        ...value,
                                        name: e.target.value
                                    })
                                }}
                            />
                            <FormHelperText>
                                {errors.name && <InfoOutlined/>}
                                {getHelperText(errors.name)}
                            </FormHelperText>
                        </FormControl>
                        <FormControl error={errors.distance}>
                            <FormLabel>Номинальная дистанция, км</FormLabel>
                            <Input
                                id="distance"
                                type="number"
                                variant="outlined"
                                size="lg"
                                value={value.distance}
                                onChange={(e) => {
                                    setErrors({
                                        ...errors,
                                        distance: null})
                                    setValue({
                                        ...value,
                                        distance: e.target.value
                                    })
                                }}
                            />
                            <FormHelperText>
                                {errors.distance && <InfoOutlined/>}
                                {getHelperText(errors.distance)}
                            </FormHelperText>
                        </FormControl>
                        <FormControl error={errors.mainKeeperPreciseDistance}>
                            <FormLabel>Точная дистанция, км</FormLabel>
                            <Input
                                id="mainKeeperPreciseDistance"
                                type="number"
                                slotProps={{
                                    input: {
                                        step: 0.001
                                    }
                                }}
                                variant="outlined"
                                size="lg"
                                value={value.mainKeeperPreciseDistance}
                                onChange={(e) => {
                                    setValue({
                                        ...value,
                                        mainKeeperPreciseDistance: e.target.value
                                    })
                                }}
                            />
                            <FormHelperText>
                                {errors.mainKeeperPreciseDistance && <InfoOutlined/>}
                                {getHelperText(errors.mainKeeperPreciseDistance)}
                            </FormHelperText>
                        </FormControl>
                        <Stack direction="row" justifyContent="space-between">
                            <Button size="lg" variant="outlined" onClick={handleClose}>Отмена</Button>
                            <Button type="submit" size="lg">Сохранить</Button>
                        </Stack>
                    </Stack>

                </form>
            </ModalDialog>
        </Modal>
    );
};

export default forwardRef(LaunchPointEditDialog);