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
import {SECTIONS_URL} from "../../../../pages/dovecote";

const sectionType = {
    DOVECOTE: "DOVECOTE",
    ROOM: "ROOM",
    NEST: "NEST"
}

const DovecoteEditDialog = (props, ref) => {
    const [open, toggleOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [dialogValue, setDialogValue] = useState({id: "", name: "", sectionType: "", parentId:""});
    const [sectionsOptions, setSectionsOptions] = useState([]);

    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sectionTypeError, setSectionTypeError] = useState(null);
    const [parentError, setParentError] = useState(null);

    const sectionTypeOptions = [
        {value: sectionType.DOVECOTE, label: "Голубятня"},
        {value: sectionType.ROOM, label: "Секция"},
        {value: sectionType.NEST, label: "Гнездо"},
    ]

    useEffect(()=> {
        updateSectionsOptions();
    }, []);

    const updateSectionsOptions = async () => {
        try {
            const response = await fetch(HIERARCHICAL_SECTIONS_URL);
            if (response.ok) {
                const sectionsOptions = await response.json();
                setSectionsOptions(flatten(addHierarchicalLabelsTo(sectionsOptions)));
            } else {
                const apiError = await response.json();
                setError(apiError);
            }
        } catch (e) {
            throw new Error("Ошибка при попытке обновить список секций", e);
        }
    }

    const handleClose = () => {
        toggleOpen(false);
        setDialogValue({id: "", name: "", sectionType: "", parentId:""});
        setEditMode(false);
        setOldValue(null);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const url = SECTIONS_URL + `${editMode ? `/${dialogValue.id}` : ""}`
        try {
            const response = await fetch(url, {
                method: editMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dialogValue)
            });
            if (response.ok) {
                const persisted = await response.json();
                cleanErrors();
                if (props.handleOldValue && oldValue) {
                    props.handleOldValue(oldValue);
                }
                setOldValue(null);
                if (props.onChange) {
                    props.onChange(
                        addHierarchicalLabel(
                            persisted, sectionsOptions.find(section => section.id === persisted.parentId)
                        )
                    );
                }
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
                await updateSectionsOptions();
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

    const openWithParentId = (parentId ,type) => {
        toggleOpen(true);
        setDialogValue({...dialogValue, parentId: parentId, sectionType: sectionType[type]});
    }

    const [oldValue, setOldValue] = useState(null);
    const openInEditMode = (section) => {
        setEditMode(true);
        toggleOpen(true);
        setOldValue(section);
        setDialogValue({
            id: section.id,
            name: section.name,
            parentId: section.parentId,
            sectionType: section.sectionType
        })
    }

    const openForDovecoteCreation = () => {
        toggleOpen(true);
        setDialogValue({
            ...dialogValue,
            sectionType: sectionType.DOVECOTE
        })
    }

    const closeErrorAlert = () => {
        setError(null);
    }

    useImperativeHandle(ref, ()=> ({
        openWithValue,
        openWithParentId,
        openInEditMode,
        openForDovecoteCreation
    }))

    return (
        <Dialog open={open} onClose={handleClose} >
            <form onSubmit={handleSubmit}>
                <DialogTitle>{editMode ? "Изменение секции голубятни" : "Новая голубятня или секция"}</DialogTitle>
                <DialogContent sx={{display:"flex",flexWrap:"wrap", gap:"12px", alignItems:"stretch"}}>
                    <DialogContentText sx={{flex:"1 0 100%"}}>
                        Здесь вы можете обновить или создать новую голубятню, её внутреннюю секцию или гнездо
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
                    <FormControl variant="outlined" sx={{flex:"2 0"}} error={sectionTypeError} disabled={editMode}>
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
                            <MenuItem value={sectionType.DOVECOTE}>Голубятня</MenuItem>
                            <MenuItem value={sectionType.ROOM}>Секция</MenuItem>
                            <MenuItem value={sectionType.NEST}>Гнездо</MenuItem>
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
