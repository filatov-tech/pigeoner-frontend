import React, {useId, useMemo, useRef, useState} from 'react';
import {DateTimePicker, renderTimeViewClock} from "@mui/x-date-pickers";
import {getHelperText} from "../../../util/utils";
import {FormControl, FormHelperText, TextField} from "@mui/material";
import {Stack} from "@mui/joy";

const InputDateTime = ({data, onChange, error, withMillis, view, ...muiProps}) => {

    const [millisView] = useState(withMillis);
    const [millis, setMillis] = useState((withMillis && data.value) ? data.value.millisecond() : null);
    const [numberConstraintViolation, setNumberConstraintViolation] = useState(null);
    const millisInputId = useId();
    const millisRef = useRef();

    const errorMessage = useMemo(()=> {
        return getHelperText(error);
    }, [error])

    const extendedProps = {
        ...muiProps,
        slotProps: {
            ...muiProps?.slotProps,
            textField: {
                ...muiProps?.slotProps?.textField,
                error: error,
                helperText: errorMessage
            },
        }
    }
    
    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            millisRef.current.focus();
        }
    }

    const handleChange = (value, isMillis) => {
        if (isMillis) {
            if (!(value >= 0 && value <= 999)) {
                setNumberConstraintViolation({message: "Диапазон миллисек: 0-999"})
            }
            setMillis(value);
            if (data.value) {
                onChange(data.value.millisecond(value));
            }
        } else if (millisView && value) {
            onChange(value.add(millis ? millis : 0, "millisecond"));
        } else {
            onChange(value);
        }
    }

    const millisViewProps = {
        ...extendedProps,
        slotProps: {
            ...muiProps?.slotProps,
            textField: {
                ...muiProps?.slotProps?.textField,
                inputProps: {
                    ...muiProps?.slotProps?.textField?.inputProps,
                    style: {
                        ...muiProps?.slotProps?.textField?.inputProps?.style,
                        textAlign: "right"
                    }
                },
                onKeyPress: handleEnterPress
            },
            inputAdornment: {
                position: "start"
            }
        },
        views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds']
    }
    const completeMuiProps = millisView ? millisViewProps : extendedProps;

    return (
        <React.Fragment>
            <FormControl fullWidth>
                <Stack spacing={1} direction="row">
                    <DateTimePicker timezone="system"
                        label={data.label}
                        value={data.value}
                        onChange={(newValue) => {
                            error && error.disable(data.name);
                            handleChange(newValue, false);
                        }}
                        ampmInClock={false}
                        ampm={false}
                        viewRenderers={muiProps.viewRenderers
                            ? muiProps.viewRenderers
                            : {
                                hours: millisView ? null : renderTimeViewClock,
                                minutes: millisView ? null : renderTimeViewClock,
                                seconds: null
                            }}
                        {...completeMuiProps}
                    />
                    {millisView && <div style={{flex: "0 1 25%"}}>
                        <TextField
                            id={millisInputId}
                            value={millis}
                            error={numberConstraintViolation}
                            onChange={(event) => {
                                setNumberConstraintViolation(null)
                                handleChange(event.target.value, true);
                            }}
                            inputRef={millisRef}
                            placeholder="000"
                            type="number"
                            variant="outlined"
                            label="мс"
                        />
                    </div>}
                </Stack>
            </FormControl>
        </React.Fragment>
    );
};

export default InputDateTime;