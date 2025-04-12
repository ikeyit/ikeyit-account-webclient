import {useState, useTransition} from "react";

export function useTask({loader, onSuccess, onError}) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();
    function execute(...params) {
        startTransition(async () => {
            try {
                const ret = await loader(...params);
                setResult(ret);
                setError(null);
                onSuccess?.(ret, ...params);
            } catch (e) {
                setResult(null);
                setError(e);
                onError?.(e, ...params);
            }
        })
    }

    function reset() {
        setResult(null);
        setError(null);
    }
    return {isPending, execute, result, error, reset};
}