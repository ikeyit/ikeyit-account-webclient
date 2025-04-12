import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {updateUserAvatar} from "@/lib/data-api.js";
import ImageInput from "@/components/image-input.jsx";
import {Label} from "@/components/ui/label.jsx";
import { toast } from "sonner"
import {useSession} from "@/components/session.jsx";

export default function AvatarSetting({value, ...props}) {
    const {t, i18n} = useTranslation();
    const [avatar, setAvatar] = useState(value);
    const {updateSession} = useSession();
    function onChange(value) {
        setAvatar(value);
        toast(t("saved"))
        updateSession();
    }

    return (
        <div className="space-y-3" {...props}>
            <Label>{t("setting.avatar")}</Label>
            <div className="text-xs text-gray-800">
                {t("setting.avatarDesc")}
            </div>
            <ImageInput
                value={avatar}
                onChange={onChange}
                uploader={updateUserAvatar}
                disableRemove={true}
            />
        </div>
    );
}
