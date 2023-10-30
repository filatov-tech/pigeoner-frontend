import React, {useState} from 'react';
import logo from '../../images/pigeoner_logo.svg';
import {NavLink, useNavigate} from "react-router-dom";
import {IconButton, Stack} from "@mui/material";
import {Logout, Menu} from "@mui/icons-material";
import Box from "@mui/material/Box";

import {useMediaQuery} from "react-responsive";
import {Container} from "react-bootstrap";
import {List, ListItemButton, ModalClose, Typography} from "@mui/joy";
import Drawer from "@mui/joy/Drawer";

const Header = () => {
    const navigate = useNavigate();
    const md = useMediaQuery({query: "(max-width: 992px)" })
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "80px",
                backgroundColor: "rgba(63,160,255,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <nav className="header-menu">
                <Container>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                        <img
                            src={logo}
                            alt="Pigeoner logo"
                            onClick={() => navigate("/home")}
                        />
                        {md
                            ?
                            <IconButton variant="outlined" color="neutral" onClick={() => setOpenMobileMenu(true)}>
                                <Menu/>
                            </IconButton>
                            :
                            <Stack direction="row" spacing={4}>
                                <NavLink to="/home" className="header-menu-item">
                                    <span className="hover-underline-animation">Главная</span>
                                </NavLink>
                                <NavLink to="/pigeons" className="header-menu-item">
                                    <span className="hover-underline-animation">Голуби</span>
                                </NavLink>
                                <NavLink to="/dovecote" className="header-menu-item">
                                    <span className="hover-underline-animation">Голубятня</span>
                                </NavLink>
                                <NavLink to="/flights" className="header-menu-item">
                                    <span className="hover-underline-animation">Полеты</span>
                                </NavLink>
                                <NavLink to="/feeding" className="header-menu-item">
                                    <span className="hover-underline-animation">Питание</span>
                                </NavLink>
                                <NavLink to={"/login"}>
                                    <IconButton onClick={() => handleLogout()}>
                                        <Logout/>
                                    </IconButton>
                                </NavLink>
                            </Stack>
                        }
                    </Stack>
                </Container>
                <Drawer anchor="right" open={openMobileMenu} onClose={() => setOpenMobileMenu(false)}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "space-between",
                            gap: 0.5,
                            ml: 'auto',
                            mt: 1,
                            mr: 2,
                        }}
                    >
                        <Typography
                            component="label"
                            htmlFor="close-icon"
                            fontSize="sm"
                            fontWeight="lg"
                            sx={{cursor: 'pointer'}}
                        >
                            Закрыть
                        </Typography>
                        <ModalClose id="close-icon" sx={{position: 'initial'}}/>
                    </Box>
                    <List
                        size="lg"
                        className="header-menu"
                        sx={{
                            flex: 'none',
                            fontSize: 'xl',
                            "--List-gap": "16px",
                            '& > div': {justifyContent: 'center'},
                        }}
                    >
                        <ListItemButton onClick={() => setOpenMobileMenu(false)}>
                            <NavLink to="/home" className="header-menu-item">
                                <span className="hover-underline-animation">Главная</span>
                            </NavLink>
                        </ListItemButton>
                        <ListItemButton onClick={() => setOpenMobileMenu(false)}>
                            <NavLink to="/pigeons" className="header-menu-item">
                                <span className="hover-underline-animation">Голуби</span>
                            </NavLink>
                        </ListItemButton>
                        <ListItemButton onClick={() => setOpenMobileMenu(false)}>
                            <NavLink to="/dovecote" className="header-menu-item">
                                <span className="hover-underline-animation">Голубятня</span>
                            </NavLink>
                        </ListItemButton>
                        <ListItemButton onClick={() => setOpenMobileMenu(false)}>
                            <NavLink to="/flights" className="header-menu-item">
                                <span className="hover-underline-animation">Полеты</span>
                            </NavLink>
                        </ListItemButton>
                        <ListItemButton onClick={() => setOpenMobileMenu(false)}>
                            <NavLink to="/feeding" className="header-menu-item">
                                <span className="hover-underline-animation">Питание</span>
                            </NavLink>
                        </ListItemButton>
                        <ListItemButton onClick={() => setOpenMobileMenu(false)}>
                            <NavLink to={"/login"}>
                                <IconButton onClick={() => handleLogout()}>
                                    <Logout/>
                                </IconButton>
                            </NavLink>
                        </ListItemButton>
                    </List>
                </Drawer>
            </nav>
        </Box>
    );
};

export default Header;