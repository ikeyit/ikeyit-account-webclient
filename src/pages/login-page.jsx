import React, {useEffect, useMemo, useState} from "react";
import {Link, useLoaderData, useSearchParams} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {login, postLoginAuthCode, postSendLoginCode} from "../lib/data-api.js";
import {useTranslation} from 'react-i18next';
import {useSession} from "@/components/session.jsx";
import {Button} from "@/components/ui/button.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTask} from "@/hooks/use-task.js";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import InlineError from "@/components/inline-error.jsx";
import {useCountdown} from "@/hooks/use-countdown.js";
import {ContactInput} from "@/components/contact-input.jsx";
import LogoIcon from "@/assets/logo-icon.jsx";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.jsx";

function redirectLocation(searchParams) {
    window.location = searchParams.get("redirect") || "/";
}
const DISABLE_REMEMBER_ME = true;
export default function LoginPage() {
    const {t } = useTranslation();
    const [authMethod, setAuthMethod] = useState(0);
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    const searchParamsForSignup = new URLSearchParams();
    if (redirect) {
        searchParamsForSignup.set("redirect", redirect);
    }
    const {session:{user}} = useSession();
    const oidcProviders = useLoaderData();
    const mode = searchParams.get("mode");
    if (user?.authenticated && "force" !== mode) {
        redirectLocation(searchParams);
    }
    return (
        <div className="h-screen flex items-center justify-center">
            <title>{t("login.title")}</title>
            <div className="w-full bg-white p-8 space-y-8 sm:rounded-lg sm:border sm:w-96">
                <h2 className="flex items-center justify-between text-2xl font-bold text-center">
                    {t('login.header')}
                    <div className="flex items-center text-primary text-xl font-bold">
                        <LogoIcon className="h-8 w-8 text-primary" />
                        {t("login.slogan")}
                    </div>
                </h2>
                {authMethod === 1 ? <CodeForm/> : <PasswordForm/>}
                <div className="space-y-4">
                    {authMethod !== 1 &&
                        <Button variant="secondary" className="w-full" onClick={e => setAuthMethod(1)}>{t('login.useCode')}</Button>}
                    {authMethod !== 0 &&
                        <Button variant="secondary" className="w-full" onClick={e => setAuthMethod(0)}>{t('login.usePassword')}</Button>}
                    {oidcProviders && oidcProviders.length > 0 && <SocialLoginArea oidcProviders = {oidcProviders}/>}
                    <div className="text-center">
                        <Link to={`/signup?${searchParamsForSignup}`}>{t('login.signup')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CodeForm() {
    const {t} = useTranslation();
    const formResolver = useMemo(() => yupResolver(yup.object({
        target: yup
            .string()
            .required(t('login.validation.targetRequired')),
        code: yup
            .string()
            .required(t('login.validation.codeRequired')),
    })), [t]);
    const form = useForm({
        resolver: formResolver,
        defaultValues: {
            target: "",
            code: ""
        }
    });
    const [searchParams] = useSearchParams();
    const saveTask = useTask({
        loader: postLoginAuthCode,
        onSuccess: ()=> redirectLocation(searchParams)
    });
    const countdown = useCountdown(60);
    const sendTask = useTask({
        loader: postSendLoginCode,
        onSuccess: ()=> countdown.start()
    });

    async function handleSendCode() {
        if (await form.trigger("target")) {
            sendTask.execute({target: form.getValues("target")});
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(saveTask.execute)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="target"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <ContactInput
                                    {...field}
                                    autoFocus="autofocus"
                                    disabled={saveTask.isPending}
                                    placeholder={t('login.usernamePlaceholder')}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormControl>
                                    <InputOTP
                                        maxLength={4}
                                        disabled={saveTask.isPending}
                                        {...field}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                            <InputOTPSlot index={2}/>
                                            <InputOTPSlot index={3}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSendCode}
                                    disabled={countdown.isActive}
                                    className="text-sm"
                                >
                                    {countdown.isActive ? t('login.resendCodeButton', {seconds: countdown.seconds}) : t('login.sendCodeButton')}
                                </Button>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {!DISABLE_REMEMBER_ME && (
                    <FormField
                        control={form.control}
                        name="remember"
                        render={({field}) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={saveTask.isPending}
                                    />
                                </FormControl>
                                <FormLabel className="ml-2">
                                    {t("login.rememberMe")}
                                </FormLabel>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}
                <InlineError error={saveTask.error || sendTask.error}/>
                <Button className="w-full" disabled={saveTask.isPending} type="submit">
                    {t("login.signInOrSignUp")}
                </Button>
            </form>
        </Form>
    );
}

function PasswordForm() {
    const {t} = useTranslation();
    const formResolver = useMemo(() => yupResolver(yup.object({
        username: yup
            .string()
            .required(t('login.validation.usernameRequired')),
        password: yup
            .string()
            .required(t('login.validation.passwordRequired')),
    })), [t]);
    const form = useForm({
        resolver: formResolver,
        defaultValues: {
            username: "",
            password: "",
            remember: false
        }
    });
    const [searchParams] = useSearchParams();
    const saveTask = useTask({
        loader: login,
        onSuccess: ()=> redirectLocation(searchParams)
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(saveTask.execute)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <ContactInput
                                    {...field}
                                    autoFocus="autofocus"
                                    disabled={saveTask.isPending}
                                    placeholder={t('login.usernamePlaceholder')}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder={t("login.passwordPlaceholder")} {...field} disabled={saveTask.isPending}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {!DISABLE_REMEMBER_ME && (
                    <FormField
                        control={form.control}
                        name="remember"
                        render={({field}) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={saveTask.isPending}
                                    />
                                </FormControl>
                                <FormLabel className="ml-2">
                                    {t("login.rememberMe")}
                                </FormLabel>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}

                <InlineError error={saveTask.error}/>
                <Button className="w-full" disabled={saveTask.isPending} type="submit">
                    {t("login.signIn")}
                </Button>
            </form>
        </Form>
    )
}


function SocialLoginArea({oidcProviders}) {
    const {t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect")
    function socialLogin(provider) {
        const urlSearchParams = new URLSearchParams();
        if (redirect) {
            urlSearchParams.set("redirect", redirect);
        }
        window.location.href = `/auth/authorization/${provider.id}?${urlSearchParams}`
    }

    return (
        <>
            {oidcProviders.map(provider =>
                <Button key={provider.id} type="button" variant="secondary" className="w-full" onClick={() => socialLogin(provider)}>
                    {t(`login.oidcButton.${provider.id}`)}
                </Button>
            )}
        </>
    );
}

function PopupSocialLoginArea({oidcProviders}) {
    const {t } = useTranslation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const loginSuccessHandler = e => {
            if (e.data === "loginSuccess") {
                redirectLocation(searchParams);
            }
        };
        window.addEventListener('message', loginSuccessHandler);
        return () => window.removeEventListener('message', loginSuccessHandler)
    }, []);

    function socialLogin(provider) {
        const width = 600;
        const height = 600;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);
        window.addEventListener('message', function (event) {
            if (event.data === "loginSuccess") {
                // Handle successful login, e.g., reload the page or redirect
                window.location.reload();
            }
        });

        window.open(`/auth/authorization/${provider.id}`, provider.name, `width=${width},height=${height},top=${top},left=${left}`);
    }

    return (
        <>
            {oidcProviders.map(provider =>
                <Button key={provider.id} type="button" variant="secondary" className="w-full" onClick={() => socialLogin(provider)}>
                    {t(`login.oidcButton.${provider.id}`)}
                </Button>
            )}
        </>
    );
}