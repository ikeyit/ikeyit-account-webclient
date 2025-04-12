import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for countdown timer
 * @param {number} initialSeconds - Initial seconds for countdown
 * @returns {Object} Countdown state and control functions
 */
export function useCountdown(initialSeconds = 60) {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Reset countdown timer
    const reset = useCallback(() => {
        setSeconds(initialSeconds);
        setIsActive(true);
    }, [initialSeconds]);

    // Stop countdown timer
    const stop = useCallback(() => {
        setIsActive(false);
    }, []);

    // Start countdown timer
    const start = useCallback(() => {
        reset();
    }, [reset]);

    // Effect for countdown
    useEffect(() => {
        let interval = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds]);

    return {
        seconds,
        isActive,
        start,
        stop,
        reset
    };
}