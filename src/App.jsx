import {createBrowserRouter, Outlet, redirect, RouterProvider, useLocation} from 'react-router-dom';
import AppHeader from "./AppHeader";
import AppError from "./AppError";
import HomePage from "./HomePage";
import ErrorPage from "./ErrorPage";
import LoginPage from "./LoginPage";
import SettingPage from "./SettingPage";
import React from "react";
import ProfileSetting from "./ProfileSetting.jsx";
import SecuritySetting from "./SecuritySetting.jsx";
import {GlobalMessageProvider} from "./ui/GlobalMessage.jsx";
import {SessionContextProvider} from "./ui/Session.jsx";

function protectedLoader({ request }) {
    if (!_serverData?.user?.authenticated) {
        let params = new URLSearchParams();
        params.set("redirect", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());
    }
    return null;
}

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
                    index: true,
                    element: <HomePage/>,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/login",
                    element: <LoginPage/>,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/setting",
                    element: <SettingPage/>,
                    errorElement: <ErrorPage />,
                    loader: protectedLoader,
                    children: [
                        {
                            index: true,
                            element: <ProfileSetting/>,
                            errorElement: <ErrorPage />
                        },
                        {
                            path: "security",
                            element: <SecuritySetting/>,
                            errorElement: <ErrorPage />
                        }
                    ]
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
    return (
        <SessionContextProvider>
            <GlobalMessageProvider>
                <AppHeader/>
                <div className="content-wrapper">
                    <Outlet />
                </div>
                <div className="footer is-center">
                    @ikeyit
                </div>
            </GlobalMessageProvider>
        </SessionContextProvider>
    );
}
