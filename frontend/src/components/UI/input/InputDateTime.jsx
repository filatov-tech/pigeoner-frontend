import React, {useMemo} from 'react';
import {DateTimePicker, renderTimeViewClock} from "@mui/x-date-pickers";
import {getHelperText} from "../../../util/utils";

const InputDateTime = ({data, onChange, error, ...muiProps}) => {

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

    return (
        <DateTimePicker
            label={data.label}
            value={data.value}
            onChange={(newValue) => {
                error && error.disable(data.name);
                onChange(newValue);
            }}
            ampmInClock={false}
            ampm={false}
            viewRenderers={{
                hours: renderTimeViewClock,
                minutes: null,
                seconds: null
            }}
            {...extendedMuiProps}
        />
    );
};

export default InputDateTime;