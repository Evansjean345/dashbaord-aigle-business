import {useUpdateOrganisationStatus} from "@/hooks/useOrganisation";
import {Button, Card, useDisclosure} from "@heroui/react";
import {Organisation} from "@/types/organisation.types";

interface Props {
    organisation: Organisation
}

export const AccountActions = ({organisation}: Props) => {
    const {updateStatusOrganisation, isUpdatingStatusOrganisation} = useUpdateOrganisationStatus();
    const {onOpen: openUserModal} = useDisclosure(); // gestion ouverture création utilisateur
    const {onOpen: openDeleteModal} = useDisclosure(); // gestion ouverture delete modal

    const handleStatus = () => updateStatusOrganisation({
        organisationId: organisation.organisationId,
        status: organisation.status === "active" ? "inactive" : "active"
    });

    return (
        <Card className="p-4 border rounded-md shadow-none">
            <h4 className="font-semibold mb-2">Actions</h4>
            <div className="flex gap-2">
                <Button
                    color={organisation?.status === "active" ? "warning" : "success"}
                    onPress={handleStatus}
                    isLoading={isUpdatingStatusOrganisation}
                >
                    {organisation?.status === "active" ? "Bloquer" : "Activer"}
                </Button>
                <Button color="primary" onPress={openUserModal}> Ajouter membre </Button>
                <Button color="danger" onPress={openDeleteModal}> Supprimer </Button>
            </div>
        </Card>
    );
};