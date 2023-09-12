import React, {useEffect, useId, useRef, useState} from 'react';
import {addHierarchicalLabelsTo} from "../../../../util/section-options-builder";
import {flatten} from "../../../../util/utils";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DovecoteEditDialog from "../../form/dialog/DovecoteEditDialog";

export const HIERARCHICAL_SECTIONS_URL = "/api/v1/sections/hierarchical";

const filter = createFilterOptions();

const InputDovecoteAutocompleteCreatable = ({data, onChange, ...inputFieldParams}) => {
    const inputId = useId();
    const dialogRef = useRef();

    const [sectionsOptions, setSectionsOptions] = useState([]);

    useEffect(()=> {
        updateSectionsOptions();
    }, []);

    const updateSectionsOptions = () => {
        fetch(HIERARCHICAL_SECTIONS_URL)
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
    }

    return (
        <React.Fragment>
            <Autocomplete
                value={data.value}
                onChange={(event, newValue) => {
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
                options={sectionsOptions}
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
                renderInput={(params) => <TextField {...params} {...inputFieldParams} label={data.label} margin="dense" />}
            />
            <DovecoteEditDialog ref={dialogRef} onChange={onChange} onSubmit={[updateSectionsOptions]}/>
        </React.Fragment>
    );
};

export default InputDovecoteAutocompleteCreatable;
