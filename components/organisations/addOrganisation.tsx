import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,} from "@heroui/react";
import {useState} from "react";
import {useCreateOrganisation} from "@/hooks/useOrganisation";
import {Alert} from "@/components/alert/alert";
import {useOrganisationStore} from "@/stores/organisationStore";
import {useAlertStore} from "@/stores/useAlert";

const initialValue = (parent_id: string) => {
    return {
        parent_id,
        company_name: '',
        company_phone_number: ''
    }
}

export const AddOrganisation = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation);
    const showAlert = useAlertStore(state => state.showAlert)

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {createOrganisation, isCreatingOrganisation} = useCreateOrganisation();

    const [formData, setFormData] = useState(initialValue(activeOrganisation?.organisation_id));
    const [formErrors, setFormErrors] = useState(null)

    const handleSubmit = async () => {
        showAlert("Création du compte professionnel en cours...", "loading")

        createOrganisation(formData, {
            onSuccess: (data) => {
                setTimeout(() => resetModal(), 1500)
            },
            onError: (error) => {
                const errorArray = error?.response?.data;
                const fieldErrors = errorArray.reduce((acc, err) => {
                    acc[err.field] = err.message;
                    return acc;
                }, {} as Record<string, string>);

                setFormErrors(fieldErrors);
            }
        });
    };

    const resetModal = () => {
        setFormData(initialValue(activeOrganisation?.organisation_id))
        onOpenChange()
    }

    return (
        <div>
            <Button onPress={onOpen} color="primary">
                Nouveau compte professionnel
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Compte professionnel
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
                                    <Input
                                        label="Nom du compte proféssionnel"
                                        variant="bordered"
                                        value={formData.company_name}
                                        onChange={(e) => {
                                            setFormData(prev => ({...prev, company_name: e.target.value}))
                                            setFormErrors(prev => ({...prev, company_name: null}))
                                        }}
                                        errorMessage={formErrors?.company_name}
                                        isInvalid={!!formErrors?.company_name}
                                    />
                                    <Input
                                        label="Numéro du compte professoinnel"
                                        variant="bordered"
                                        value={formData.company_phone_number}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                company_phone_number: e.target.value
                                            }))
                                            setFormErrors(prev => ({...prev, company_phone_number: null}))
                                        }}
                                        errorMessage={formErrors?.company_phone_number}
                                        isInvalid={!!formErrors?.company_phone_number}
                                    />
                                </div>

                                {/*<div className="w-full h-0.5 bg-neutral-100 dark:bg-neutral-800 my-1.5"></div>*/}

                                {/*<div>*/}
                                {/*    <div className="mb-2 space-y-2">*/}
                                {/*        <label className="font-medium text-gray-900 dark:text-foreground-600">Définissez*/}
                                {/*            un code PIN sécurisé</label>*/}
                                {/*    </div>*/}

                                {/*    <div className="w-full mx-auto">*/}
                                {/*        <InputOtp*/}
                                {/*            length={6}*/}
                                {/*            value={formData.password}*/}
                                {/*            onValueChange={(value) => {*/}
                                {/*                setFormData(prev => ({*/}
                                {/*                    ...prev,*/}
                                {/*                    password: value,*/}
                                {/*                }))*/}
                                {/*                setFormErrors(prev => ({...prev, password: null}))*/}
                                {/*            }}/>*/}

                                {/*        {formErrors?.password && (*/}
                                {/*            <span className="text-danger fo nt-semibold">{formErrors?.password}</span>*/}
                                {/*        )}*/}
                                {/*    </div>*/}

                                {/*    <p className="text-sm mt-1 text-gray-600 dark:text-foreground-600">*/}
                                {/*        Ce code PIN vous permet de sécuriser et de valider chacun de vos*/}
                                {/*        transferts réalisés via l'application. Veuillez ne pas le communiquer*/}
                                {/*    </p>*/}
                                {/*</div>*/}

                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    isLoading={isCreatingOrganisation}
                                    onPress={handleSubmit}
                                >
                                    Créer le compte
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Alert/>
        </div>
    );
};
