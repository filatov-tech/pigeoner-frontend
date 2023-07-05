import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import logo from '../../images/pigeoner_logo.svg';

const Header = () => {
    return (
        <div>
            <Navbar bg={"light"} variant={"light"}>
                <Container>
                    <Navbar.Brand href={"/home"}>
                        <img src={logo} alt="Pigeoner logo"/>
                    </Navbar.Brand>
                    <Nav className={"justify-content-end"} style={{fontSize: 1.5 + "rem"}}>
                        <Nav.Link href={"/pigeons"}>Голуби</Nav.Link>
                        <Nav.Link href={"/flights"}>Полеты</Nav.Link>
                        <Nav.Link href={"/dovecote"}>Голубятня</Nav.Link>
                        <Nav.Link href={"/diet"}>Питание</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;