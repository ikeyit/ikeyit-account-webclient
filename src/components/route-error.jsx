import React from "react";
import {useRouteError} from "react-router-dom";
import {cn} from "@/lib/utils.js";
import {useTranslation} from "react-i18next";

export default function RouteError({className}) {
    const {t} = useTranslation();
    const error = useRouteError();
    return (
        <p className={cn("text-xs font-medium text-destructive", className)}>
            {error.errMsg || error.message || t("error.unknown")}
        </p>
    )
}
