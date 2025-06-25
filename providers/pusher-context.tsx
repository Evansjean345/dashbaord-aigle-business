"use client"

import {createContext, FC, ReactNode, useContext} from "react";
import Pusher from "pusher-js";

const pusher = new Pusher('b9063f0c5c31f6ebf2df', {
    cluster: 'eu'
});

const PusherContext = createContext<Pusher | null>(null)

export const PusherProvider: FC = ({children}: { children: ReactNode }) => {
    return (
        <PusherContext.Provider value={pusher}>
            {children}
        </PusherContext.Provider>
    );
}

export const usePusher = () => {
    const context = useContext(PusherContext);
    if (!context) {
        throw new Error("transmit context must be initialized!");
    }

    return context
}