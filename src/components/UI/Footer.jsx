import React from 'react';
import logoWhite from "../../images/pigeoner_logo_white.svg";
import {Stack} from "@mui/material";
import {Container} from "react-bootstrap";
import {Link, Typography} from "@mui/joy";

const Footer = () => {
    return (
        <footer className="pigeoner-footer">
            <Container>
                <Stack direction="row" spacing={2} marginY={2} justifyContent="space-between" alignItems="center">
                    <img src={logoWhite} alt="Pigeoner Logo white"/>
                    <Typography sx={{color: "#e7e7e7"}}>
                        Разработка <Link href="https://filatov.tech/" textColor="#A2B3FFFF" underline="none">
                            filatov.tech
                        </Link>
                    </Typography>

                </Stack>
            </Container>
        </footer>
    );
};

export default Footer;