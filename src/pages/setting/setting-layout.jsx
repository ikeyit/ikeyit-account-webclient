import React from "react";
import {Outlet} from "react-router-dom";
import SettingSidebar from "@/pages/setting/ui/setting-sidebar.jsx";
import AppHeader from "@/layouts/app-header.jsx";
import {useTranslation} from "react-i18next";

export default function SettingLayout() {
    const {t} = useTranslation();
    return (
        <>
            <AppHeader/>
            <title>{t("setting.pageTitle")}</title>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingSidebar/>
                </aside>
                <div className="flex-1 p-6 lg:max-w-2xl">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}