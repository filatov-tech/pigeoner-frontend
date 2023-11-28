import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {LOGIN_URL} from "../constants";
import Container from "@mui/material/Container";
import {LinearProgress} from "@mui/joy";

const LoginDemo = () => {
    const navigate = useNavigate();

    useEffect(() => {
        loginWithPredefinedCredentials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const loginWithPredefinedCredentials = async () => {
        const credentials = {email: "demo@pigeoner.ru", password: "123456"};
        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("auth_token", data.token);
                navigate("/pigeons");
            }
        } catch (e) {
            console.error('Ошибка автоматического логина', e);
        }
    }

    return (
        <Container>
            <LinearProgress />
        </Container>
    );
};

export default LoginDemo;