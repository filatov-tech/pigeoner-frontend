import React, {useMemo} from 'react';
import {DatePicker} from "@mui/x-date-pickers";
import {createTheme, ThemeProvider} from "@mui/material";
import {getHelperText} from "../../../util/utils";

const InputDate = ({data, onChange, customStyle, onlyYear, error, ...muiProps}) => {
    const viewProps = {};
    if (onlyYear) {
        viewProps.views = ["year"];
    }

    const errorMessage = useMemo(()=> {
        return getHelperText(error);
    }, [error])

    const extendedMuiProps = {
        ...muiProps,
        slotProps: {
            ...muiProps?.slotProps,
            textField: {
                ...muiProps?.slotProps?.textField,
                error: error,
                helperText: errorMessage,
            }
        }
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
                {...extendedMuiProps}
                onChange={(newValue) => {
                    error && error.disable(data.name);
                    onChange(newValue);
                }}
            />
        </ThemeProvider>
    );
};

export default InputDate;