import React, {useEffect} from 'react';
import ErrorSnackbar from "../ErrorSnackbar";

const AutocloseableErrorMessage = ({error, setError, timeout, ...snackbarProps}) => {

    const onClose = () => {
        setError(null)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
        }, timeout ? timeout : 10000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    return (
        <ErrorSnackbar
            message={error && error.message}
            onClose={onClose}
            timeout={timeout}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}
            {...snackbarProps}
        />
    );
};

export default AutocloseableErrorMessage;