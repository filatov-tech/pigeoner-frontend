import React from 'react';
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";

const InfoUnit = (props) => {
    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                spacing={2}
            >
                {props.children}
            </Stack>
        </Box>
    );
};

export default InfoUnit;