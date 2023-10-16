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
            },
            {
                path: "/feeding",
                element: <Feeding/>
            }
        ]
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