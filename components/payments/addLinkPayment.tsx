"use client";

import {Button, Tooltip, useDisclosure} from "@heroui/react";
import ModalSendMessage from "../messages/sendMessage";
import React, {useState} from "react";
import {MailSend02Icon} from 'hugeicons-react'

interface Props {
    qrId: string;
}

export const LinkPayment = ({qrId}: Props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <ModalSendMessage
                isOpen={isOpen}
                linkPayment={`${qrId}`}
                onClose={onOpenChange}
            />

            <Tooltip
                color="success"
                content={
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">Partager le lien de paiement via SMS</div>
                    </div>
                }
            >
                <Button
                    onPress={onOpen}
                    isIconOnly
                    size="sm"
                    color="success"
                    variant="solid" className="p-2"
                >
                    <MailSend02Icon size={30}/>
                </Button>
            </Tooltip>
        </>

    )
};
