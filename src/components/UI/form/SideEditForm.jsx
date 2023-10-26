import React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from '@mui/joy/Drawer';
import {useMediaQuery} from "react-responsive";

const SideEditForm = (props) => {
    const xl = useMediaQuery({query: "(min-width: 1200px)"});
    let size = xl ? "md" : "lg";
    let paddingX = xl ? "20px" : "5px";
    return (
        <Drawer anchor="right" size={size} open={props.open} onClose={props.onClose}>
            <Box sx={{padding: `20px ${paddingX}`}}>
                <Container>
                    {props.children}
                </Container>
            </Box>
        </Drawer>
    );
};

export default SideEditForm;