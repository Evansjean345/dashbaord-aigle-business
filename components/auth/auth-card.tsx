import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export const AuthCard = ({children, customClass}: { children: ReactNode, customClass?: string }) => {
    return <div className={cn(
        "w-full md:w-2/3 max-w-3xl mx-auto px-3 lg:px-8 pb-8 pt-2 lg:pt-0 rounded-none lg:rounded-lg border-b-1 lg:border-1 border-transparent lg:border-gray-200 dark:lg:border-neutral-800",
        customClass
    )}>
        {children}
    </div>
}