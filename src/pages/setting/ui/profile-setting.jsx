import React, {useEffect, useState} from "react";
import {useTask} from "@/hooks/use-task.js";
import {updateUserProfile} from "@/lib/data-api.js";
import InlineError from "@/components/inline-error.jsx";
import {useTranslation} from "react-i18next";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import { toast } from "sonner"
import {useSession} from "@/components/session.jsx";

export default function ProfileSetting({value, ...props}) {
    const {t} = useTranslation();
    const [displayName, setDisplayName] = useState(value);
    const [prevDisplayName, setPrevDisplayName] = useState(value);
    const {updateSession} = useSession();
    const {isPending, execute, result, error, reset} = useTask({
        loader: updateUserProfile,
        onSuccess: () => {
            toast(t("saved"));
            updateSession();
        }
    });
    useEffect(() => {
        setDisplayName(value);
        setPrevDisplayName(value)
    }, [value]);

    function handleBlur() {
        if (prevDisplayName !== displayName) {
            setPrevDisplayName(displayName);
            execute({displayName});
        }
    }

    function handleFocus() {
        setPrevDisplayName(displayName);
    }

    return (
        <div className="space-y-3" {...props}>
            <Label htmlFor="displayName">{t("setting.displayNameLabel")}</Label>
            <div className="text-xs text-gray-800">
                {t("setting.displayNameDesc")}
            </div>
            <Input
                id="displayName"
                disabled={isPending}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            <InlineError error={error}/>
        </div>
    );
}
