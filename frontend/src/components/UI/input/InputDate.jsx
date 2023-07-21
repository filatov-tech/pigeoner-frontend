import React from 'react';
import {DatePicker} from "@mui/x-date-pickers";
import {createTheme, ThemeProvider} from "@mui/material";

const InputDate = ({filterData, onChange, customStyle, onlyYear}) => {
    const handleChange = (value) => {
        onChange({
            name: filterData.name,
            value: value
        });
    }

    const viewProps = {};
    if (onlyYear) {
        viewProps.views = ["year"];
    }

    const theme = createTheme({
        components: customStyle
    });

    return (
        <ThemeProvider theme={theme}>
            <DatePicker
                label={filterData.label}
                value={filterData.value}
                {...viewProps}
                onChange={(newValue) => handleChange(newValue)}
            />
        </ThemeProvider>
    );
};

export default InputDate;