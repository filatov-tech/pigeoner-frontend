import React, {useId} from 'react';
import {FormControl, TextField} from "@mui/material";
import {getHelperText} from "../../../util/utils";

const InputText = ({data, onChange, error, ...muiProps}) => {
    const textInputId = useId();

    return (
        <FormControl fullWidth>
            <TextField
                id={textInputId}
                label={data.label}
                value={data.value}
                onChange={(e) => onChange(e.target.value)}
                error={error}
                helperText={getHelperText(error)}
                {...muiProps}
            />
        </FormControl>
    );
};

export default InputText;
