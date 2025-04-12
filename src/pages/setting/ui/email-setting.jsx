import React, {useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog.jsx"

import {useForm} from "react-hook-form";
import {updateUserEmail, verifyUserEmail} from "@/lib/data-api.js";
import InlineError from "@/components/inline-error.jsx";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.jsx";
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";
import {useTask} from "@/hooks/use-task.js";
import {useCountdown} from "@/hooks/use-countdown.js";
import {cn} from "@/lib/utils.js";
import { useRevalidator } from 'react-router-dom';
let updateEmailDialogKey = 1;
export default function EmailSetting({value, ...props}) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const handleModify = () => {
        updateEmailDialogKey++;
        setOpen(true);
    };
    return (
        <div className="space-y-3" {...props}>
            <Label>{t("setting.email.emailLabel")}</Label>
            <div className="text-xs text-gray-800">
                {value ? t("setting.email.emailDesc", {email: value}) : t("setting.email.emailDescEmpty")}
            </div>
            <Button onClick={handleModify}>{t("setting.email.modifyButton")}</Button>
            <UpdateEmailDialog open={open} onOpenChange={setOpen} key={updateEmailDialogKey}/>
        </div>
    )
}

function UpdateEmailDialog({open, onOpenChange}) {
    const {t} = useTranslation();
    const { revalidate } = useRevalidator();
    const [step, setStep] = useState(1);
    const step1Resolver = useMemo(() =>
            yupResolver(yup.object({
                email: yup
                    .string()
                    .required(t('setting.email.validation.emailRequired'))
                    .email(t('setting.email.validation.invalidEmail')),
            })),
        [t]);
    const step1Form = useForm({resolver: step1Resolver});
    const step2Resolver = useMemo(() =>
            yupResolver(yup.object({
                code: yup
                    .string()
                    .required(t('setting.email.validation.codeRequired'))
            })),
        [t]);
    const step2Form = useForm({resolver: step2Resolver});
    const countdown = useCountdown(60);
    const verifyUserEmailTask = useTask({
        loader: verifyUserEmail,
        onSuccess: () => {
            setStep(2);
            countdown.start();
        }
    });

    const resendCodeTask = useTask({
        loader: () => verifyUserEmail(step1Form.getValues()),
        onSuccess: () => {
            countdown.start();
        }
    });

    const updateUserEmailTask = useTask({
        loader: (data) => updateUserEmail({...data, email: step1Form.getValues("email")}),
        onSuccess: () => {
            onOpenChange?.(false);
            revalidate();
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("setting.email.dialogTitle")}</DialogTitle>
                </DialogHeader>
                <Form {...step1Form}>
                    <form
                        onSubmit={step1Form.handleSubmit(verifyUserEmailTask.execute)}
                        className={cn("space-y-4", step !== 1 && "hidden")}
                    >
                        <FormField
                            control={step1Form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={t("setting.email.newEmailPlaceholder")}
                                            {...field}
                                            disabled={verifyUserEmailTask.isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <InlineError error={verifyUserEmailTask.error}/>
                        <DialogFooter>
                            <Button disabled={verifyUserEmailTask.isPending} type="submit">
                                {t("setting.email.nextButton")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
                <Form {...step2Form}>
                    <form
                        onSubmit={step2Form.handleSubmit(updateUserEmailTask.execute)}
                        className={cn("space-y-4", step !== 2 && "hidden")}
                    >
                        <FormField
                            control={step2Form.control}
                            name="code"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('setting.email.codeLabel', {email: step1Form.getValues("email")})}</FormLabel>
                                    <div className="flex justify-between space-x-2 items-center">
                                        <FormControl>
                                            <InputOTP
                                                maxLength={4}
                                                {...field}
                                                disabled={updateUserEmailTask.isPending}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={resendCodeTask.execute}
                                            disabled={countdown.isActive}
                                            className="text-sm"
                                        >
                                            {countdown.isActive ? t('signup.step2.resendWithTime', {seconds: countdown.seconds }) : t('signup.step2.resendButton')}
                                        </Button>
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <InlineError error={updateUserEmailTask.error || resendCodeTask.error}/>
                        <DialogFooter>
                            <Button disabled={updateUserEmailTask.isPending} type="submit">
                                {t("setting.email.updateButton")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}