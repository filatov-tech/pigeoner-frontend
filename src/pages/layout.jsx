import React from 'react';
import {Outlet, Navigate} from "react-router-dom";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";

const Layout = () => {
    const isAuthenticated = Boolean(localStorage.getItem("auth_token"));

    return (
        <React.Fragment>
            {isAuthenticated
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