import React from "react";
import {cn} from "@/lib/utils.js";

export default function InlineError({error, message, className}) {
    const msg = error?.errMsg || error?.message || message;
    if (msg) {
        return (
            <p className={cn("text-xs font-medium text-destructive", className)}>
                {msg}
            </p>
        )
    }
}
