import {
    Button,
    Modal, ModalBody,
    ModalContent, ModalFooter, ModalHeader,
} from "@heroui/react";
import React, {useState} from "react";
import {InputOtp} from "@heroui/input-otp";
import {useOrganisationSetCodePin} from "@/hooks/useOrganisation";
import {toast} from "sonner";
import {useAlertStore} from "@/stores/useAlert";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    codePinUpdate: () => void;
    organisationId: string;
}

export const AccountPinModal = ({organisationId, isOpen, onClose, codePinUpdate}: Props) => {
    const {setCodePin, isCodePinSet} = useOrganisationSetCodePin()
    const showAlert = useAlertStore(state => state.showAlert)
    const [formData, setFormData] = React.useState({
        password: '',
        organisationId: organisationId
    })
    const [formErrors, setFormErrors] = useState(null)

    const handleSubmit = async () => {
        if (!formData.password || formData.password.length !== 6) {
            setFormErrors(prev => ({...prev, password: "Veuillez entrer un code PIN de 6 chiffres"}))
            return;
        }

        setCodePin(formData, {
            onSuccess: () => {
                toast.success("Le code pin a été défini avec succès")
                codePinUpdate()
                onClose()
            },
            onError: (error) => {
                if (error.response.status === 422) {
                    const errorArray = error?.response?.data;
                    const fieldErrors = errorArray.reduce((acc, err) => {
                        acc[err.field] = err.message;
                        return acc;
                    }, {} as Record<string, string>);

                    setFormErrors(fieldErrors);
                } else {
                    showAlert("Une erreur est survenue", "error")
                }
            },
        })
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="lg" placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1 className="font-medium text-gray-900 dark:text-foreground-600">Définissez un code PIN
                        sécurisé</h1>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <div className="w-full mx-auto">
                            <InputOtp
                                length={6}
                                value={formData.password}
                                onValueChange={(value) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        password: value,
                                    }))
                                    setFormErrors(prev => ({...prev, password: null}))
                                }}/>

                            {formErrors?.password &&
                                <span className="text-danger font-semibold">{formErrors?.password}</span>}
                        </div>

                        <p className="text-sm mt-1 text-gray-600 dark:text-foreground-600">
                            Ce code PIN vous permet de sécuriser et de valider chacun de vos
                            transferts réalisés via l'application. Veuillez ne pas le communiquer
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isDisabled={isCodePinSet}
                        color="primary"
                        onPress={handleSubmit}
                        isLoading={isCodePinSet}
                    >
                        Enregistrer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}