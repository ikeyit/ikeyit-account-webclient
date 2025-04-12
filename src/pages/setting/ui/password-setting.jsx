import React, {useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {updateUserPassword} from "@/lib/data-api.js";
import InlineError from "@/components/inline-error.jsx";
import {useTranslation} from "react-i18next";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTask} from "@/hooks/use-task.js";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useRevalidator} from "react-router-dom";

let updatePasswordDialogKey = 1;

export default function PasswordSetting({hasPassword, ...props}) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const handleModify = () => {
        updatePasswordDialogKey++;
        setOpen(true);
    };
    return (
        <div className="space-y-3" {...props}>
            <Label>{t("setting.password.passwordLabel")}</Label>
            <div className="text-xs text-gray-800">
                {t("setting.password.passwordDesc")}
            </div>
            <Button onClick={handleModify}>{t("setting.password.modifyButton")}</Button>
            <UpdatePasswordDialog open={open} onOpenChange={setOpen} hasPassword={hasPassword} key={updatePasswordDialogKey}/>
        </div>
    )
}


function UpdatePasswordDialog({open, onOpenChange, hasPassword}) {
    const {t} = useTranslation();
    const { revalidate } = useRevalidator();
    const formResolver = useMemo(() => yupResolver(
        yup.object({
            password: hasPassword ? yup
                .string()
                .required(t('setting.password.validation.oldPasswordRequired')) : yup
                .string()
                .optional(),
            newPassword: yup
                .string()
                .required(t('setting.password.validation.newPasswordRequired')),
            confirmPassword: yup
                .string()
                .required(t('setting.password.validation.confirmPasswordRequired'))
                .oneOf([yup.ref("newPassword")], t('setting.password.validation.passwordNotMatch')),
        })
    ), [t, hasPassword]);
    const form = useForm({
        resolver: formResolver,
        defaultValues: {
            password: "",
            newPassword: "",
            confirmPassword: ""
        }
    });
    const saveTask = useTask({
        loader: updateUserPassword,
        onSuccess: () => {
            onOpenChange?.(false);
            revalidate();
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("setting.password.dialogTitle")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(saveTask.execute)} className="space-y-8">
                        {hasPassword && (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{t("setting.password.oldPasswordLabel")}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={t("setting.password.oldPasswordPlaceholder")} {...field} disabled={saveTask.isPending}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t("setting.password.newPasswordLabel")}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t("setting.password.newPasswordPlaceholder")} {...field} disabled={saveTask.isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t("setting.password.confirmPasswordLabel")}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t("setting.password.confirmPasswordPlaceholder")} {...field} disabled={saveTask.isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <InlineError error={saveTask.error}/>
                        <DialogFooter>
                            <Button disabled={saveTask.isPending} type="submit">
                                {t("setting.password.updateButton")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
