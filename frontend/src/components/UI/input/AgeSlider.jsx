import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import {createTheme, ThemeProvider} from "@mui/material";

const yearLabels = [
    "0 лет",
    "1 год",
    "2 года",
    "3 года",
    "4 года",
    "5 лет",
    "6 лет",
    "7 лет",
    "8 лет",
    "9 лет"
];

const monthLabels = [
    "0 м.",
    "1 м.",
    "2 м.",
    "3 м.",
    "4 м.",
    "5 м.",
    "6 м.",
    "7 м.",
    "8 м.",
    "9 м.",
    "10 м.",
    "11 м."
];

function valueLabelFormat(age) {
    if (age[0] === 0 && age[1] === 0 && age[2] === 9 && age[3] === 11) return "Любой возраст"
    return `${age[0] === 0 ? '' : yearLabels[age[0]]} ${monthLabels[age[1]]} `
        +`— ${age[2] === 0 ? '' : yearLabels[age[2]]} ${monthLabels[age[3]]}`;
}

function convertToAge(value) {
    const startAgeInMonths = value[0];
    const endAgeInMonths = value[1];
    const ageYearFrom = Math.floor(startAgeInMonths / 12);
    const ageMonthFrom = startAgeInMonths % 12;
    const ageYearTo = Math.floor(endAgeInMonths / 12);
    const ageMonthTo = endAgeInMonths % 12;
    return [ageYearFrom, ageMonthFrom, ageYearTo, ageMonthTo];
}

function convertToValue(age) {
    const ageYearFrom = age[0];
    const ageMonthFrom = age[1];
    const ageYearTo = age[2];
    const ageMonthTo = age[3];
    const startAgeInMonths = ageYearFrom * 12 + ageMonthFrom;
    const endAgeInMonths = ageYearTo * 12 + ageMonthTo;
    return [startAgeInMonths, endAgeInMonths];
}

const AgeSlider = ({filterData, onChange}) => {
    const handleChange = (event, newValue) => {
        const ageRange = convertToAge(newValue);
        onChange([
            {name: "ageYearFrom", value: ageRange[0]},
            {name: "ageMonthFrom", value: ageRange[1]},
            {name: "ageYearTo", value: ageRange[2]},
            {name: "ageMonthTo", value: ageRange[3]}
        ])
    };

    const theme = createTheme({
        components: {
            MuiSlider: {
                styleOverrides: {
                    root: {
                        '& .MuiSlider-thumb': {
                            height: 24,
                            width: 24,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                boxShadow: 'inherit',
                            },
                        }
                    }
                }
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        lineHeight: 1
                    }
                }
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{width: '100%', padding: '0px 22px'}}>
                <Typography align="center">
                    {valueLabelFormat(filterData.value)}
                </Typography>
                <Slider
                    value={convertToValue(filterData.value)}
                    min={0}
                    step={1}
                    max={119}
                    onChange={handleChange}
                />
            </Box>
        </ThemeProvider>
    );
};

export default AgeSlider;