import React, {useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.jsx"

import {useForm} from "react-hook-form";
import {updateUserPhone, verifyUserPhone} from "@/lib/data-api.js";
import InlineError from "@/components/inline-error.jsx";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";
import {
    Form,
    FormControl,
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
import {ContactInput} from "@/components/contact-input.jsx";
import { MOBILE_REGEX } from "../../../lib/regex";

let updatePhoneDialogKey = 1;
export default function PhoneSetting({value, ...props}) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const handleModify = () => {
        updatePhoneDialogKey++;
        setOpen(true);
    };
    return (
        <div className="space-y-3" {...props}>
            <Label>{t("setting.phone.phoneLabel")}</Label>
            <div className="text-xs text-gray-800">
                {value ? t("setting.phone.phoneDesc", {phone: value}) : t("setting.phone.phoneDescEmpty")}
            </div>
            <Button onClick={handleModify}>{t("setting.phone.modifyButton")}</Button>
            <UpdatePhoneDialog open={open} onOpenChange={setOpen} key={updatePhoneDialogKey}/>
        </div>
    )
}

function UpdatePhoneDialog({open, onOpenChange}) {
    const {t} = useTranslation();
    const { revalidate } = useRevalidator();
    const [step, setStep] = useState(1);
    const step1Resolver = useMemo(() =>
            yupResolver(yup.object({
                phone: yup
                    .string()
                    .required(t('setting.phone.validation.phoneRequired'))
                    .matches(MOBILE_REGEX, t('setting.phone.validation.invalidPhone'))
            })),
        [t]);
    const step1Form = useForm({resolver: step1Resolver});
    const step2Resolver = useMemo(() =>
            yupResolver(yup.object({
                code: yup
                    .string()
                    .required(t('setting.phone.validation.codeRequired'))
            })),
        [t]);
    const step2Form = useForm({resolver: step2Resolver});
    const countdown = useCountdown(60);
    const verifyUserPhoneTask = useTask({
        loader: verifyUserPhone,
        onSuccess: () => {
            setStep(2);
            countdown.start();
        }
    });

    const resendCodeTask = useTask({
        loader: () => verifyUserPhone(step1Form.getValues()),
        onSuccess: () => {
            countdown.start();
        }
    });

    const updateUserPhoneTask = useTask({
        loader: (data) => updateUserPhone({...data, phone: step1Form.getValues("phone")}),
        onSuccess: () => {
            onOpenChange?.(false);
            revalidate();
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("setting.phone.dialogTitle")}</DialogTitle>
                </DialogHeader>
                <Form {...step1Form}>
                    <form
                        onSubmit={step1Form.handleSubmit(verifyUserPhoneTask.execute)}
                        className={cn("space-y-4", step !== 1 && "hidden")}
                    >
                        <FormField
                            control={step1Form.control}
                            name="phone"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <ContactInput
                                            inputMode="phone"
                                            placeholder={t("setting.phone.newPhonePlaceholder")}
                                            {...field}
                                            disabled={verifyUserPhoneTask.isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <InlineError error={verifyUserPhoneTask.error}/>
                        <DialogFooter>
                            <Button disabled={verifyUserPhoneTask.isPending} type="submit">
                                {t("setting.phone.nextButton")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
                <Form {...step2Form}>
                    <form
                        onSubmit={step2Form.handleSubmit(updateUserPhoneTask.execute)}
                        className={cn("space-y-4", step !== 2 && "hidden")}
                    >
                        <FormField
                            control={step2Form.control}
                            name="code"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('setting.phone.codeLabel', {phone: step1Form.getValues("phone")})}</FormLabel>
                                    <div className="flex justify-between space-x-2 items-center">
                                        <FormControl>
                                            <InputOTP
                                                maxLength={4}
                                                {...field}
                                                disabled={updateUserPhoneTask.isPending}
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
                        <InlineError error={updateUserPhoneTask.error || resendCodeTask.error}/>
                        <DialogFooter>
                            <Button disabled={updateUserPhoneTask.isPending} type="submit">
                                {t("setting.phone.updateButton")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}