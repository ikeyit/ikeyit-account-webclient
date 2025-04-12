import React, {useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import '@/index.css'
import '@/lib/i18n';
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import RootLayout from "@/layouts/root-layout.jsx";
import RouteError from "@/components/route-error.jsx";
import LoginPage from "@/pages/login-page.jsx";
import {settingRoutes} from "@/pages/setting/setting-routes.jsx";
import {SessionProvider, useSession} from "@/components/session.jsx";
import {getOidcProviders} from "@/lib/data-api.js";
import SignupPage from "@/pages/signup-page.jsx";

function createProtectedRoutes(protectedLoader, routes) {
    return routes.map(route => ({
        ...route,
        loader: route.loader && protectedLoader(route.loader),
        children: route.children && createProtectedRoutes(protectedLoader, route.children),
    }))
}

function createRoutes(user) {
    function protectedLoader(loader) {
        return user?.authenticated ? loader : null;
    }
    return [
        {
            element: <RootLayout/>,
            errorElement: <RouteError/>,
            children:[
                {
                    path: "/login",
                    loader: getOidcProviders,
                    element: <LoginPage/>,
                    errorElement: <RouteError/>,
                },
                {
                    path: "/signup",
                    element: <SignupPage/>,
                    errorElement: <RouteError/>,
                },
                {
                    element: user?.authenticated ? <Outlet/> : <Navigate to={`/login?${new URLSearchParams({"redirect": location.pathname})}`}/>,
                    errorElement: <RouteError/>,
                    children: createProtectedRoutes(protectedLoader,[
                        {
                            path: "/",
                            element: <Navigate to="/setting/general" replace/>
                        },
                        ...settingRoutes
                    ])
                },
            ]
        },
    ]
}

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <SessionProvider><RouterWrapper/></SessionProvider>
    // </StrictMode>,
)

function RouterWrapper() {
    const [router, setRouter] = useState(null);
    const {session: {user}} = useSession();
    useEffect(() => {
        setRouter(createBrowserRouter(createRoutes(user)))
    }, [user]);
    return router && <RouterProvider router={router}/>
}