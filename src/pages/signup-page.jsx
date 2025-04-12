import {useMemo, useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContactInput } from '@/components/contact-input.jsx';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useCountdown } from '@/hooks/use-countdown.js';
import { verifySignup, signup } from '@/lib/data-api';
import * as yup from 'yup';
import React from 'react';
import { cn } from '@/lib/utils';
import { EMAIL_REGEX, MOBILE_REGEX, CODE_REGEX } from '@/lib/regex';
import LogoIcon from "@/assets/logo-icon.jsx";
import {useTask} from "@/hooks/use-task.js";
import InlineError from "@/components/inline-error.jsx";
import {useSearchParams} from "react-router-dom";
function redirectLocation(searchParams) {
  window.location = searchParams.get("redirect") || "/";
}
export default function SignupPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const {seconds, isActive, start} = useCountdown(60);
  // Step 1 form
  const step1FormResolver = useMemo(() => yupResolver(yup.object({
    username: yup.string()
        .required(t('signup.validation.contactRequired'))
        .test('is-valid-contact', t('signup.validation.invalidContact'), value => {
          return EMAIL_REGEX.test(value) || MOBILE_REGEX.test(value);
        })
  })), [t]);

  const step1Form = useForm({
    resolver: step1FormResolver,
    defaultValues: {
      username: ''
    }
  });

  // Step 2 form
  const step2FormResolver = useMemo(() => yupResolver(yup.object({
    username: yup.string().required(),
    code: yup.string()
        .required(t('signup.validation.codeRequired'))
        .matches(CODE_REGEX, t('signup.validation.invalidCode')),
    displayName: yup.string()
        .required(t('signup.validation.displayNameRequired')),
    password: yup.string()
        .required(t('signup.validation.passwordRequired'))
        .min(8, t('signup.validation.passwordMinLength'))
        .matches(
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#?!@$%^&*\-+_])[a-zA-Z0-9#?!@$%^&*\-+_]{8,}$/,
            t('signup.validation.passwordComplexity')
        ),
    confirmPassword: yup.string()
        .required(t('signup.validation.confirmPasswordRequired'))
        .oneOf([yup.ref('password')], t('signup.validation.passwordsNotMatch'))
  })), [t]);

  const step2Form = useForm({
    resolver: step2FormResolver,
    defaultValues: {
      username: '',
      code: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    }
  });

  const step1Task = useTask({
    loader: verifySignup,
    onSuccess: () => {
      setStep(2);
      step2Form.setValue("username", step1Form.getValues("username"));
      // Start countdown timer for resend button
      start();
    }
  });
  const resendCodeTask = useTask({
    loader: verifySignup,
    onSuccess: () => {
      start();
    }
  })
  const step2Task = useTask({
    loader: signup,
    onSuccess: () => {
      redirectLocation(searchParams);
    }
  })
  // Handle step 1 submit
  function onStep1Submit(data) {
    if (data.username !== step2Form.getValues("username")) {
      step2Form.reset();
      step1Task.execute(data);
    } else {
      setStep(2);
    }
  }

  function onStep2Submit(data) {
    step2Task.execute(data);
  }

  function onResendClick() {
    resendCodeTask.execute(step2Form.getValues("username"));
  }

  // Go back to previous step
  const onBack = () => {
    setStep(1);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <title>{t("signup.title")}</title>
      <div className="w-full bg-white p-8 space-y-8 sm:rounded-lg sm:border sm:w-md">
        <h2 className="flex items-center justify-between">
          <span className="text-2xl font-bold">{t('signup.title')}</span>
          <div className="flex items-center text-primary text-xl font-bold">
            <LogoIcon className="h-8 w-8 text-primary" />
            IKEYIT
          </div>
        </h2>
        <Form {...step1Form}>
          <form
              onSubmit={step1Form.handleSubmit(onStep1Submit)}
              className={cn("space-y-4", step !== 1 && "hidden")}
              autoComplete="off"
          >
            <FormField
                control={step1Form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                      <ContactInput
                          {...field}
                          placeholder={t('signup.step1.placeholder')}
                          className="h-14 text-lg"
                          autocomplete="off"
                      />
                      <div>
                        <FormMessage />
                        <InlineError error={step1Task.error}/>
                      </div>
                    </FormItem>
                )}
            />
            <div className="flex justify-end">
              <Button
                  type="submit"
              >
                {t('signup.step1.continueButton')}
              </Button>
            </div>
          </form>
        </Form>

        <Form {...step2Form}>
          <form
              onSubmit={step2Form.handleSubmit(onStep2Submit)}
              className={cn("space-y-4", step !== 2 && "hidden")}
              autoComplete="off"
          >
            <div className="text-center space-y-2">
              <h3 className="text-lg">{t('signup.step2.title')}</h3>
              <p className="text-base">{step1Form.getValues("username")}</p>
            </div>
            <FormField
                control={step2Form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormControl>
                          <InputOTP maxLength={4} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} className="size-12 text-2xl"/>
                              <InputOTPSlot index={1} className="size-12 text-2xl"/>
                              <InputOTPSlot index={2} className="size-12 text-2xl"/>
                              <InputOTPSlot index={3} className="size-12 text-2xl"/>
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onResendClick}
                            disabled={isActive}
                            className="text-sm"
                        >
                          {isActive ? t('signup.step2.resendWithTime', { seconds }) : t('signup.step2.resendButton')}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={step2Form.control}
                name="displayName"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('signup.step2.displayNameLabel')}</FormLabel>
                      <FormControl>
                        <Input
                            {...field}
                            placeholder={t('signup.step2.displayNamePlaceholder')}
                            autocomplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={step2Form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('signup.step2.passwordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                            type="password"
                            {...field}
                            placeholder={t('signup.step2.passwordPlaceholder')}
                            autocomplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={step2Form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('signup.step2.confirmPasswordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                            type="password"
                            {...field}
                            placeholder={t('signup.step2.confirmPasswordPlaceholder')}
                            autocomplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <InlineError error={step2Task.error}/>
            <div className="flex items-center justify-between">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={onBack}
              >
                {t('signup.step2.backButton')}
              </Button>
              <Button
                  type="submit"
              >
                {t('signup.step2.nextButton')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}