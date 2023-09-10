import React, {forwardRef} from 'react';
import {useState} from "react";
import {COLOR_URL} from "../../input/Autocomplete/InputColorAutocompleteCreatable";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ErrorSnackbar from "../../ErrorSnackbar";
import {useImperativeHandle} from "react";

const ColorEditDialog = (props, ref) => {
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({name:""});

    const [error, setError] = useState();
    const [nameError, setNameError] = useState();

    const handleClose = () => {
        setDialogValue({name: ""});
        setError(null);
        setNameError(null);
        toggleOpen(false);
    }

    const openWithValue = (value) => {
        toggleOpen(true);
        setDialogValue({
            name: value
        });
    }

    useImperativeHandle(ref, ()=> ({
        openWithValue
    }))

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(COLOR_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dialogValue)
            });
            if (response.ok) {
                const created = await response.json();
                props.onChange(created);
                setError(null);
                setNameError(null);
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
            } else {
                const apiError = await response.json();
                setError(apiError);
                if (apiError.fields.name) {
                    setNameError(apiError.fields.name);
                }
                return;
            }
        } catch (err) {
            console.log("Error! ", err)
        }
        handleClose();
    }

    const closeErrorAlert = () => {
        setError(null);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Новый окрас</DialogTitle>
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
                        error={error}
                        helperText={nameError ? nameError.shortMessage : " "}
                        margin="normal"
                        variant="outlined"
                    />
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

export default forwardRef(ColorEditDialog);