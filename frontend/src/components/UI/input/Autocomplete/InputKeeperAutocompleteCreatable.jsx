import React, {useId, useRef} from 'react';
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import {createFilterOptions} from "@mui/material/Autocomplete";
import KeeperEditDialog from "../../form/dialog/KeeperEditDialog";
import {getHelperText} from "../../../../util/utils";

const filter = createFilterOptions();

const InputKeeperAutocompleteCreatable = ({data, onChange, updateKeepers, error, ...textFieldParams}) => {
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
                    return option.label;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                freeSolo
                renderInput={(params) =>
                    <TextField
                        {...params}
                        {...textFieldParams}
                        error={error}
                        helperText={getHelperText(error)}
                        label={data.label}/>}
            />
            <KeeperEditDialog ref={dialogRef} onChange={onChange} onSubmit={[updateKeepers]} />
        </React.Fragment>
    );
};

export default InputKeeperAutocompleteCreatable;