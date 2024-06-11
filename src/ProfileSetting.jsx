import React, {useCallback, useEffect, useRef, useState} from "react";
import {authUser} from "./helper.js";
import {useAsync} from "ikeyit-react-easy";
import {ajax} from "./ajax.js";
import {Modal} from "./ui/Modal.jsx";
import {useGlobalMessage} from "./ui/GlobalMessage.jsx";
import {useSession} from "./ui/Session.jsx";
import {useForm} from "react-hook-form";

export default function ProfileSetting() {
    const {data, error, status, setData} = useAsync(() =>
            ajax.get("/api/profile"),
        {
            executeArgs: null,
        });

    const handleFinish = email => {
        setData(prev => ({...prev, email}));
    };

    return (
        <div>
            {status === "success" &&
                <>
                    <DisplayNameItem
                        value={data.displayName}
                    />
                    <EmailItem
                        value={data.email}
                        onFinish={handleFinish}
                    />
                    <PasswordItem/>
                </>
            }
        </div>
    )
}

function DisplayNameItem({value, ...props}) {
    const {updateUser} = useSession();
    const [displayName, setDisplayName] = useState(value);
    const [prevDisplayName, setPrevDisplayName] = useState(value);
    const showMessage = useGlobalMessage();
    const {error, status, execute} = useAsync(params =>
            ajax.patch("/api/user/display-name", params),
        {onSuccess: handleUpdated});

    function handleUpdated() {
        showMessage("done!");
        updateUser({displayName});
    }

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
        <div className="setting-item">
            <div className="setting-item-head">
                <div className="setting-item-label">
                    <h3 className="setting-item-title">Display name (optional)</h3>
                    <p className="setting-item-desc">Set a display name. This does not change your username.</p>
                </div>
            </div>

            <input
                {...props}
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={status === "loading"}
            />
            {status === "error" && <span className="error">{error.errMsg}</span>}
        </div>
    );
}


function EmailItem({value, onFinish}) {
    const [showModal, setShowModal] = useState(false);
    const handleFinish = (data) => {
        setShowModal(false);
        onFinish?.(data);
    };

    const handleCancel = ()=> {
        setShowModal(false);
    };
    return (
        <div className="setting-item">
            <div className="setting-item-head">
                <div className="setting-item-label">
                    <h3 className="setting-item-title">Email</h3>
                    <p className="setting-item-desc">{value}</p>
                </div>
                <div className="setting-item-action">
                    <button type="button" className="button-primary"  onClick={() => setShowModal(true)}>Modify</button>
                </div>
                {showModal && <EmailModal show={showModal} onCancel={handleCancel} onFinish={handleFinish}/>}
            </div>

        </div>

    )
}

function EmailModal({show, onFinish, onCancel}) {
    const [step, setStep] = useState(1);
    const [step1Data, setStep1Data] = useState(null);
    const handleStep1Finish = (data) => {
        setStep(2);
        setStep1Data(data);
    }
    const handleStep2Finish = (data) => {
        onFinish && onFinish(data);
    }
    return (
        <Modal show={show} onCancel={onCancel} title="Setting">
            {step === 1 && <EmailUpdateStep1 onFinish = {handleStep1Finish}/>}
            {step === 2 && <EmailUpdateStep2 data={step1Data} onFinish = {handleStep2Finish}/>}
        </Modal>
    );
}

function EmailUpdateStep1({onFinish}) {
    const {watch, register,  handleSubmit, formState: {errors, isValid}} = useForm({mode: "onChange"});
    const {error: sendCodeError, status: sendCodeStatus, execute: sendCode} = useAsync(params =>
            ajax.post("/api/user/email/verification", params),
        {
            onSuccess: () => onFinish?.(watch())
        });
    const onSubmit = (data) => {
        sendCode(data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Input the new email</label>
            <input
                type="text"
                id="email"
                {...register("email", {
                    required: 'Email address is required',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address'
                    }
                })}
                disabled={sendCodeStatus === "loading"}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
            {sendCodeStatus === "error" && <span className="error">{sendCodeError.errMsg}</span>}
            <button disabled={!isValid} type="submit">
                Next
            </button>
        </form>
    );
}

function EmailUpdateStep2({data, onFinish}) {
    const {watch, register, handleSubmit, formState: {errors, isValid}} = useForm({mode: "onChange"});

    const {error: updateError, status: updateStatus, execute: update} = useAsync(params =>
            ajax.post("/api/user/email", params),
        {
            onSuccess: () => onFinish?.(watch("email"))
        });
    const onSubmit = (data) => {
        update(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <span className="error">
                A verification code has been sent to your email <span>{data.email}</span>.
            </span>
            <input type="hidden" value={data.email} {...register("email")}/>
            <label htmlFor="code">Input the code</label>
            <input
                type="text"
                id="code"
                {...register("code", {
                    required: 'Code is required',
                })}
                disabled={updateStatus === "loading"}
            />
            {errors.code && <span className="error">{errors.code.message}</span>}
            {updateStatus === "error" && <span className="error">{updateError.errMsg}</span>}
            <button disabled={!isValid} type="submit">
                Update
            </button>
        </form>
    );
}



function PasswordItem() {
    const [showModal, setShowModal] = useState(false);
    const showMessage = useGlobalMessage();
    const handleSuccess = () => {
        setShowModal(false);
        showMessage("Done!");
    };

    const handleCancel = ()=> {
        setShowModal(false);
    };

    return (
        <div className="setting-item">
            <div className="setting-item-head">
                <div className="setting-item-label">
                    <h3 className="setting-item-title">Password</h3>
                    <p className="setting-item-desc">Change your password</p>
                </div>
                <div className="setting-item-action">
                    <button type="button" className="button-primary" onClick={() => setShowModal(true)}>Modify</button>
                </div>
                {showModal && <PasswordModal show={showModal} onCancel={handleCancel} onSuccess={handleSuccess}/>}
            </div>

        </div>

    )
}


function PasswordModal({show, onSuccess, onCancel}) {
    const {watch, register, handleSubmit, formState: {errors, isValid}} = useForm({mode: "onSubmit"});
    const {error: updateError, status: updateStatus, execute: update} = useAsync(params =>
            ajax.post("/api/password", params),
        {onSuccess});

    return (
        <Modal show={show} onCancel={onCancel} title="Modify Password">
            <form onSubmit={handleSubmit(update)} className="i-form">
                <label htmlFor="oldPassword">Input your old password</label>
                <input
                    type="password"
                    id="oldPassword"
                    {...register("oldPassword", {
                        required: 'Old password is required'
                    })}
                    disabled={updateStatus === "loading"}
                />
                {errors.oldPassword && <span className="error">{errors.oldPassword.message}</span>}
                <label htmlFor="newPassword">Input your new password</label>
                <input
                    type="password"
                    id="newPassword"
                    {...register("newPassword", {
                        required: 'New password is required'
                    })}
                    disabled={updateStatus === "loading"}
                />
                {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
                <label htmlFor="newPasswordConfirm">Confirm your new password</label>
                <input
                    type="password"
                    id="newPasswordConfirm"
                    {...register("newPasswordConfirm", {
                        required: "Required",
                        validate: val => watch('newPassword') === val || "Your passwords doesn't match!"
                    })}
                    disabled={updateStatus === "loading"}
                />
                {errors.newPasswordConfirm &&
                    <span className="error">{errors.newPasswordConfirm.message}</span>}
                {updateStatus === "error" && <span className="error">{updateError.errMsg}</span>}
                <div className="form-actions">
                    <button type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </Modal>
    );
}
