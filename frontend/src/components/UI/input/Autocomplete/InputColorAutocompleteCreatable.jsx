import React, {useEffect, useRef, useState} from 'react';
import {createFilterOptions} from "@mui/material/Autocomplete";
import {useId} from "react";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import ColorEditDialog from "../../form/dialog/ColorEditDialog";
import {getHelperText} from "../../../../util/utils";

const filter = createFilterOptions();
export const COLOR_URL = "/api/v1/color"

const InputColorAutocompleteCreatable = ({data, onChange, error, ...textFieldParams}) => {
    const inputId = useId();
    const dialogRef = useRef();

    const [colorOptions, setColorOptions] = useState([]);

    useEffect(()=> {
        fetchColors()
    }, [])

    const fetchColors = () => {
        fetch(COLOR_URL)
            .then(res => res.json())
            .then(json => setColorOptions(json))
    }

    return (
        <React.Fragment>
            <Autocomplete
                value={data.value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            dialogRef.current.openWithValue(newValue);
                        });
                    } else if (newValue && newValue.inputValue) {
                        dialogRef.current.openWithValue(newValue.inputValue);
                    } else {
                        onChange(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            name: `Добавить "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id={inputId}
                options={colorOptions}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.name;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                freeSolo
                renderInput={(params) =>
                    <TextField
                        {...params}
                        {...textFieldParams}
                        error={error}
                        helperText={getHelperText(error)}
                        label={data.label} />}
            />
            <ColorEditDialog ref={dialogRef} onChange={onChange} onSubmit={[fetchColors]} />
        </React.Fragment>
    );
};

export default InputColorAutocompleteCreatable;