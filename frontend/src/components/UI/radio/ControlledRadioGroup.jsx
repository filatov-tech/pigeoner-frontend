import React, {useId} from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const ControlledRadioGroup = ({data, onChange}) => {
    const radioGroupId = useId();

    return (
        <Box>
            <FormControl>
                <FormLabel id={radioGroupId}>{data.label}</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby={radioGroupId}
                    name={data.name}
                    value={data.value}
                    onChange={() => onChange()}
                >
                    {data.options.map(option =>
                        <FormControlLabel value={option.value} control={<Radio size="small"/>} label={option.label}/>
                    )}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default ControlledRadioGroup;