import React from "react";
import "./AppHeader.css"
import Dropdown from "./ui/Dropdown.jsx";
import {Link} from "react-router-dom";
import {useSession} from "./ui/Session.jsx";

export default function AppHeader() {
    const {user} = useSession();
    return (
        <div className="header">
            <div className="header-left">
                <a className="header-logo" href="/">ikeyit</a>
            </div>
            <div className="header-middle">
            </div>
            <div className="header-right">
                {user?.authenticated && <HeaderMenu/>}
            </div>
        </div>
    );
}

function HeaderMenu() {
    const {user} = useSession();
    return (
        <Dropdown trigger={
            <img src={user.avatar} alt="avatar" crossOrigin="anonymous"
                 style={{
                     height: "2em",
                     width: "auto",
                     display: "inline-block",
                     verticalAlign: "middle",
                     borderRadius: "50%",

                 }}
            />
        }>
            <div className="header-menu-user">Hi, {user.displayName}</div>
            <ul className="header-menu menu-vertical">
                <li>
                    <Link to="/setting">Setting</Link>
                </li>
                <li>
                    <a href="/logout">
                        Sign Out
                    </a>
                </li>
            </ul>
        </Dropdown>
    )
}
