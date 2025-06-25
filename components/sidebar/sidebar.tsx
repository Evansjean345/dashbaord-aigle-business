import React from "react";
import {Sidebar} from "./sidebar.styles";
import {
    AiPhone02Icon,
    ArrowDataTransferHorizontalIcon,
    Briefcase07Icon,
    CrowdfundingIcon,
    HoldPhoneIcon,
    Home13Icon,
    Payment02Icon,
    WalletAdd01Icon
} from 'hugeicons-react';
import {SidebarItem} from "./sidebar-item";
import {SidebarMenu} from "./sidebar-menu";
import {useSidebarContext} from "../layout/layout-context";
import {usePathname} from "next/navigation";
import {useOrganisationStore} from "@/stores/organisationStore";
import SidebarHeader from "@/components/sidebar/SidebarHeader";

export const SidebarWrapper = () => {
    const pathname = usePathname();
    const {collapsed, setCollapsed} = useSidebarContext();
    const activeOrganisation = useOrganisationStore(state => state.organisation);

    const accountType = activeOrganisation?.account_type

    return (
        <aside className="h-screen z-[20] sticky top-0 overflow-hidden">
            {collapsed ? (
                <div className={Sidebar.Overlay()} onClick={setCollapsed}/>
            ) : null}
            <div
                className={Sidebar({
                    collapsed: collapsed,
                })}
            >
                <div className={`${Sidebar.Header()} `}>
                    {/* <CompaniesDropdown /> */}
                    <SidebarHeader organisation={activeOrganisation}/>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className={Sidebar.Body()}>
                        <SidebarItem
                            title="Accueil"
                            icon={<Home13Icon/>}
                            isActive={pathname === "/"}
                            href="/"
                        />
                        <SidebarMenu title="Menu principal">
                            {activeOrganisation?.organisation_type === "main" && (
                                <SidebarItem
                                    isActive={pathname === "/organisations"}
                                    title="Comptes business"
                                    icon={<Briefcase07Icon/>}
                                    href="organisations"
                                />
                            )}
                            <SidebarItem
                                isActive={pathname === "/payments"}
                                title="Paiements"
                                icon={<Payment02Icon/>}
                                href="payments"
                            />
                            <SidebarItem
                                isActive={pathname === "/transferts"}
                                title="Transferts"
                                icon={<ArrowDataTransferHorizontalIcon/>}
                                href="transferts"
                            />
                            <SidebarItem
                                isActive={pathname === "/mass-payment"}
                                title="Transferts en masse"
                                icon={<CrowdfundingIcon/>}
                                href="mass-payment"
                            />
                            <SidebarItem
                                isActive={pathname === "/airtimes"}
                                title="Airtime"
                                icon={<AiPhone02Icon/>}
                                href="airtimes"
                            />
                            <SidebarItem
                                isActive={pathname === "/kbine"}
                                title="Smart Cabine"
                                icon={<HoldPhoneIcon/>}
                                href="kbine"
                            />
                            <SidebarItem
                                isActive={pathname === "/supply"}
                                title="Approvisionnement"
                                icon={<WalletAdd01Icon/>}
                                href="supply"
                            />
                        </SidebarMenu>
                    </div>
                </div>
            </div>
        </aside>
    );
};
