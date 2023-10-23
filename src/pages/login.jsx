import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {Button, Card, Container, Stack, Typography} from "@mui/joy";
import JoyLink from "@mui/joy/Link";
import logo from "../images/pigeoner_logo_white.svg"
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import {Link, useNavigate} from "react-router-dom";
import {LOGIN_URL} from "../constants";


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

const Login = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("auth_token", data.token);
                navigate("/");
            }
        } catch (e) {
            throw new Error("Ошибка при попытке войти в систему", e);
        }
    }

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
                    <Stack justifyContent="center" spacing={2}>
                        <img src={logo} alt="Pigeoner white logo" style={{marginBottom: 24}}/>
                        <WhiteTextField
                            value={formData.email}
                            onChange={(event) => setFormData({...formData, email: event.target.value})}
                            variant="standard"
                            id="email"
                            type="email"
                            label="Эл. почта"
                        />
                        <WhiteTextField
                            value={formData.password}
                            onChange={(event) => setFormData({...formData, password: event.target.value})}
                            variant="standard"
                            id="password"
                            type="password"
                            label="Пароль"
                            sx={{
                                "& .MuiInput-root": {
                                    letterSpacing: "5px"
                                },
                                marginBottom: "24px"
                            }}
                        />
                        <Box sx={{height: "70px", width: "100%", display: "flex", alignItems: "flex-end"}}>
                            <Button
                                onClick={() => login()}
                                variant="soft"
                                size="lg"
                                fullWidth
                            >
                                Войти
                            </Button>
                        </Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" >
                            <Link to="/register">
                                <JoyLink>
                                    <Typography level="body-sm" sx={{color: "rgba(255,255,255,0.6)"}}>
                                        Регистрация
                                    </Typography>
                                </JoyLink>
                            </Link>
                            <Typography level="body-sm" sx={{color: "rgba(255,255,255,0.6)"}}>
                                Забыли пароль?
                            </Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;