import React, {useId, useRef, useState, useEffect} from 'react';
import {Autocomplete} from "@mui/material";
import {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {getHelperText} from "../../../../util/utils";
import LaunchPointEditDialog from "../../form/dialog/LaunchPointEditDialog";
import {makeOptions} from "../../../../pages/pigeons";
import {Stack} from "@mui/joy";
import {Add, DeleteOutline, Edit} from "@mui/icons-material";
import {LAUNCH_POINTS_URL} from "../../../../constants";

const filter = createFilterOptions();

const InputLaunchPointAutocompleteCreatable = ({data, onChange, error, showError, onLoad, ...textFieldParams}) => {
    const inputId = useId();
    const dialogRef = useRef();

    const [apiError, setApiError] = useState(null);

    const [launchPointOptions, setLaunchPointOptions] = useState([]);

    const fetchLaunchPoints = async () => {
        try {
            const response = await fetch(LAUNCH_POINTS_URL);
            if (response.ok) {
                const launchPoints = await response.json();
                launchPoints.push({name: "Добавить новую точку", newLaunchPointTrigger: true});
                setLaunchPointOptions(makeOptions(launchPoints));
                onLoad(true);
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке точек вылета", e);
        }
    }

    const handleEdit = (launchPoint) => {
        dialogRef.current.openInEditMode(launchPoint);
    }

    const handleDelete = async (launchPointId) => {
        if (!launchPointId) {
            throw new Error("Ошибка при удалении точки вылета - ID не определен")
        }
        try {
            const response = await fetch(`${LAUNCH_POINTS_URL}/${launchPointId}`, {
                method: "DELETE"
            })
            if (response.ok) {
                fetchLaunchPoints();
                onChange(null);
            } else {
                const apiError = await response.json();
                setApiError(apiError);
                showError(apiError);
            }
        } catch (e) {
            throw new Error("Ошибка при удалении точки вылета")
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setApiError(null);
        }, 4000);
        return () => clearTimeout(timer);
    }, [apiError]);
    
    useEffect(() => {
        fetchLaunchPoints();
    }, []);

    return (
        <React.Fragment>
            <Autocomplete
                value={data.value}
                onChange={(event, newValue) => {
                    apiError && apiError.disable(data.name);
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            dialogRef.current.openWithValue(newValue);
                        });
                    } else if (newValue && newValue.inputValue) {
                        dialogRef.current.openWithValue(newValue.inputValue);
                    } else if (newValue && newValue.newLaunchPointTrigger) {
                        dialogRef.current.openWithValue();
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
                options={launchPointOptions}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return `${option.name}, ${option.distance} км`;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) =>
                    <li {...props} style={{justifyContent: "space-between"}}>
                        {option.newLaunchPointTrigger && <Add sx={{marginRight: "8px"}} />}
                        <div style={{marginRight: "auto"}}>{option.label}{option.distance && `, ${option.distance} км`}</div>
                        {!!option.distance && <div>
                            <Stack direction="row-reverse" spacing={1}>
                                <DeleteOutline hid onClick={() => handleDelete(option.id)} fontSize="small" sx={{color: "rgba(0,0,0,0.4)"}}/>
                                <Edit onClick={() => handleEdit(option)} fontSize="small" sx={{color: "rgba(0,0,0,0.4)"}}/>
                            </Stack>
                        </div>}
                    </li>
                }
                freeSolo
                renderInput={(params) =>
                    <TextField
                        {...params}
                        {...textFieldParams}
                        error={apiError}
                        helperText={getHelperText(error)}
                        label={data.label}
                    />
                }
            />
            <LaunchPointEditDialog ref={dialogRef} onChange={onChange} onSubmit={[fetchLaunchPoints]}/>
        </React.Fragment>
    );
};

export default InputLaunchPointAutocompleteCreatable;