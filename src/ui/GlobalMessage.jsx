import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import './GlobalMessage.css'; // Assume you have some basic CSS to style the message

const GlobalMessageContext = createContext();

export const GlobalMessageProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    const showMessage = (msg, duration = 3000) => {
        // Clear the previous timeout if any
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setMessage(msg);
        setVisible(true);

        // Set a new timeout to hide the message
        timeoutRef.current = setTimeout(() => {
            setVisible(false);
        }, duration);
    };

    return (
        <GlobalMessageContext.Provider value={showMessage}>
            {children}
            {visible && <GlobalMessage message={message} />}
        </GlobalMessageContext.Provider>
    );
};

const GlobalMessage = ({ message }) => {
    return (
        <div className="global-message">
            {message}
        </div>
    );
};

export const useGlobalMessage = () => {
    return useContext(GlobalMessageContext);
};
