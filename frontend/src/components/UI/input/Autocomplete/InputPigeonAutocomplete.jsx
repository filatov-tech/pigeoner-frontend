import React, {useId, useState} from 'react';
import { styled, lighten } from '@mui/system';
import {Autocomplete, TextField} from "@mui/material";
import {getHelperText} from "../../../../util/utils";

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: '#337ab7',
    fontSize: "0.8rem",
    backgroundColor: lighten('#337ab7', 0.85)
}));

const GroupItems = styled('ul')({
    padding: 0,
});

const InputPigeonAutocomplete = ({data, onChange, error, disabled, ...textFieldProps}) => {
    const id = useId();
    const [inputValue, setInputValue] = useState("");
    const options = data.options.map(pigeon => {
        if (!pigeon.isOwn) {
            pigeon.address = "Чужие голуби";
        } else if (!pigeon.section) {
            pigeon.address = "Голуби без голубятни";
        } else {
            pigeon.address = pigeon.section.fullAddress;
        }
        return pigeon;
    })

    return (
        <Autocomplete
            id={id}
            options={options}
            value={data.value}
            onChange={(event, newValue) => {
                error && error.disable(data.name);
                onChange(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, value) => setInputValue(value)}
            groupBy={(pigeon) => pigeon.address}
            getOptionLabel={(pigeon) => {
                const ringNumber = pigeon.ringNumber;
                const name = pigeon.name ? ` (${pigeon.name})` : "";
                return ringNumber + name;
            }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    {...textFieldProps}
                    error={error}
                    helperText={getHelperText(error)}
                    label={data.label} />}
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                </li>
            )}
        />
    );
};

export default InputPigeonAutocomplete;