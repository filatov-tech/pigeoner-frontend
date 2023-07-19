import React, {useState} from 'react';
import {Alert, Snackbar} from "@mui/material";

const ErrorSnackbar = ({message, close}) => {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        close();
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