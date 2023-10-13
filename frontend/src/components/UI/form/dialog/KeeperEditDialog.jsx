import React, {forwardRef, useState, useImperativeHandle} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {KEEPER_URL} from "../../../../constants";
import ErrorSnackbar from "../../ErrorSnackbar";

const KeeperEditDialog = (props, ref) => {
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({name:""});

    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await fetch(KEEPER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dialogValue)
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
                return;
            }
        } catch (err) {
            console.log("Error! ", err)
        }
        handleClose();
    }

    const handleClose = () => {
        setDialogValue({name:""});
        toggleOpen(false);
    }

    const closeErrorAlert = () => {
        setError(null);
    }

    const cleanErrors = () => {
        setError(null);
        setNameError(null);
    }

    const getHelperText = (error) => {
        if (!error) {
            return " ";
        }
        if (error.shortMessage) {
            return error.shortMessage;
        } else {
            return error.messages[0];
        }
    }

    const openWithValue = (value) => {
        toggleOpen(true);
        setDialogValue({name: value});
    }

    useImperativeHandle(ref, ()=> ({
        openWithValue
    }))

    return (
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
                        value={dialogValue.name}
                        onChange={(event) => {
                            setNameError(null);
                            setDialogValue({
                                ...dialogValue,
                                name: event.target.value,
                            });
                        }
                        }
                        label="ФИО владельца"
                        type="text"
                        error={nameError}
                        helperText={getHelperText(nameError)}
                        variant="standard"
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

export default forwardRef(KeeperEditDialog);