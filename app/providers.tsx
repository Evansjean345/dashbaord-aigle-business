"use client";

import * as React from "react";
import {HeroUIProvider} from "@heroui/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({children, themeProps}: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                <NextThemesProvider {...themeProps}>
                    {children}
                </NextThemesProvider>
            </HeroUIProvider>
            <ReactQueryDevtools initialIsOpen={true}/>
        </QueryClientProvider>
    );
}
