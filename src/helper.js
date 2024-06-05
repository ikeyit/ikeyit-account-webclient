import {useEffect} from "react";

export const authUser = ()=> window._serverData.user;
export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
