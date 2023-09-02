import React, {useId} from 'react';
import {FormControl, TextField} from "@mui/material";

const InputText = ({data, onChange, ...muiProps}) => {
    const textInputId = useId();

    const handleChange = (e) => {
        onChange({
            name: data.name,
            value: e.target.value
        });
    }

    return (
        <FormControl fullWidth>
            <TextField
                id={textInputId}
                label={data.label}
                value={data.value}
                onChange={handleChange}
                {...muiProps}
            />
        </FormControl>
    );
};

export default InputText;
