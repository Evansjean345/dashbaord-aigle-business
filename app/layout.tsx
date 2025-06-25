import "@/styles/globals.css";
import {Providers} from "./providers";
import {fontSans} from "@/config/fonts";
import clsx from "clsx";
import {Toaster} from "sonner";
import {TransmitProvider} from "@/providers/transmit-context";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang='fr' suppressHydrationWarning>
        <head>
            <link rel="preload" href={fontSans.style.fontFamily} as="font" crossOrigin="anonymous"/>
        </head>
        <body
            className={clsx("min-h-screen dark:bg-background bg-neutral-50/50  font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{attribute: "class", defaultTheme: "system"}}>
            <TransmitProvider>
                {children}
            </TransmitProvider>
        </Providers>
        <Toaster/>
        </body>
        </html>
    );
}
