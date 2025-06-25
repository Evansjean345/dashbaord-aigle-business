"use client";

import { QRCode } from 'react-qrcode-logo';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { QrCodeIcon, QrCode01Icon } from "hugeicons-react";
import Image from 'next/image';

interface Props {
  qrId: string;
}

export const QrModal = ({ qrId }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
          saveAs(blob, `qr-code-airtime-${qrId}.png`);
        }
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        className="dark:text-white"
        onPress={onOpen}
      >
        <QrCodeIcon />
        Générer QR Code Crédit
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        placement='center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Code QR - Achat de Crédit
              </ModalHeader>
              <ModalBody>
                <div
                  ref={qrRef}
                  className="p-4 md:p-8 bg-gradient-to-b flex-col gap-4 from-blue-400 to-blue-600 w-full transition border border-blue-300 rounded-2xl flex items-center"
                >
                  <div className='flex flex-col gap-4 items-center'>
                  <Image width={30} height={30} src={"/img/newLogo.png"} className='w-32 h-22 rounded-lg' alt="" />
                  <h1 className='text-3xl font-bold text-white text-center '>C&apos;EST UNE KBINE</h1>
                    <p className=' font-bold text-white text-center mb-2'>SCANNEZ</p>
                  </div>
                  <QRCode
                    logoImage='/img/aig-b.png'
                    removeQrCodeBehindLogo={true}
                    logoWidth={118}
                    logoHeight={118}
                    logoPadding={2}
                    ecLevel='M'
                    style={{ height: "auto", display: "block", maxWidth: "95%", width: "95%", borderRadius: "10px" }}
                    size={512}
                    qrStyle="dots"
                    eyeRadius={2}
                    // value={`${process.env.NEXT_PUBLIC_MARCHAND_URL}/airtime/${qrId}`}
                    value={qrId}
                  />
                  <p className='w-full text-center flex mt-4 items-center justify-center gap-3 font-bold text-base text-white'>
                    {/* <QrCode01Icon/> */}
                    Rechargez votre compte en crédit d&apos;appel et pass internet tous réseaux mobile*
                  </p>
                  <p className='w-full flex mt-4 items-center text-center justify-center gap-3 font-bold text-sm text-white'>
                    {/* <QrCode01Icon/> */}
                    Contacts : +225 07 00 60 60 79 | +225 07 00 60 60 80
                  </p>
                  {/* <div className='flex gap-8 items-center'>
                    <Image width={20} height={20} src={"img/orange.png"} className='w-16 h-16 rounded-xl' alt="Orange Money" />
                    <Image width={20} height={20} src={"img/moov.png"} className='w-16 h-16 rounded-xl object-cover bg-orange-550' alt="Moov Money" />
                    <Image width={20} height={20} src={"img/mtn.png"} className='w-16 h-16 rounded-xl' alt="MTN Money" />
                    <Image width={20} height={20} src={"img/wave.png"} className='w-16 h-16 rounded-xl' alt="Wave" />
                  </div> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={downloadQR}
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
