import React from 'react';
import {Box, Container, Stack} from "@mui/material";
import skyBackground from "../images/sky-background.jpg";
import {Button, Link, Typography} from "@mui/joy";
import Grid from "@mui/material/Unstable_Grid2";
import {useMediaQuery} from "react-responsive";
import {Link as RouterLink} from "react-router-dom";



const MainPage = () => {
    const xs = useMediaQuery({query: "(max-width: 470px)"});
    return (
        <Box
            component="div"
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100vh',
                backgroundImage: `url(${skyBackground})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Container sx={{mt: `${xs?10:20}vh`}}>

                <Grid container spacing={2}>
                    <Grid md={8}>
                        <Stack spacing={8}>
                            <Typography
                                level="h1"
                                textColor="white"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: `${xs?2.1:3}rem`
                                }}
                            >
                                Учетный сервис для профессиональных заводчиков голубей
                            </Typography>
                            <Typography level="body-lg" textColor="white">
                                Интуитивный инструмент для полного управления информацией о своих питомцах, их тренировках и результатах
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>

                                <Link component={RouterLink} to="/demo">
                                    <Button
                                        sx={{
                                            minHeight: 'var(--Button-minHeight, 4rem)',
                                            fontSize: '1.15rem',
                                            paddingBlock: '0.5rem',
                                            paddingInline: '4rem',
                                            backgroundColor: "#337AB7FF",
                                        }}
                                    >
                                        Попробовать
                                    </Button>
                                </Link>
                                <Link component={RouterLink} to="/login">
                                    <Button
                                        sx={{
                                            minHeight: 'var(--Button-minHeight, 4rem)',
                                            fontSize: '1.15rem',
                                            paddingBlock: '0.5rem',
                                            paddingInline: '4rem'
                                        }}
                                        variant="soft"
                                        color="neutral"
                                    >
                                        Войти
                                    </Button>
                                </Link>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid></Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default MainPage;