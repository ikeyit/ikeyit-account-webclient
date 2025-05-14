import React from "react";
import {useLoaderData, useRouteLoaderData} from "react-router-dom";
import {useTranslation} from "react-i18next";
import EmailSetting from "./ui/email-setting.jsx";
import PasswordSetting from "./ui/password-setting.jsx";
import PhoneSetting from "./ui/phone-setting.jsx";

export default function SecuritySettingPage() {
    const user = useRouteLoaderData("userProfileSetting");
    return (
        <div className="space-y-6">
            <EmailSetting
                value={user.email}
            />
            <PhoneSetting
                value={user.phone}
            />
            <PasswordSetting hasPassword={user.hasPassword}/>
        </div>
    );
}