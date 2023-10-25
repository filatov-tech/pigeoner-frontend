import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {LocalizationProvider, ruRU} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from 'dayjs/plugin/timezone';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import './styles/App.css'
import './styles/custom-styles.css'

import Pigeons from "./pages/pigeons";
import Pigeon from "./pages/pigeon";
import Dovecote from "./pages/dovecote";
import ErrorPage from "./pages/error-page";
import Layout from "./pages/layout";
import Flights from "./pages/flights";
import Flight from "./pages/flight";
import Feeding from "./pages/feeding";
import Login from "./pages/login";
import Register from "./pages/register";
import MainPage from "./pages/MainPage";
import Home from "./pages/home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        errorElement: <ErrorPage/>
    },
    {
        path: "/",
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/home",
                element: <Home/>

            },
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
            },
            {
                path: "/feeding",
                element: <Feeding/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>,
        errorElement: <ErrorPage/>
    },
    {
        path: "/register",
        element: <Register/>,
        errorElement: <ErrorPage/>
    }
])




const root = ReactDOM.createRoot(document.getElementById('root'));
const russianLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
dayjs.extend(utc);
dayjs.extend(timezone);
root.render(
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={russianLocale}>
        <RouterProvider router={router}/>
    </LocalizationProvider>
);
