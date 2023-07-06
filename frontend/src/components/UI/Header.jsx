import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import logo from '../../images/pigeoner_logo.svg';
import {Link, NavLink} from "react-router-dom";

const Header = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container">
                    <Link to={"/"}>
                        <img src={logo} alt="Pigeoner logo"/>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav nav-underline">
                            <li className="nav-item">
                                <NavLink to={"/"} className="nav-link">Главная</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/pigeons"} className="nav-link">Голуби</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/flights"} className="nav-link">Полеты</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/dovecote"} className="nav-link">Голубятня</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/feeding"} className="nav-link">Питание</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;