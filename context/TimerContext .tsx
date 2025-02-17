import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
    const [orderInProgress, setOrderInProgress] = useState(false);

    useEffect(() => {
        if (orderInProgress && remainingTime > 0) {
            const interval = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 0) {
                        clearInterval(interval);
                        setOrderInProgress(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [orderInProgress, remainingTime]);

    return (
        <TimerContext.Provider value={{ remainingTime, setRemainingTime, orderInProgress, setOrderInProgress }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
