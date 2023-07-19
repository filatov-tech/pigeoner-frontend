import React, {useId} from 'react';
import {FormControl, TextField} from "@mui/material";

const InputText = ({filterData, onChange}) => {
    const textInputId = useId();

    const handleChange = (e) => {
        onChange({
            name: filterData.name,
            value: e.target.value
        });
    }

    return (
        <FormControl fullWidth>
            <TextField
                id={textInputId}
                label={filterData.label}
                value={filterData.value}
                onChange={handleChange}/>
        </FormControl>
    );
};

export default InputText;
