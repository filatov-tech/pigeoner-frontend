import React, {useId, useState} from 'react';
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {createFilterOptions} from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import {KEEPER_URL} from "../../../pages/pigeons";

const filter = createFilterOptions();

const InputKeeperAutocompleteCreatable = ({data, setValue, updateKeepers, ...textFieldParams}) => {
    const inputId = useId();

    const [open, toggleOpen] = useState(false);

    const handleClose = () => {
        setValue({label:""});
        toggleOpen(false);
    }

    const [dialogValue, setDialogValue] = useState({label:""});

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(KEEPER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: dialogValue.label})
        })
            .then(res => {
                if (res.statusText === "Created") {
                    updateKeepers();
                    return res.json();
                } else {
                    throw new Error("Не удалось сохранить нового владельца")
                }
            })
            .then(json => {
                json.label = json.name;
                setValue(json);
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
                                label: newValue
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
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
                options={data.options}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.label;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                freeSolo
                renderInput={(params) => <TextField {...params} {...textFieldParams} label={data.label} margin="dense" />}
            />
            <Dialog open={open} onClose={handleClose} >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Добавить нового владельца</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Создайте нового владельца, введя фамилию и инициалы
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            value={dialogValue.label}
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    label: event.target.value,
                                })
                            }
                            label="ФИО владельца"
                            type="text"
                            variant="standard"
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

export default InputKeeperAutocompleteCreatable;