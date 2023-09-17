import React, {useId, useRef} from 'react';
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DovecoteEditDialog from "../../form/dialog/DovecoteEditDialog";
import {getHelperText} from "../../../../util/utils";

export const HIERARCHICAL_SECTIONS_URL = "/api/v1/sections/hierarchical";

const filter = createFilterOptions();

const InputDovecoteAutocompleteCreatable = ({data, onChange, onSubmit, error, ...inputFieldParams}) => {
    const inputId = useId();
    const dialogRef = useRef();

    return (
        <React.Fragment>
            <Autocomplete
                value={data.value}
                onChange={(event, newValue) => {
                    error && error.disable(data.name);
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {dialogRef.current.openWithValue(newValue)});
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
                            label: `Добавить "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id={inputId}
                options={data.options}
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
                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                freeSolo
                renderInput={(params) => <TextField
                    {...params}
                    {...inputFieldParams}
                    label={data.label}
                    error={error}
                    helperText={getHelperText(error)} />}
            />
            <DovecoteEditDialog ref={dialogRef} onChange={onChange} onSubmit={[onSubmit]}/>
        </React.Fragment>
    );
};

export default InputDovecoteAutocompleteCreatable;
