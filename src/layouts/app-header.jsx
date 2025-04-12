import React from "react";
import LogoIcon from '@/assets/logo-icon.jsx';

import AccountMenu from "@/layouts/account-menu.jsx";

export default function AppHeader() {
    return (
        <header className="flex items-center justify-between p-3 bg-black/5">
            <div className="h-12 flex items-center text-primary text-xl font-bold">
                <LogoIcon className="h-8 w-8 text-primary" />
                IKEYIT Account
            </div>
            <div className="flex items-center">
                <AccountMenu/>
            </div>
        </header>
    );
}