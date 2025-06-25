"use client";

import {Separator} from "@/components/ui/separator";
import {AuthBanner} from "@/components/auth/auth-banner";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

export const AuthLayoutWrapper = ({children}: Props) => {
    return (
        <div className="w-full fixed grid lg:grid-cols-2 h-screen">
            {/* Left Side: Form Area (Scrollable) */}
            <div
                className="h-screen bg-white dark:bg-background overflow-y-auto pt-2 lg:pt-8 pb-12 flex flex-col justify-between">
                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center px-0 sm:px-0">
                    {children}
                </div>

                <Separator className="block lg:hidden"/>

                {/* Footer */}
                <div className="text-center text-slate-600 px-6 mt-4">
                    <p className="text-sm">
                        Si vous avez des difficultés, veuillez contacter le support technique : <br/>
                        Tel : +225 07 00 60 60 79 | +225 27 22 25 62 77 <br/>
                        Mail : hotline@aiglesend.com
                    </p>
                    <p className="text-xs mt-2 text-slate-400">
                        Copyright © FINTECH AIGLE 2024. Tous droits réservés.
                    </p>
                </div>
            </div>

            {/* Right Side: Carousel Area (Fixed) */}
            <AuthBanner/>
        </div>
    );
};