import {useEffect, useRef, useState} from "react";

export default function CountdownButton({timer = 10, label = "click", counterPrefix = " ", counterSuffix = "", ...properties}) {
    const [prevTimer, setPrevTimer] = useState(timer);
    const [counter, setCounter] = useState(timer);
    const [disabled, setDisabled] = useState(timer != 0);
    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        } else if (counter == 0) {
            setDisabled(false);
        }
    }, [counter]);

    if (prevTimer !== timer) {
        setPrevTimer(timer);
        setCounter(timer);
        setDisabled(timer != 0);
    }

    return (
        <button disabled={disabled} {...properties}>
            {label}
            {counter > 0 && <span>{counterPrefix + counter + counterSuffix}</span>}
        </button>
    );
}