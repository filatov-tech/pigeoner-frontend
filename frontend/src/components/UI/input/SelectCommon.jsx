import React, {useId} from 'react';
import {createTheme, FormControl, InputLabel, MenuItem, Select, ThemeProvider} from "@mui/material";

const SelectCommon = ({data, onChange, customStyle, withoutAny, ...muiProps}) => {
    const selectId = useId();

    const handleChange = (event) => {
        onChange({
            name: data.name,
            value: event.target.value
        });
    }

    const theme = createTheme({
        components: customStyle || {}
    });

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth>
                {data.label && <InputLabel id={selectId}>{data.label}</InputLabel>}
                <Select
                    labelId={selectId}
                    id={data.name}
                    value={data.value}
                    label={data.label}
                    onChange={handleChange}
                    {...muiProps}
                >
                    {!withoutAny && <MenuItem value={null}><em>не важно</em></MenuItem>}
                    {data.options.map(option =>
                        <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
                </Select>
            </FormControl>
        </ThemeProvider>

    );
};

export default SelectCommon;