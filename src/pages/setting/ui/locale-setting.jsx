import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useTask} from "@/hooks/use-task.js";
import {updateUserLocale} from "@/lib/data-api.js";
import InlineError from "@/components/inline-error.jsx";
import {Label} from "@radix-ui/react-label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import { toast } from "sonner"

const languages = [
    {value: "en", label: 'English'},
    {value: "zh-CN", label: '简体中文'},
    {value: "zh-TW", label: '繁体中文'},
];

// TODO: use defer value when an error occurs
export default function LocaleSetting({value, ...props}) {
    const {t, i18n} = useTranslation();
    const [locale, setLocale] = useState(value);
    const saveTask = useTask({
        loader: updateUserLocale,
        onSuccess: (result, params) => {
            i18n.changeLanguage(params.locale);
            toast(t("saved"))
        }
    });

    function onChange(locale) {
        // TODO use defer value when an error occurs
        setLocale(locale);
        saveTask.execute({locale});
    }

    return (
        <div className="space-y-3" {...props}>
            <Label>{t("setting.languageLabel")}</Label>
            <div className="text-xs text-gray-800">
                {t("setting.languageDesc")}
            </div>
            <Select value={locale} onValueChange={onChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {languages.map(item => (
                        <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InlineError error={saveTask.error}/>
        </div>
    );
}
