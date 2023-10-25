import React, {useState, useEffect} from 'react';
import Box from "@mui/material/Box";
import {Button, Card, Container, Stack, Typography} from "@mui/joy";
import {Link} from "@mui/joy";
import logo from "../images/pigeoner_logo_white.svg"
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {LOGIN_URL} from "../constants";
import ErrorSnackbar from "../components/UI/ErrorSnackbar";

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
        color: "rgba(255,255,255,0.6)"
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "rgba(255,255,255,0.6)",
    },
    "& .MuiInput-root.Mui-error": {
        color: "rgba(255,182,161,0.8)",
        "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottomColor: "rgba(255,182,161,0.7)",
        }
    },
    "& .MuiInput-root.Mui-error:before": {
        borderBottomColor: "rgba(255,182,161,0.5)",
    },
    "& .MuiInput-root.Mui-error:after": {
        borderBottomColor: "rgba(255,182,161,0.7)",
    },
    "& .MuiInputLabel-root.Mui-error": {
        color: "rgba(255,182,161,0.7)",
    },
    "& .MuiInputLabel-root.Mui-error.Mui-focused": {
        color: "rgb(255,182,161)",
    },
})

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [error, setError] = useState();

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
                navigate("/pigeons");
            } else {
                const apiError = await response.json();
                setError(apiError);
            }
        } catch (e) {
            setError({message: "Проверьте правильность ввода эл. почты и/или пароля"});
            throw new Error("Ошибка при попытке войти в систему", e);
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [error]);

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
                        <Link component={RouterLink} to="/">
                            <img src={logo} alt="Pigeoner white logo" width="100%" style={{marginBottom: 24}}/>
                        </Link>
                        <WhiteTextField
                            value={formData.email}
                            onChange={(event) => setFormData({...formData, email: event.target.value})}
                            error={!!error}
                            variant="standard"
                            id="email"
                            type="email"
                            label="Эл. почта"
                        />
                        <WhiteTextField
                            value={formData.password}
                            onChange={(event) => setFormData({...formData, password: event.target.value})}
                            error={!!error}
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
                            <Link component={RouterLink} to="/register">
                                <Typography level="body-sm" sx={{color: "rgba(255,255,255,0.6)"}}>
                                    Регистрация
                                </Typography>
                            </Link>
                            <Typography level="body-sm" sx={{color: "rgba(255,255,255,0.6)"}}>
                                Забыли пароль?
                            </Typography>
                        </Stack>
                    </Stack>
                </Card>
                {error && <ErrorSnackbar
                    message={error.message}
                    anchorOrigin={{horizontal: "left", vertical: "bottom"}}
                    sx={{zIndex: 1400}}
                />}
            </Container>
        </Box>
    );
};

export default Login;