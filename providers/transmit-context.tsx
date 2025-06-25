"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";

const TransmitContext = createContext<any>(null)

export const TransmitProvider = ({children}: { children: ReactNode }) => {
    const [transmit, setTransmit] = useState<any>(null);

    useEffect(() => {
        import("@adonisjs/transmit-client").then(TransmitModule => {
            const baseURL = process.env.NEXT_PUBLIC_TRANSMIT_URL;
            const transmitInstance = new TransmitModule.Transmit({
                baseUrl: baseURL
            })

            setTransmit(transmitInstance);
        })
    }, []);

    if (!transmit) return null;

    return (
        <TransmitContext.Provider value={transmit}>
            {children}
        </TransmitContext.Provider>
    );
}

export const useTransmit = () => {
    const context = useContext(TransmitContext);
    if (!context) {
        throw new Error("transmit context must be initialized!");
    }

    return context;
}