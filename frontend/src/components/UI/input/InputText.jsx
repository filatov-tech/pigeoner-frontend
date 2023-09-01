import React, {useId} from 'react';
import {FormControl, TextField} from "@mui/material";

const InputText = ({data, onChange}) => {
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
                onChange={handleChange}/>
        </FormControl>
    );
};

export default InputText;
