import {Input, Link, Navbar, NavbarContent} from "@heroui/react";
import React from "react";
import {FeedbackIcon} from "../icons/navbar/feedback-icon";
import {GithubIcon} from "../icons/navbar/github-icon";
import {SupportIcon} from "../icons/navbar/support-icon";
import {SearchIcon} from "../icons/searchicon";
import {BurguerButton} from "./burguer-button";
import {NotificationsDropdown} from "./notifications-dropdown";
import {UserDropdown} from "./user-dropdown";
import {useAuthStore} from "@/stores/authStore";

interface Props {
    children: React.ReactNode;
}

export const NavbarWrapper = ({children}: Props) => {
    const currentUser = useAuthStore(state => state.user)

    return (
        <div className="relative  flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Navbar
                isBordered
                className="w-full"
                classNames={{
                    wrapper: "w-full max-w-full",
                }}
            >
                <NavbarContent className="md:hidden">
                    <BurguerButton/>
                </NavbarContent>
                <NavbarContent className="w-full max-md:hidden">
                    <Input
                        startContent={<SearchIcon/>}
                        isClearable
                        className="w-[50%]"
                        classNames={{
                            input: "w-[50%]",
                            mainWrapper: "w-full",
                        }}
                        placeholder="Rechercher..."
                    />
                </NavbarContent>
                <NavbarContent
                    justify="end"
                    className="w-fit data-[justify=end]:flex-grow-0"
                >
                    {/* <div className="flex items-center gap-2 max-md:hidden">
            <FeedbackIcon />
            <span>Feedback?</span>
          </div> */}

                    <NotificationsDropdown/>

                    {/* <div className="max-md:hidden">
            <SupportIcon />
          </div> */}
                    <NavbarContent>
                        <UserDropdown currentUser={currentUser}/>
                    </NavbarContent>
                </NavbarContent>
            </Navbar>
            {children}
        </div>
    );
};
