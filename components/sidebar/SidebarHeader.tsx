import React from 'react';
import Image from "next/image";
import {ActiveOrganisation} from "@/types/organisation.types";
import {AwardIcon, ShieldCheckIcon} from "lucide-react";
import {capitalizeFirstLetter} from "@/lib/utils";

interface Props {
    organisation: ActiveOrganisation
}

const SidebarHeader = ({organisation}: Props) => {
    return (
        <>
            {organisation && (
                <div className="flex items-start gap-x-2 w-full">
                    <Image width={50} height={50} src={"/img/aig-b.png"} alt="company logo"/>
                    <div className="">
                        <h3 className="text-lg -mb-6font-medium text-default-900 line-clamp-1">
                            {organisation.name}
                        </h3>
                        <div className="flex items-center gap-x-1">
                            <span className="text-sm font-bold text-default-500">
                                {capitalizeFirstLetter(organisation.account_type)}
                            </span>
                            {organisation.organisation_type === "main" &&
                                <ShieldCheckIcon className="text-green-600 size-4"/>}
                            {organisation.organisation_type === "sub" && <AwardIcon className="text-blue-600 size-4"/>}

                            <span className="relative flex size-2 -translate-y-2">
                              <span
                                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                         </span>
                        </div>
                    </div>
                    {/* <BottomIcon /> */}
                </div>
            )}
        </>
    );
};

export default SidebarHeader;