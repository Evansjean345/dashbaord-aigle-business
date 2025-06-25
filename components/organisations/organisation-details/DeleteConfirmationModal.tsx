import {Organisation} from "@/types/organisation.types";
import {Button, Modal, ModalBody, ModalContent, useDisclosure} from "@heroui/react";
import {useDeleteOrganisation} from "@/hooks/useOrganisation";

interface props {
    organisation: Organisation
}

export const DeleteConfirmationModal = ({organisation}) => {
    const {deleteOrganisation, isDeletingOrganisation} = useDeleteOrganisation();
    const {isOpen, onClose} = useDisclosure();

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalBody>
                    <p>Voulez-vous vraiment supprimer ce compte professionnel ?</p>
                    <div className="flex justify-end gap-x-2">
                        <Button variant="light" onPress={onClose}>Annuler</Button>
                        <Button color="danger"
                                isLoading={isDeletingOrganisation}
                                onPress={() => deleteOrganisation({organisationId: organisation.organisationId})}>
                            Confirmer
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};