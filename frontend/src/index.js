import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import './styles/custom-styles.css'
import './styles/App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Pigeons from "./pages/pigeons";
import Pigeon from "./pages/pigeon";
import Dovecote from "./pages/dovecote";
import ErrorPage from "./pages/error-page";
import Layout from "./pages/layout";
import Flights from "./pages/flights";
import Flight from "./pages/flight";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/pigeons",
                element: <Pigeons/>
            },
            {
                path: "/pigeons/:id",
                element: <Pigeon/>
            },
            {
                path: "/dovecote",
                element: <Dovecote/>
            },
            {
                path: "/flights",
                element: <Flights/>
            },
            {
                path: "/flights/:id",
                element: <Flight/>
            }
        ]
    }
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);
