import React from 'react';
import logoWhite from "../../images/pigeoner_logo_white.svg";

const Footer = () => {
    return (
        <footer className="pigeoner-footer">
            <img src={logoWhite} alt="Pigeoner Logo white"/>
            <p>Разработка <a href={"http://filatov.tech/"}>filatov.tech</a></p>
        </footer>
    );
};

export default Footer;