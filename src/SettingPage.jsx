import React from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import './SettingPage.css'


export default function SettingPage() {
    const location = useLocation();
    const getClass = path => location.pathname === path ? "menu-selected" : "";
    return (
        <div className="setting-page">
            <div className="setting-sidebar">
                <ul className="menu-vertical">
                    <li className={getClass("/setting")}>
                        <Link to="/setting">Profile</Link>
                    </li>
                    <li className={getClass("/setting/security")}>
                        <Link to="/setting/security">Security</Link>
                    </li>
                </ul>
            </div>
            <div className="setting-content">
                <Outlet/>
            </div>
        </div>
    )
}