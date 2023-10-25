import React, {useState} from "react";
import Box from "@mui/material/Box";
import {Button, Card, Container, Link, Stack, Typography} from "@mui/joy";
import logo from "../images/pigeoner_logo_white.svg";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {getHelperText} from "../util/utils";
import {AUTH_TOKEN, REGISTER_URL} from "../constants";

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
        color: "rgba(255,0,0,0.8)",
        "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottomColor: "rgba(255,0,0,0.7)",
        }
    },
    "& .MuiInput-root.Mui-error:before": {
        borderBottomColor: "rgba(255,0,0,0.5)",
    },
    "& .MuiInput-root.Mui-error:after": {
        borderBottomColor: "rgba(255,0,0,0.7)",
    },
    "& .MuiInputLabel-root.Mui-error": {
        color: "rgba(255,0,0,0.7)",
    },
    "& .MuiInputLabel-root.Mui-error.Mui-focused": {
        color: "rgb(211,47,47)",
    },
})

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});

    const [errorKeeperName, setErrorKeeperName] = useState();
    const [errorEmail, setErrorEmail] = useState();
    const [errorPassword, setErrorPassword] = useState();
    const [errorConfirmPassword, setErrorConfirmPassword] = useState();
    
    const register = async () => {
        if (!checkPasswordMatching()) return;

        try {
            const response = await fetch(REGISTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                cleanErrors();
                const data = await response.json();
                localStorage.setItem(AUTH_TOKEN, data.token);
                navigate("/pigeons");
            } else {
                const apiError = await response.json();
                const fieldsWithError = apiError.fields;
                if (fieldsWithError) {
                    setErrorKeeperName(fieldsWithError.keeperName);
                    setErrorEmail(fieldsWithError.email);
                    setErrorPassword(fieldsWithError.password);
                }
            }
        } catch (e) {
            throw new Error("Ошибка при попытке регистрации нового пользователя", e);
        }
    }
    
    const checkPasswordMatching = () => {
        if (formData.password !== formData.confirmPassword) {
            setErrorConfirmPassword({message: "Пароли не совпадают"})
            return false;
        }
        return true;
    }

    const cleanErrors = () => {
        setErrorKeeperName(null);
        setErrorEmail(null);
        setErrorPassword(null);
        setErrorConfirmPassword(null);
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
                    <Stack justifyContent="center" spacing={1}>
                        <Link component={RouterLink} to="/">
                            <img src={logo} alt="Pigeoner white logo" width="100%" style={{marginBottom: 24}}/>
                        </Link>
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
                        <WhiteTextField
                            value={formData.keeperName}
                            onChange={(event) => {
                                setFormData({...formData, keeperName: event.target.value});
                                setErrorKeeperName(null);
                            }}
                            error={!!errorKeeperName}
                            required
                            variant="standard"
                            id="keeper"
                            type="text"
                            label="Владелец голубятни"
                            placeholder="Фамилия И.О."
                            helperText={getHelperText(errorKeeperName)}
                        />
                        <WhiteTextField
                            value={formData.email}
                            onChange={(event) => {
                                setFormData({...formData, email: event.target.value});
                                setErrorEmail(null);
                            }}
                            error={!!errorEmail}
                            required
                            variant="standard"
                            id="email"
                            type="email"
                            label="Эл. почта"
                            helperText={getHelperText(errorEmail)}
                        />
                        <WhiteTextField
                            value={formData.password}
                            onChange={(event) => {
                                setFormData({...formData, password: event.target.value});
                                setErrorPassword(null);
                            }}
                            error={!!errorPassword}
                            required
                            variant="standard"
                            id="password"
                            type="password"
                            label="Пароль"
                            helperText={getHelperText(errorPassword)}
                        />
                        <WhiteTextField
                            value={formData.confirmPassword}
                            onChange={(event) => {
                                setFormData({...formData, confirmPassword: event.target.value});
                                setErrorConfirmPassword(null);
                            }}
                            error={!!errorConfirmPassword}
                            required
                            variant="standard"
                            id="confirm-password"
                            type="password"
                            label="Повторите пароль"
                            helperText={getHelperText(errorConfirmPassword)}
                        />
                        <Box sx={{height: "70px", width: "100%", display: "flex", alignItems: "flex-end"}}>
                            <Button
                                onClick={() => register()}
                                variant="soft"
                                size="lg"
                                fullWidth
                            >
                                Зарегестрироваться
                            </Button>
                        </Box>
                        <Stack direction="row" justifyContent="center" alignItems="baseline" >
                            <Link component={RouterLink} to="/login">
                                <Typography level="body-sm" sx={{color: "rgba(255,255,255,0.6)"}}>
                                    У меня есть аккаунт
                                </Typography>
                            </Link>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
};

export default Register;