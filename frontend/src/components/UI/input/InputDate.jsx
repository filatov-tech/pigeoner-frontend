import React, {useId} from 'react';
import {DatePicker} from "@mui/x-date-pickers";
import {createTheme, ThemeProvider} from "@mui/material";

const InputDate = ({filterData, onChange, customStyle}) => {
    const inputDateId = useId();

    const handleChange = (value) => {
        onChange({
            name: filterData.name,
            value: value
        });
    }

    const theme = createTheme({
        components: customStyle
    });

    return (
        <ThemeProvider theme={theme}>
            <DatePicker
                label={filterData.label}
                value={filterData.value}
                onChange={(newValue) => handleChange(newValue)}
            />
        </ThemeProvider>
    );
};

export default InputDate;