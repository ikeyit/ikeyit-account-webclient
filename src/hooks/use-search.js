import {useEffect, useMemo, useState, useTransition} from "react";
import {useSearchParams} from "react-router-dom";
import {isEqual, pickBy} from "lodash-es";


export function defaultSearchParamsResolver(searchParams) {
    return Object.fromEntries(searchParams.entries());
}

export function yupSearchParamsResolver(schema) {
    return (searchParams) => {
        const params = Object.fromEntries(searchParams.entries());
        return schema.validateSync(params);
    }
}

export function useSearch({resolver = defaultSearchParamsResolver, loader,  onSuccess, onError}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = useMemo(() => resolver(searchParams), [searchParams]);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [isPending, startTransition] = useTransition();

    function loadData(params) {
        startTransition(async () => {
            try {
                const ret = await loader(params);
                setResult(ret);
                setError(null);
                onSuccess?.(ret, params);
            } catch (e) {
                setResult(null);
                setError(e);
                onError?.(e, params);
            }
        })
    }

    function search(newParams) {
        const pickedNewParams = pickBy(newParams);
        if (isEqual(pickedNewParams, params)) {
            loadData(params);
        } else {
            setSearchParams(pickedNewParams);
        }
    }

    useEffect(() => {
        loadData(params);
    },[params]);

    return {
        params,
        error,
        result,
        isPending,
        search,
        setResult
    }
}