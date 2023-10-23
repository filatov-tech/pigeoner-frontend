import React from 'react';
import {useState} from "react";
import Box from "@mui/material/Box";
import {Card, Container, Stack, Typography} from "@mui/joy";
import logo from "../images/pigeoner_logo_white.svg";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const WhiteTextField = styled(TextField)({
    "& .MuiInput-root": {
        letterSpacing: "1px",
        color: "rgba(255,255,255,0.8)",
        fontSize: 20,
        "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottomColor: "rgba(255,255,255,0.7)",
        }
    },
    "& .MuiInput-root:before": {
        borderBottomColor: "rgba(255,255,255,0.5)",

    },
    "& .MuiInput-root:after": {
        borderBottomColor: "rgba(255,255,255,0.5)",
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.6)",
        "& .Mui-focused": {
            color: "rgba(255,255,255,0.6)",
        }
    },
})

const Register = () => {
    const [formData, setFormData] = useState({});



    return (
        <Box sx={{
            height: "100vh",
            background: "linear-gradient(180deg, rgba(142, 194, 229, 1), rgba(51, 114, 163, 1))"
        }}>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                }}
            >
                <Card
                    variant="plain"
                    sx={{
                        width: "350px",
                        padding: "3rem",
                        backgroundColor: "rgba(255,255,255,0.15)"
                    }}
                >
                    <Stack justifyContent="center" spacing={3}>
                        <img src={logo} alt="Pigeoner white logo"/>
                        <Typography
                            level="h1"
                            fontWeight="sm"
                            sx={{
                                color: "rgba(255,255,255,0.78)",
                                textAlign: "center",
                                fontSize: "2rem",
                            }}
                        >
                            Регистрация
                        </Typography>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
};

export default Register;