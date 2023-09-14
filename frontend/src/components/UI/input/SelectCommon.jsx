import React, {useId} from 'react';
import {createTheme, FormControl, InputLabel, MenuItem, Select, ThemeProvider} from "@mui/material";

const SelectCommon = ({data, onChange, customStyle, withoutAny, variant, ...muiProps}) => {
    const selectId = useId();

    const theme = createTheme({
        components: customStyle || {}
    });

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth variant={variant}>
                {data.label && <InputLabel id={selectId}>{data.label}</InputLabel>}
                <Select
                    labelId={selectId}
                    id={data.name}
                    value={data.value}
                    label={data.label}
                    onChange={(e) => onChange(e.target.value)}
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