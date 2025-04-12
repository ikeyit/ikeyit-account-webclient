import React, {useMemo} from "react";
import {NavLink} from "react-router-dom";
import {buttonVariants} from "@/components/ui/button.jsx";
import {cn} from "@/lib/utils.js";
import {useTranslation} from "react-i18next";

const items = [
    {
        title: "setting.generalNav",
        href: "general",
    },
    {
        title: "setting.securityNav",
        href: "security",
    }
]

export default function SettingSidebar() {
    const {t} = useTranslation();
    const navItems = useMemo(() => items.map(item => ({...item, title: t(item.title)})), [t]);
    return (
        <nav className="flex space-x-2 p-6 lg:flex-col lg:space-x-0 lg:space-y-1">
            {navItems.map((item) => (
                <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive, isPending }) =>
                        cn(buttonVariants({variant: "ghost"}), "justify-start", isActive ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline")
                    }
                >
                    {item.title}
                </NavLink>
            ))}
        </nav>
    )
}