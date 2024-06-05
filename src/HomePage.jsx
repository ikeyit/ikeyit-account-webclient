import React from "react";
import {useDocumentTitle} from "./helper.js";

export default function HomePage() {
    useDocumentTitle("Welcome to IKEYIT");
    return (
        <p>Let's roll up!</p>
    );
}
