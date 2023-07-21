import React, {useId} from 'react';
import {createTheme, FormControl, InputLabel, MenuItem, Select, ThemeProvider} from "@mui/material";

const SelectCommon = ({filterData, onChange, customStyle}) => {
    const selectId = useId();

    const handleChange = (event) => {
        onChange({
            name: filterData.name,
            value: event.target.value
        });
    }

    const theme = createTheme({
        components: customStyle || {}
    });

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth>
                {filterData.label && <InputLabel id={selectId}>{filterData.label}</InputLabel>}
                <Select
                    labelId={selectId}
                    id={filterData.name}
                    value={filterData.value}
                    label={filterData.label}
                    onChange={handleChange}
                >
                    {filterData.options.map(option =>
                        <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
                </Select>
            </FormControl>
        </ThemeProvider>

    );
};

export default SelectCommon;