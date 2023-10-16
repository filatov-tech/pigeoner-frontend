import React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from '@mui/joy/Drawer';

const SideEditForm = (props) => {
    return (
        <Drawer anchor="right" size="md" open={props.open} onClose={props.onClose}>
            <Box sx={{padding:30+"px"}}>
                <Container>
                    {props.children}
                </Container>
            </Box>
        </Drawer>
    );
};

export default SideEditForm;