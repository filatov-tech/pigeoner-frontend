import React from 'react';
import { Outlet } from "react-router-dom";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";

const Layout = () => {
    return (
        <>
            <Header/>
            <div className="page-body">
                <Outlet/>
            </div>
            <Footer/>
        </>
    );
};

export default Layout;