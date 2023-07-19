import React, {useId} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const SelectCommon = ({filterData, onChange}) => {
    const selectId = useId();

    const handleChange = (event) => {
        onChange({
            name: filterData.name,
            value: event.target.value
        });
    }

    return (
        <FormControl fullWidth>
            {filterData.label && <InputLabel id={selectId}>{filterData.label}</InputLabel>}
            <Select
                labelId={selectId}
                id={filterData.name}
                value={filterData.value}
                label={filterData.label}
                onChange={handleChange}
            >
                <MenuItem value=""><em>-</em></MenuItem>
                {filterData.options.map(option =>
                    <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
            </Select>
        </FormControl>

    );
};

export default SelectCommon;