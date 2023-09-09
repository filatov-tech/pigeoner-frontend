import React, {forwardRef} from 'react';
import {useState} from "react";
import {COLOR_URL} from "../../input/Autocomplete/InputColorAutocompleteCreatable";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import {Alert} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ErrorSnackbar from "../../ErrorSnackbar";
import {useImperativeHandle} from "react";

const ColorEditDialog = (props, ref) => {
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({name:""});

    const [errors, setErrors] = useState();
    const [nameError, setNameError] = useState();

    const handleClose = () => {
        setDialogValue({name: ""});
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
                if (props.onSubmit) {
                    props.onSubmit.forEach((callback) => callback());
                }
            } else {
                const apiError = await response.json();
                setErrors(apiError.errors);
                return;
            }
        } catch (err) {
            console.log("Error! ", err)
        }
        handleClose();
    }

    const closeErrorAlert = () => {
        setErrors(null);
    }

    return (
        <React.Fragment>
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
                            margin="normal"
                            variant="outlined"
                        />
                        {nameError && <Alert severity="error">
                            {nameError.message}
                        </Alert>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </DialogActions>
                </form>
            </Dialog>
            {errors && <ErrorSnackbar message={errors.message} onClose={closeErrorAlert}/>}
        </React.Fragment>
    );
};

export default forwardRef(ColorEditDialog);