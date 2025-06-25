'use client'

import { Button, Modal, ModalBody, Input } from "@heroui/react";
import { Snippet } from "@heroui/react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { QrCode } from "./qr";
import { useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import ModalSendMessage from "../messages/sendMessage";
import { Home13Icon, QrCodeIcon } from "hugeicons-react";
import Link from "next/link";
import { AmountState } from "../amount-state/amount";
import {useAuth} from '@/hooks/useAuth'


export const QRCodeLayout = () => {
  const {profile} = useAuth();
  const qrId = profile?.qr_code.code;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const refQRCode = useRef<any>();

  const handleDownload = () => {
    refQRCode.current?.download("png", "QRCode_Wow");
  };

  const stockToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_MARCHAND_URL}/${qrId}`
    );
    toast.success("Lien de paiement copié dans le presse-papier");
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs variant="light">
        <BreadcrumbItem startContent={<Home13Icon />}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
        <BreadcrumbItem startContent={<QrCodeIcon />}>Qr code</BreadcrumbItem>
      </Breadcrumbs>

      <Toaster />

      {isModalOpen && (
        <ModalSendMessage
          isOpen={isModalOpen}
          linkPayment={`${process.env.NEXT_PUBLIC_MARCHAND_URL}/${qrId}`}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="w-full gap-10 md:flex">
        <div className="w-full md:w-3/5 lg:w-2/5 sm:  mt-5 flex">
          <QrCode qrId={qrId} refQRCode={refQRCode} />
        </div>

        <div className="md:w-2/5 lg:w-3/5 mt-5 w-full">
          <div className="my-2 w-full">
            <p>Lien actuel vers le paiement : </p>

            {/* <Input
        fullWidth
        isReadOnly
        value={`https://marchand.aigle.mobiletransaction4africa.tech/#/${qrId}`}
        variant="bordered"
      /> */}
            <Snippet
              tooltipProps={{
                color: "success",
                content: "Copier le lien de paiemendent ",
                disableAnimation: true,
                placement: "top",
                closeDelay: 0
              }}
              variant="shadow"
              onCopy={stockToClipboard}
              color="default"
            >
              {`${process.env.NEXT_PUBLIC_MARCHAND_URL}/${qrId}`}
            </Snippet>
          </div>

          <div className="mt-7 gap-3 grid grid-cols-2 md:grid-cols-1">
            <Button
              color="primary"
              onClick={handleDownload}
            >
              Télécharger le code QR
            </Button>
            <Button
              color="secondary"
              onClick={stockToClipboard}
            >
              Copier le lien de paiement
            </Button>
            <Button
              color="success"
              variant="shadow"
              onClick={() => setIsModalOpen(true)}
            >
              Partager le lien via SMS
            </Button>
          </div>
        </div>
      </div>
    </div>

  );
}
