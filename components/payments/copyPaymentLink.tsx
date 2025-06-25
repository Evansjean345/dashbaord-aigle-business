"use client";

import {Button, Modal, ModalBody, ModalContent, ModalHeader, Snippet, Tooltip, useDisclosure} from "@heroui/react";
import React from "react";
import {Copy01Icon} from 'hugeicons-react'
import {toast} from "sonner";

interface Props {
    qrId: string;
    label?: string
}

export const CopyPaymentLink = ({qrId, label = 'Copier le lien de paiement'}: Props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const stockToClipboard = () => {
        navigator.clipboard.writeText(qrId);
        toast.success("Lien de paiement copié dans le presse-papier");
    };

    return (
        <>
            <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h3 className="text-xl font-semibold">{label}</h3>
                            </ModalHeader>
                            <ModalBody>
                                <div className="w-full mb-4">
                                    <Snippet
                                        tooltipProps={{
                                            color: "success",
                                            content: label,
                                            disableAnimation: true,
                                            placement: "top",
                                            closeDelay: 0
                                        }}
                                        variant="shadow"
                                        onCopy={stockToClipboard}
                                        color="default"
                                        className=""
                                    >
                                        {qrId}
                                    </Snippet>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Tooltip
                color="default"
                content={
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">{label}</div>
                    </div>
                }
            >
                <Button
                    onPress={onOpen}
                    isIconOnly
                    size="sm"
                    color="default"
                    variant="solid" className="p-2"
                >
                    <Copy01Icon size={30}/>
                </Button>
            </Tooltip>
        </>

    )
};
