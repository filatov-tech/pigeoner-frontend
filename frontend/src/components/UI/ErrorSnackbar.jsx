import React, {useState} from 'react';
import {Alert, Snackbar} from "@mui/material";

const ErrorSnackbar = ({message, onClose}) => {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ErrorSnackbar;