import React from 'react';
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";
import {Typography} from "@mui/joy";

const InfoUnitContent = (props) => {
    return (
        <Box sx={{flex: "1 1 auto"}}>
            <Paper
                variant="outlined"
                sx={{
                    width: "100%",
                    backgroundColor: "#E3EFFB",
                    borderRadius: "0.375rem",
                    paddingX: 2,
                    paddingY: 1
                }}
            >
                <Typography level="body-md" sx={{textAlign: "center"}}>
                    {props.children}
                </Typography>
            </Paper>
        </Box>
    );
};

export default InfoUnitContent;