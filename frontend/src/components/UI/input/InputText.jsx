import React, {useId} from 'react';
import {FormControl, TextField} from "@mui/material";

const InputText = ({data, onChange, ...muiProps}) => {
    const textInputId = useId();

    return (
        <FormControl fullWidth>
            <TextField
                id={textInputId}
                label={data.label}
                value={data.value}
                onChange={(e) => onChange(e.target.value)}
                {...muiProps}
            />
        </FormControl>
    );
};

export default InputText;
