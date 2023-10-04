import React, {useId} from 'react';
import {createTheme, FormControl, FormHelperText, InputLabel, MenuItem, Select, ThemeProvider} from "@mui/material";
import {getHelperText} from "../../../util/utils";

const SelectCommon = ({data, onChange, error, customStyle, withoutAny, variant, ...muiProps}) => {
    const selectId = useId();

    const theme = createTheme({
        components: customStyle || {}
    });

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth variant={variant} error={error}>
                {data.label && <InputLabel id={selectId}>{data.label}</InputLabel>}
                <Select
                    labelId={selectId}
                    id={data.name}
                    value={data.value}
                    label={data.label}
                    onChange={(e) => {
                        error && error.disable(data.name);
                        onChange(e.target.value)
                    }}
                    {...muiProps}
                >
                    {!withoutAny && <MenuItem value={null}><em>не важно</em></MenuItem>}
                    {data.options.map(option =>
                        <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
                </Select>
                <FormHelperText error>&nbsp;{getHelperText(error)}</FormHelperText>
            </FormControl>
        </ThemeProvider>

    );
};

export default SelectCommon;