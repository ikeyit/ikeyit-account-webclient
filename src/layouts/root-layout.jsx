import AppHeader from "./app-header.jsx";
import {Outlet} from "react-router-dom";
import React from "react";
import {Toaster} from "@/components/ui/sonner"

export default function RootLayout({children}) {
    return (
        <div className="antialiased">
            <main>
                <Outlet/>
            </main>
            <Toaster />
        </div>
    );
}
