import React, {useEffect, useState} from 'react';
import {createFilterOptions} from "@mui/material/Autocomplete";
import {useId} from "react";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

const filter = createFilterOptions();
const COLOR_URL = "/api/v1/color"

const InputColorAutocompleteCreatable = ({data, onChange, ...textFieldParams}) => {
    const inputId = useId();

    const [open, toggleOpen] = useState(false);
    const [colorOptions, setColorOptions] = useState([]);

    const handleClose = () => {
        setDialogValue({name: ""});
        toggleOpen(false);
    }

    const [dialogValue, setDialogValue] = useState({name:""});

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(COLOR_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dialogValue)
        })
            .then(res => {
                if (res.statusText === "Created") {
                    fetchColors();
                    return res.json();
                } else {
                    throw new Error("Не удалось сохранить нового владельца")
                }
            })
            .then(json => onChange(json))
        handleClose();
    }

    useEffect(()=> {
        fetchColors()
    }, [])

    const fetchColors = () => {
        fetch(COLOR_URL)
            .then(res => res.json())
            .then(json => setColorOptions(json))
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
                                name: newValue
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            name: newValue.inputValue
                        });
                    } else {
                        onChange(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            name: `Добавить "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id={inputId}
                options={colorOptions}
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
                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                freeSolo
                renderInput={(params) => <TextField {...params} {...textFieldParams} label={data.label} margin="dense" />}
            />
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Добавить новый окрас</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Если вы не нашли нужный вариант окраса, вы можете создать здесь новый.
                            Для этого введите название для нового окраса:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            id="name"
                            value={dialogValue.name}
                            onChange={(event) => {
                                setDialogValue({name: event.target.value})
                            }}
                            label="Название окраса"
                            type="text"
                            margin="normal"
                            variant="outlined"
                        />
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

export default InputColorAutocompleteCreatable;