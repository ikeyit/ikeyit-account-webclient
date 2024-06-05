import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {ajax} from "./ajax";
import {useAsync} from "ikeyit-react-easy";
import CountdownButton from "./CountdownButton"
import './LoginPage.css'
import {authUser, useDocumentTitle} from "./helper.js";

const errMap = {
    "BadCredentialsException": "Username or password is wrong!"
}

export default function LoginPage() {
    const [authMethod, setAuthMethod] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    useDocumentTitle("Login to IKEYIT");
    const user = authUser();
    if (user && user.authenticated) {
        window.location = searchParams.get("redirect") || "/";
    }
    return (
        <div className="login-form">
            <h2>Please login</h2>
            {authMethod == 1 ? <CodeForm/> : <PasswordForm/>}
            {authMethod != 1 && <button className="pure-button" onClick={e => setAuthMethod(1)}>Use Code</button>}
            {authMethod != 0 && <button className="pure-button" onClick={e => setAuthMethod(0)}>Use Password</button>}
            <SocialLoginArea/>
        </div>
    );
}

function CodeForm() {
    // Use ajax to implement sms code login
    const [searchParams, setSearchParams] = useSearchParams();
    const {watch, register, trigger, handleSubmit, formState} = useForm({mode: "onChange"});
    const [timer, setTimer] = useState(0);
    const {data: sendData, error: sendError, status: sendStatus, execute: sendExecute} = useAsync(params =>
            ajax.post("/login/sendcode", params, {headers: {'content-type': 'application/x-www-form-urlencoded'}}),
        {
            onSuccess: () => setTimer(20)
        });
    const {data: loginData, error: loginError, status: loginStatus, execute: loginExecute} = useAsync(params =>
            ajax.post("/login/authcode", params, {headers: {'content-type': 'application/x-www-form-urlencoded'}}),
        {onSuccess: () => window.location = searchParams.get("redirect") || "/"});

    async function send() {
        const result = await trigger("target");
        if (result)
            sendExecute({target: watch("target")})
    }

    return (
        <form className="pure-form pure-form-stacked" onSubmit={handleSubmit(loginExecute)}>
            {loginError && <span className="form-err">{loginError.errMsg}</span>}
            <input type="text" id="target" placeholder="mobile number"
                   autoFocus="autofocus"  {...register('target', {required: true})}/>
            {formState.errors.target && <span className="form-err">Mobile is required</span>}
            <label htmlFor="code">Code</label>
            <div className="pure-u-1-2">
                <input type="text" id="code" placeholder="code" {...register('code', {required: true})}/>
            </div>
            <div className="pure-u-1-2" style={{paddingLeft: "1em"}}>
                <CountdownButton type="button" label="Send" timer={sendStatus == "loading" ? -1 : timer}
                                 counterSuffix="s" className="pure-button pure-button-primary" autoComplete="off"
                                 onClick={send}/>
            </div>
            {formState.errors.code && <span className="form-err">Code is required</span>}
            {sendStatus == "error" && <span className="form-err">{sendError.errMsg}</span>}
            <label htmlFor="remember" className="pure-checkbox"><input type="checkbox" id="remember" name="remember"/>
                Remember me
            </label>
            <button type="submit" className="pure-button pure-button-primary" disabled={loginStatus == "loading"}>
                Sign in Or Sign up
            </button>
        </form>
    );
}

function PasswordForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {register, handleSubmit, formState} = useForm({mode: "onTouched"});
    const formRef = useRef(null);
    const error = searchParams.get("error");
    const redirect = searchParams.get("redirect") || "/";

    function onSubmit(data) {
        formRef.current.submit();
    }

    return (
        <form className="pure-form pure-form-stacked" action="/login" method="post" onSubmit={handleSubmit(onSubmit)}
              ref={formRef}>
            <input type="hidden" name="redirect" value={redirect || ""}/>
            <input type="hidden" name="_csrf" value={window._serverData.csrfToken}/>
            <input type="text" id="username" placeholder="user name"
                   autoFocus="autofocus" {...register('username', {required: true})}/>
            {formState.errors.username && <span className="form-err">Username is required</span>}
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Password" {...register('password', {required: true})}/>
            {formState.errors.password && <span className="form-err">Password is required</span>}
            <label htmlFor="remember" className="pure-checkbox"><input type="checkbox" id="remember" name="remember"/>Remember
                me</label>
            {error && <span className="form-err">{errMap[error] || "Unknown error"}</span>}
            <button type="submit" className="pure-button pure-button-primary">Sign in</button>
        </form>
    );
}


function SocialLoginArea() {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const loginSuccessHandler = e => {
            if (e.data === "loginSuccess") {
                window.location = searchParams.get("redirect") || "/";
            }
        };
        window.addEventListener('message', loginSuccessHandler);
        return () => window.removeEventListener('message', loginSuccessHandler)
    }, []);

    function socialLogin(clientId) {
        const width = 600;
        const height = 600;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);

        window.addEventListener('message', function(event) {
            if (event.data === "loginSuccess") {
                // Handle successful login, e.g., reload the page or redirect
                window.location.reload();
            }
        });

        window.open(`/oauth2/authorization/${clientId}`, 'Google Login', `width=${width},height=${height},top=${top},left=${left}`);
    }

    return (
        <>
        <button type="button" className="pure-button pure-button-primary" onClick={() => socialLogin("google")}>Use
            Google Account</button>
        </>
    );
}