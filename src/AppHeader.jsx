import React, {useEffect, useRef, useState} from "react";
import {authUser} from "./helper.js";
import "./AppHeader.css"

export default function AppHeader() {
    const user = authUser();
    return (
        <div className="header">
            <div className="header-left">
                <a className="header-logo" href="/">ikeyit</a>
            </div>
            <div className="header-middle">
            </div>
            <div className="header-right">
                {user && user.authenticated && <HeaderMenu/>}
            </div>
        </div>
    );
}


function HeaderMenu({ onItemSelect }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const user = authUser();
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="header-item" ref={menuRef}>
            <div onClick={() => setMenuOpen(!menuOpen)} className="header-menu-trigger">
                <img src={user.avatar} alt="avatar" crossOrigin="anonymous"
                     style={{
                         height: "2em",
                         width: "auto",
                         display: "inline-block",
                         verticalAlign: "middle",
                         borderRadius: "50%",

                     }}
                />
                {menuOpen && <PopupMenu onItemSelect={() => setMenuOpen(false)} />}
            </div>

        </div>
    );
}

function PopupMenu({onItemSelect}) {
    const user = authUser();
    return (
        <div className="header-menu pure-menu">
            <a href="#" className="pure-menu-heading pure-menu-link">{user.displayName}</a>
            <ul className="pure-menu-list">
                <li className="pure-menu-item">
                    <a href="#" className="pure-menu-link" onClick={onItemSelect}>Setting</a>
                </li>
                <li className="pure-menu-item">
                    <a href="/logout" className="pure-menu-link" onClick={onItemSelect}>
                        Sign Out
                    </a>
                </li>
            </ul>
        </div>
    )
}