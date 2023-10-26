import React from 'react';
import logoWhite from "../../images/pigeoner_logo_white.svg";
import Container from "@mui/material/Container";
import {Stack} from "@mui/material";

const Footer = () => {
    return (
        <footer className="pigeoner-footer">
            <Container>
                <Stack direction="row" spacing={2} marginY={2} alignItems="center">
                    <img src={logoWhite} alt="Pigeoner Logo white"/>
                    <p>Разработка <a href={"http://filatov.tech/"}>filatov.tech</a></p>
                </Stack>
            </Container>


        </footer>
    );
};

export default Footer;