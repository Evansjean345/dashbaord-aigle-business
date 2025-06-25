import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,} from "@heroui/react";
import React, {useState} from "react";
import {useUser} from "@/hooks/useUser";
import {Alert} from "@/components/alert/alert";

export const AddUser = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {createUser, isCreatingUser} = useUser();

    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        password: '',
        country_code: '',
        role: '',
        organisation_id: ''
    });

    const handleSubmit = async () => {
        createUser(formData);
    }

    return (
        <div>
            <>
                <Button onPress={onOpen} color="primary">
                    Ajouter un utilisateur
                </Button>
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement="center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Add User
                                </ModalHeader>
                                <ModalBody>
                                    <Input label="Nom complet" variant="bordered"/>
                                    <Input label="Phone Number" variant="bordered"/>
                                    <Input label="role" variant="bordered"/>
                                    <Input label="Pays" variant="bordered"/>

                                    <Input label="Password" type="password" variant="bordered"/>
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        variant="bordered"
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onClick={onClose}>
                                        fermer
                                    </Button>
                                    <Button color="primary" onPress={onClose}>
                                        Ajouter
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
            <Alert/>
        </div>
    );
};
