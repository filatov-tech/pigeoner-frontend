import React from 'react';
import {DatePicker} from "@mui/x-date-pickers";
import {createTheme, ThemeProvider} from "@mui/material";

const InputDate = ({data, onChange, customStyle, onlyYear, ...muiProps}) => {
    const viewProps = {};
    if (onlyYear) {
        viewProps.views = ["year"];
    }

    const theme = createTheme({
        components: customStyle || {}
    });

    return (
        <ThemeProvider theme={theme}>
            <DatePicker
                label={data.label}
                value={data.value}
                {...viewProps}
                {...muiProps}
                onChange={(newValue) => onChange(newValue)}
            />
        </ThemeProvider>
    );
};

export default InputDate;