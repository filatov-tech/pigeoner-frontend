import React from 'react';
import {Outlet, Navigate} from "react-router-dom";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";

const Layout = () => {
    const isAuthenticated = () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return false;

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const payload = JSON.parse(window.atob(base64));

        return Date.now() <= payload.exp * 1000;
    }

    return (
        <React.Fragment>
            {isAuthenticated()
                ?
                <React.Fragment>
                    <Header/>
                    <div className="page-body">
                        <Outlet/>
                    </div>
                    <Footer/>
                </React.Fragment>
                :
                <Navigate to="/login" replace={true} />
            }
        </React.Fragment>
    );
};

export default Layout;