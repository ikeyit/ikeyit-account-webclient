import React, {useEffect, useRef, useState} from "react";
import "./Dropdown.css"

export default function Dropdown({trigger = "Open Menu", children}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={open ? "dropdown dropdown-open" : "dropdown"} ref={ref}>
            <div onClick={() => setOpen(!open)} className="dropdown-trigger">
                {trigger}
            </div>
            <div onClick={() => setOpen(false)} className="dropdown-panel">
                {children}
            </div>
        </div>
    );
}
