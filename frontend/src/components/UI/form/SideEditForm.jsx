import React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Drawer } from "@mui/material";

const SideEditForm = (props) => {
    return (
        <Drawer anchor="right" open={props.open} onClose={props.onClose}>
            <Box sx={{width: 400,padding:20+"px"}}>
                <Container>
                    {props.children}
                </Container>
            </Box>
        </Drawer>
    );
};

export default SideEditForm;