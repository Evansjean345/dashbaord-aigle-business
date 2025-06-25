import {ModalHeader} from "@heroui/react";
import Image from "next/image";
import {Organisation} from "@/types/organisation.types";

interface Props {
    organisation: Organisation
}

export const AccountHeader = ({organisation}: Props) => (
    <ModalHeader className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
            <Image width={40} height={40} src="/img/aig-b.png" alt="Logo"/>
            <div>
                <h2 className="text-2xl font-bold">{organisation?.name}</h2>
                <p className="text-default-500">ID: # {organisation?.organisationId} </p>
            </div>
        </div>
        <div className="text-right">
            <h3 className="text-xl">Solde actuel</h3>
            <p className="text-2xl font-bold text-success">
                {organisation?.wallet?.balance} FCFA
            </p>
        </div>
    </ModalHeader>
);