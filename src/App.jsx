import {createBrowserRouter, Outlet, RouterProvider, useLocation} from 'react-router-dom';
import AppHeader from "./AppHeader";
import './App.css'
import AppError from "./AppError";
import HomePage from "./HomePage";
import ErrorPage from "./ErrorPage";
import LoginPage from "./LoginPage";
import React from "react";

let router = null;
function getRouter() {
    if (router) {
        return router;
    }
    router = createBrowserRouter([
        {
            path: "/",
            element: <AppInner/>,
            errorElement: <AppError />,
            children: [
                {
                    path: "/",
                    element: <HomePage/>,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/login",
                    element: <LoginPage/>,
                    errorElement: <ErrorPage />,
                }
            ],
        },
    ]);
    return router;
}

export default function App() {
    return <RouterProvider router={getRouter()} />;
}

function AppInner() {
    const location = useLocation();
    return (
        <>
        <AppHeader/>
        <div className="content-wrapper">
            <div className="content">
            <Outlet />
            </div>
        </div>
        <div className="footer is-center">
            @ikeyit
        </div>
        </>
    );
}
