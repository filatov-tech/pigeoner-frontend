import React, {useId} from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const RadioGroupFilter = ({filterData, onChange}) => {
    const radioGroupId = useId();

    const handleChange = (e) => {
        onChange({
            name: filterData.name,
            value: e.target.value
        });
    }

    return (
        <Box sx={{padding: '0px 12px'}}><FormControl>
            <FormLabel id={radioGroupId}>{filterData.label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={radioGroupId}
                name="radio-buttons-group"
                onChange={handleChange}
            >
                {filterData.options.map(option =>
                    <FormControlLabel value={option.value} control={<Radio size="small"/>} label={option.label}/>
                )}
            </RadioGroup>
        </FormControl></Box>
    );
};

export default RadioGroupFilter;