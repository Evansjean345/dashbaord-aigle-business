import {Organisation} from "@/types/organisation.types";
import {Card} from "@heroui/react";

interface Props {
    organisation: Organisation
}

export const AccountDetails = ({organisation}: Props) => {
    return (
        <>
            <Card className="p-4 border rounded-md shadow-none">
                <h4 className="font-semibold mb-4">Informations détaillées</h4>
                <ul className="space-y-3">
                    <li className="grid grid-cols-2"><span>Nom:</span> <span>{organisation?.name}</span></li>
                    <li className="grid grid-cols-2"><span>Téléphone:</span> <span>{organisation?.phone}</span></li>
                    <li className="grid grid-cols-2">
                        <span>Statut:</span>
                        <div>
                    <span
                        className={organisation.status === 'active' ? 'text-success' : 'text-danger'}>{organisation?.status}</span>
                        </div>
                    </li>
                </ul>
            </Card>

            {/*{openPinModal && (*/}
            {/*    <AccountPinModal*/}
            {/*        organisationId={organisation.organisationId}*/}
            {/*        isOpen={openPinModal}*/}
            {/*        onClose={() => setOpenPinModal(false)}*/}
            {/*        codePinUpdate={() => {*/}
            {/*            if (newOrganisation && !newOrganisation.isPasswordEnabled) {*/}
            {/*                setNewOrganisation(prevState => ({*/}
            {/*                    ...prevState,*/}
            {/*                    isPasswordEnabled: true*/}
            {/*                }))*/}
            {/*            }*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
        </>
    )
}