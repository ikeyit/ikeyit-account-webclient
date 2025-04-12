import React from "react";
import {useLoaderData, useRouteLoaderData} from "react-router-dom";
import {useTranslation} from "react-i18next";
import LocaleSetting from "./ui/locale-setting.jsx";
import ProfileSetting from "./ui/profile-setting.jsx";
import AvatarSetting from "./ui/avatar-setting.jsx";

export default function GeneralSettingPage() {
    const user = useRouteLoaderData("userProfileSetting");
    const {t} = useTranslation();
    return (
        <div className="space-y-6">
            <title>{t("setting.generalPageTitle")}</title>
            <ProfileSetting
                value={user.displayName}
            />
            <AvatarSetting
                value={user.avatar}
            />
            <LocaleSetting
                value={user.locale}
            />
        </div>
    );
}
