import React, {createContext, useContext, useEffect, useState} from "react";

const SessionContext = createContext(null);

export function SessionContextProvider({children}) {
    const [user, setUser] = useState(window._serverData?.user || {
        displayName: "guest",
        authenticated: false
    });
    const updateUser = newUser => {
        setUser(prev => ({...prev, ...newUser}))
    }

    return (
        <SessionContext.Provider
            value={{
                user,
                updateUser
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
