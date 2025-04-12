import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {CircleUser} from "lucide-react";
import React from "react";
import {Link} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {useSession} from "@/components/session.jsx";
import {useTranslation} from "react-i18next";

export default function AccountMenu() {
    const {t } = useTranslation();
    const {session:{user}} = useSession();
    if (user?.authenticated) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} className="rounded-xl" alt={user.displayName} referrerPolicy="no-referrer"/>
                        <AvatarFallback className="bg-primary/10 text-primary font-medium rounded-xl">
                            {user.displayName?.substring(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild><Link to="/setting">{t("accountMenu.setting")}</Link></DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild><a href="/auth/logout">{t("accountMenu.logout")}</a></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}