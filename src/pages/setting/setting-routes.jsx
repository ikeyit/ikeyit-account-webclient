import RouteError from "../../components/route-error.jsx";
import React from "react";
import SettingLayout from "./setting-layout.jsx";
import GeneralSettingPage from "./general-setting-page.jsx";
import SecuritySettingPage from "./security-setting-page.jsx";
import {Navigate} from "react-router-dom";
import {getUserProfile} from "@/lib/data-api.js";

export const settingRoutes =  [
    {
        path: "/setting",
        element: <SettingLayout/>,
        errorElement: <RouteError/>,
        children: [
            {
                index: true,
                element: <Navigate to="general" replace/>,
            },
            {
                loader: getUserProfile,
                id: "userProfileSetting",
                children: [
                    {
                        path: "general",
                        element: <GeneralSettingPage/>,
                        errorElement: <RouteError/>,
                    },
                    {
                        path: "security",
                        element: <SecuritySettingPage/>,
                        errorElement: <RouteError/>,

                    }
                ]
            }
        ]
    }
]