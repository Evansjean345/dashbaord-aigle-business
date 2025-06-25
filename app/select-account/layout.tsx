"use client"

import React, {ReactNode} from 'react';
import {Navbar, NavbarContent} from "@heroui/react";
import {UserDropdown} from "@/components/navbar/user-dropdown";
import {useAuthStore} from "@/stores/authStore";
import Image from "next/image";

interface Props {
    children: ReactNode
}

const SelectAccountLayout = ({children}: Props) => {
    const currentUser = useAuthStore(state => state.user)

    return (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Navbar
                isBordered
                className="w-full"
                classNames={{
                    wrapper: "w-full max-w-full py-2",
                }}
            >
                <NavbarContent>
                    <Image width={75} height={75} src={"/img/aig-b.png"} alt="company logo"/>
                </NavbarContent>
                <NavbarContent
                    className="space-x-0"
                    justify="end"
                >
                    {currentUser && <div
                        className="font-semibold rounded-full flex items-center gap-x-2 bg-neutral-200/50 px-2 text-[14px]">
                            <span className="relative flex size-3">
                              <span
                                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                            </span>
                        {currentUser?.fullname}
                    </div>}
                    <UserDropdown currentUser={currentUser}/>
                </NavbarContent>
            </Navbar>
            {children}
        </div>
    );
};

export default SelectAccountLayout;