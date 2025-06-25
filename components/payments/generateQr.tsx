"use client";

import {QRCode} from 'react-qrcode-logo';
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, {useState, useRef} from 'react';
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';
import {QrCodeIcon, QrCode01Icon, MoneySend01Icon} from "hugeicons-react";
import Image from 'next/image';

interface Props {
    qrId: string;
}

export const QrModal = ({qrId}: Props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isDownloading, setIsDownloading] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQR = async () => {
        if (!qrRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(qrRef.current, {
                backgroundColor: 'transparent',
                scale: 2
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `qr-code-${qrId}.png`);
                }
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <Tooltip
                color="primary"
                content={
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">Générer QR Code</div>
                    </div>
                }
            >
                <Button
                    onPress={onOpen}
                    isIconOnly
                    size="sm"
                    color="primary"
                    variant="solid" className="p-2"
                >
                    <QrCodeIcon size={30}/>
                </Button>
            </Tooltip>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                className=''
                placement='center'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Code QR
                            </ModalHeader>
                            <ModalBody>
                                <div
                                    ref={qrRef}
                                    className="p-4 md:p-8 bg-gradient-to-b flex-col gap-4 from-primary-400 to-teal-600  w-full transition border border-indigo-300 rounded-2xl flex items-center"
                                >
                                    <div className='flex flex-col gap-4 items-center'>
                                        <Image width={30} height={30} src={"/img/newLogo.png"}
                                               className='w-32 h-22 rounded-lg' alt=""/>
                                        <h1 className='text-2xl text-center font-bold text-white'>PAYEZ AVEC TOUS LES
                                            RESEAUX *</h1>
                                        <p className=' font-bold text-white text-center mb-2'>SCANNEZ ET PAYEZ</p>
                                    </div>
                                    <QRCode
                                        logoImage='/img/aig-b.png'
                                        removeQrCodeBehindLogo={true}
                                        logoWidth={118}
                                        logoHeight={118}
                                        logoPadding={2}
                                        ecLevel='M'
                                        style={{
                                            height: "auto",
                                            display: "block",
                                            maxWidth: "95%",
                                            width: "95%",
                                            borderRadius: "10px"
                                        }}
                                        size={512}
                                        qrStyle="dots"
                                        eyeRadius={2}
                                        value={qrId}
                                    />
                                    <p className='w-full flex mt-4 items-center text-center justify-center gap-3 font-bold text-base text-white'>
                                        {/* <QrCode01Icon/> */}
                                        *Tous les paiements par mobile money, visa et mastercard sont disponibles
                                    </p>
                                    <p className='w-full flex mt-4 items-center text-center justify-center gap-3 font-bold text-sm text-white'>
                                        {/* <QrCode01Icon/> */}
                                        Contacts : +225 07 00 60 60 79 | +225 07 00 60 60 80
                                    </p>
                                    {/* <div className='flex gap-8 items-center'>
                    <Image width={20} height={20}  src={"img/orange.png"} className='w-16 h-16 rounded-xl' alt="" />
                    <Image width={20} height={20}  src={"img/moov.png"} className='w-16 h-16 rounded-xl object-cover bg-orange-550' alt="" />
                    <Image width={20} height={20}  src={"img/mtn.png"} className='w-16 h-16 rounded-xl' alt="" />
                    <Image width={20} height={20}  src={"img/wave.png"} className='w-16 h-16 rounded-xl' alt="" />
                  </div> */}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    onPress={downloadQR}
                                    isLoading={isDownloading}
                                >
                                    {isDownloading ? "Téléchargement..." : "Télécharger"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
