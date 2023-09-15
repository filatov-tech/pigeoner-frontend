import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {addHierarchicalLabel, addHierarchicalLabelsTo} from "../../../../util/section-options-builder";
import {HIERARCHICAL_SECTIONS_URL} from "../../input/Autocomplete/InputDovecoteAutocompleteCreatable";
import {flatten, getHelperText} from "../../../../util/utils";
import ErrorSnackbar from "../../ErrorSnackbar";

const DovecoteEditDialog = (props, ref) => {
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({id: "", name: "", sectionType: "", parentId:""});
    const [sectionsOptions, setSectionsOptions] = useState([]);

    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sectionTypeError, setSectionTypeError] = useState(null);
    const [parentError, setParentError] = useState(null);

    const sectionType = {
        dovecote: "DOVECOTE",
        room: "ROOM",
        nest: "NEST"
    }

    const sectionTypeOptions = [
        {value: sectionType.dovecote, label: "Голубятня"},
        {value: sectionType.room, label: "Секция"},
        {value: sectionType.nest, label: "Гнездо"},
    ]

    useEffect(()=> {
        updateSectionsOptions();
    }, []);

    const updateSectionsOptions = () => {
        fetch(HIERARCHICAL_SECTIONS_URL)
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
    }

    const handleClose = () => {
        setDialogValue({id: "", name: "", sectionType: "", parentId:""});
        toggleOpen(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await fetch("/api/v1/sections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dialogValue)
            });
            if (response.ok) {
                const created = await response.json();
                cleanErrors();
                props.onChange(addHierarchicalLabel(created, sectionsOptions.find(section => section.id === created.parentId)));
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
                updateSectionsOptions();
            } else {
                const apiError = await response.json();
                setError(apiError);
                setNameError(apiError.fields.name);
                setSectionTypeError(apiError.fields.sectionType);
                setParentError(apiError.fields.parent)
                return;
            }
        } catch (err) {
            console.log("Error! ", err)
        }
        handleClose();
    }

    const cleanErrors = () => {
        setError(null);
        setNameError(null);
        setSectionTypeError(null);
        setParentError(null);
    }

    const openWithValue = (value) => {
        toggleOpen(true);
        setDialogValue({name: value});
    }

    const closeErrorAlert = () => {
        setError(null);
    }

    useImperativeHandle(ref, ()=> ({
        openWithValue
    }))

    return (
        <Dialog open={open} onClose={handleClose} >
            <form onSubmit={handleSubmit}>
                <DialogTitle>Новая голубятня или секция</DialogTitle>
                <DialogContent sx={{display:"flex",flexWrap:"wrap", gap:"12px", alignItems:"stretch"}}>
                    <DialogContentText sx={{flex:"1 0 100%"}}>
                        Здесь вы можете создать новую голубятню, её внутреннюю секцию или гнездо
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id="name"
                        value={dialogValue.name}
                        onChange={(event) => {
                            setNameError(null);
                            setDialogValue({
                                ...dialogValue,
                                name: event.target.value,
                            });
                        }}
                        label="Название"
                        error={nameError}
                        helperText={getHelperText(nameError)}
                        type="text"
                        variant="outlined"
                        sx={{flex:"3 0"}}
                    />
                    <FormControl variant="outlined" sx={{flex:"2 0"}} error={sectionTypeError}>
                        <InputLabel id="sectionType">Тип</InputLabel>
                        <Select
                            id="sectionType"
                            value={dialogValue.sectionType}
                            label="Тип"

                            onChange={(event) => {
                                setSectionTypeError(null);
                                setDialogValue({
                                    ...dialogValue,
                                    sectionType: event.target.value,
                                });
                            }}
                        >
                            <MenuItem value={sectionType.dovecote}>Голубятня</MenuItem>
                            <MenuItem value={sectionType.room}>Секция</MenuItem>
                            <MenuItem value={sectionType.nest}>Гнездо</MenuItem>
                        </Select>
                        <FormHelperText>{getHelperText(sectionTypeError)}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" sx={{flex:"1 0 100%"}} error={parentError}>
                        <InputLabel id="dovecote">Родительская секция</InputLabel>
                        <Select
                            id="dovecote"
                            value={dialogValue.parentId}
                            label="Родительская секция"
                            onChange={(event) => {
                                setParentError(null);
                                setDialogValue({
                                    ...dialogValue,
                                    parentId: event.target.value,
                                })
                            }}
                            renderValue={(value) => sectionsOptions.find(section => section.id === value).name}
                        >
                            <MenuItem dense value={null}>-</MenuItem>
                            {sectionsOptions && sectionsOptions.map(section =>
                                <MenuItem dense value={section.id} key={section.id}>{section.label}</MenuItem>
                            )}
                        </Select>
                        <FormHelperText>{getHelperText(parentError)}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button type="submit">Сохранить</Button>
                </DialogActions>
            </form>
            {error && <ErrorSnackbar message={error.message} onClose={closeErrorAlert}/>}
        </Dialog>
    );
};

export default forwardRef(DovecoteEditDialog);
