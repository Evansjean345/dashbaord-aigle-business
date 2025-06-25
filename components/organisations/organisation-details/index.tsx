import {
    Modal,
    ModalContent,
    Tab,
    Tabs,
} from "@heroui/react";
import {Organisation} from "@/types/organisation.types";
import {Alert} from "@/components/alert/alert"
import {AccountHeader} from "@/components/organisations/organisation-details/AccountHeader";
import {BalanceActions} from "@/components/organisations/organisation-details/BalanceActions";
import {AccountActions} from "@/components/organisations/organisation-details/AccountActions";
import {AccountDetails} from "@/components/organisations/organisation-details/AccountDetails";
import {DeleteConfirmationModal} from "@/components/organisations/organisation-details/DeleteConfirmationModal";
import {Separator} from "@/components/ui/separator";

interface Props {
    isOpen: boolean;
    onOpenChange: () => void;
    organisation: Organisation | null;
}

export const OrganisationDetails = ({isOpen, onOpenChange, organisation}: Props) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
            <ModalContent className="px-2 py-2">
                <AccountHeader organisation={organisation}/>
                <Separator className="my-4"/>
                <Tabs aria-label="Options" color="primary" variant="bordered">
                    <Tab title="Gestion du compte">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <BalanceActions organisation={organisation}/>
                            <AccountActions organisation={organisation}/>
                            <AccountDetails organisation={organisation}/>
                        </div>
                    </Tab>
                    <Tab title="Transactions du compte">

                    </Tab>
                </Tabs>
            </ModalContent>
            <DeleteConfirmationModal organisation={organisation}/>
            <Alert/>
        </Modal>
    );
};
