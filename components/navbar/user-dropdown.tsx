import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    NavbarItem,
} from "@heroui/react";
import React from "react";
import {DarkModeSwitch} from "./darkmodeswitch";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import {UserCircleIcon} from "hugeicons-react"
import {User} from "@/types/auth.types";


interface Props {
    currentUser: User
}

export const UserDropdown = ({currentUser}: Props) => {
    const router = useRouter();

    const {logout} = useAuth();

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <UserCircleIcon className="size-7 cursor-pointer"/>
                </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label='User menu actions'>
                <DropdownItem
                    key='profile'
                    className='flex flex-col justify-start w-full items-start'>
                    <p>Connecter en tant que</p>
                    <p>{currentUser?.fullname}</p>
                </DropdownItem>
                <DropdownItem key='settings' onPress={() => router.push("/profile")}>Mon compte</DropdownItem>
                <DropdownItem key='help_and_feedback'>Aide et signalement</DropdownItem>
                <DropdownItem
                    key='logout'
                    color='danger'
                    className='text-danger'
                    onPress={logout}>
                    Déconnexion
                </DropdownItem>
                <DropdownItem key='switch'>
                    <DarkModeSwitch/>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
