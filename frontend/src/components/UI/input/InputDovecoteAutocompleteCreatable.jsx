import React, {useEffect, useId, useState} from 'react';
import {addHierarchicalLabel, addHierarchicalLabelsTo} from "../../../util/section-options-builder";
import {flatten} from "../../../util/utils";
import {KEEPER_URL} from "../../../pages/pigeons";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

export const HIERARCHICAL_SECTIONS_URL = "/api/v1/sections/hierarchical";

const filter = createFilterOptions();

const InputDovecoteAutocompleteCreatable = ({data, setValue, ...inputFieldParams}) => {
    const inputId = useId();

    const [open, toggleOpen] = useState(false);
    const [sectionsOptions, setSectionsOptions] = useState([]);

    const handleClose = () => {
        setValue('');
        toggleOpen(false);
    }

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
        fetch(HIERARCHICAL_SECTIONS_URL)
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
    }, []);

    const updateSectionOptions = () => {
        fetch(HIERARCHICAL_SECTIONS_URL)
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
    }

    const [dialogValue, setDialogValue] = useState({id: "", name: "", sectionType: "", parentId:"", label: ""});

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("/api/v1/sections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dialogValue)
        })
            .then(res => {
                if (res.statusText === "Created") {
                    return res.json();
                } else {
                    throw new Error("Не удалось сохранить новую голубятню или её часть")
                }
            })
            .then(json => {
                updateSectionOptions();
                setValue(addHierarchicalLabel(json, sectionsOptions.find(section => section.id === json.parentId)));
            })
        handleClose();
    }

    return (
        <React.Fragment>
            <Autocomplete
                value={data.value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            toggleOpen(true);
                            setDialogValue({
                                name: newValue,
                                label: newValue
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            name: newValue.inputValue,
                            label: newValue.inputValue
                        });
                    } else {
                        setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            label: `Добавить "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id={inputId}
                options={sectionsOptions}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.name;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                freeSolo
                renderInput={(params) => <TextField {...params} {...inputFieldParams} label={data.label} margin="dense" />}
            />
            <Dialog open={open} onClose={handleClose} >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Добавить новую голубятню или секцию</DialogTitle>
                    <DialogContent sx={{display:"flex",flexWrap:"wrap", gap:"12px", alignItems:"stretch"}}>
                        <DialogContentText sx={{flex:"1 0 100%"}}>
                            Здесь вы можете создать новую голубятню, внутреннюю секцию или гнездо
                        </DialogContentText>
                        <TextField
                            autoFocus
                            id="name"
                            value={dialogValue.name}
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    name: event.target.value,
                                })
                            }
                            label="Название"
                            type="text"
                            variant="outlined"
                            sx={{flex:"3 0"}}
                        />
                        <FormControl variant="outlined" sx={{flex:"2 0"}}>
                            <InputLabel id="sectionType">Тип</InputLabel>
                            <Select
                                id="sectionType"
                                value={dialogValue.sectionType}
                                label="Тип"
                                onChange={(event) =>
                                    setDialogValue({
                                        ...dialogValue,
                                        sectionType: event.target.value,
                                    })
                                }
                            >
                                <MenuItem value={sectionType.dovecote}>Голубятня</MenuItem>
                                <MenuItem value={sectionType.room}>Секция</MenuItem>
                                <MenuItem value={sectionType.nest}>Гнездо</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{flex:"1 0 100%"}}>
                            <InputLabel id="dovecote">Родительская секция</InputLabel>
                            <Select
                                id="dovecote"
                                value={dialogValue.parentId}
                                label="Родительская секция"
                                onChange={(event) =>
                                    setDialogValue({
                                        ...dialogValue,
                                        parentId: event.target.value,
                                    })
                                }
                                renderValue={(value) => sectionsOptions.find(section => section.id === value).name}
                            >
                                <MenuItem dense value={null}>-</MenuItem>
                                {sectionsOptions.map(section =>
                                    <MenuItem dense value={section.id} key={section.id}>{section.label}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default InputDovecoteAutocompleteCreatable;