import {createContext, Suspense, use, useCallback, useContext, useDeferredValue, useState} from "react";
import {getSession} from "@/lib/data-api.js";
import {ErrorBoundary} from "react-error-boundary";
export const SessionContext = createContext(null);

export function SessionProvider({children}) {
    const [promise, setPromise] = useState(() => getSession());
    // Keep the old session firstly
    const deferredPromise = useDeferredValue(promise);
    return (
        <ErrorBoundary FallbackComponent={Fallback}>
            <Suspense>
                <SessionContextProvider promise={deferredPromise} setPromise={setPromise}>
                    {children}
                </SessionContextProvider>
            </Suspense>
        </ErrorBoundary>
    )
}

function SessionContextProvider({promise, setPromise, children}) {
    const session = use(promise);
    const updateSession = useCallback(() => setPromise(getSession()), []);
    return (
        <SessionContext value={{session, updateSession}}>
            {children}
        </SessionContext>
    );
}

function Fallback({error}) {
    return (
        <p className="flex flex-col w-full justify-center items-center text-destructive">
            {error.errMsg}
        </p>
    );
}

export function useSession() {
    return useContext(SessionContext);
}