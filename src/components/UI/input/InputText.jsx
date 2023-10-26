import React, {useId, useMemo} from 'react';
import {FormControl, TextField} from "@mui/material";
import {getHelperText} from "../../../util/utils";

const InputText = ({data, onChange, error, withoutHelperText, ...muiProps}) => {
    const textInputId = useId();

    const errorMessage = useMemo(()=> {
        return getHelperText(error);
    }, [error])

    const extendedMuiProps = withoutHelperText ? muiProps : {...muiProps, helperText: errorMessage};

    return (
        <FormControl fullWidth>
            <TextField
                id={textInputId}
                label={data.label}
                value={data.value}
                onChange={(e) => {
                    error && error.disable(data.name);
                    onChange(e.target.value);
                }}
                error={error}
                {...extendedMuiProps}
            />
        </FormControl>
    );
};

export default InputText;
