"use client";

import { QRCode } from 'react-qrcode-logo';
import { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Card } from "@heroui/react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import Image from 'next/image';

interface QRProps {
  url: string;
  code: string;
}

export const QRGenerator = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);

  const generateAndDownloadQRCodes = async () => {
    setIsDownloading(true);
    const codes = Array.from({ length: quantity }, () => ({
      url: baseUrl,
      code: uuidv4()
    }));

    const formats = [
      { name: 'PVC', width: 540, height: 860 }, // 8.6cm x 5.4cm in pixels
      { name: 'A5', width: 1480, height: 2100 } // 14.8cm x 21cm in pixels
    ];


    const zip = new JSZip();

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    try {
      for (const format of formats) {
        const formatFolder = zip.folder(format.name);

        for (const qr of codes) {
          const qrDiv = document.createElement('div');
          qrDiv.style.width = `${format.width}px`;
          qrDiv.style.height = `${format.height}px`;
          qrDiv.className = "p-4 md:p-8 bg-gradient-to-b flex-col gap-4 from-primary-400 to-teal-600 w-full transition border border-indigo-300 rounded-2xl flex items-center";

          const root = createRoot(qrDiv);
          root.render(
            <div className='flex flex-col gap-4 items-center w-full'>
              <Image width={30} height={30} src={"/img/newLogo.png"} className='w-[30%] rounded-xl' alt="" />
              <h1 className='text-[2em] text-center font-bold text-white'>PAYEZ AVEC TOUS LES RESEAUX *</h1>
              <p className=' font-bold text-white text-center mb-2'>SCANNEZ ET PAYEZ</p>
              <QRCode
                logoImage='/img/aig-b.png'
                removeQrCodeBehindLogo={true}
                logoWidth={118}
                logoHeight={118}
                logoPadding={2}
                ecLevel='M'
                style={{ height: "auto", maxWidth: "95%", width: "95%", borderRadius: "10px" }}
                size={512}
                qrStyle="dots"
                eyeRadius={2}
                value={`${qr.url}/#/${qr.code}`}
              />
              <p className='w-full flex mt-4 items-center text-center justify-center gap-3 font-bold class="text-[clamp(1rem, 2vw, 2rem)] text-white'>
                {/* <QrCode01Icon/> */}
                *Tous les paiements par mobile money, visa et mastercard sont disponibles
              </p>
              <p className='w-full flex mt-4 items-center text-center justify-center gap-3 font-bold class="text-[clamp(1rem, 2vw, 2rem)] text-white'>
                {/* <QrCode01Icon/> */}
                Contacts : +225 07 00 60 60 79 | +225 07 00 60 60 80
              </p>
            </div>
          );

          container.appendChild(qrDiv);

          await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for rendering

          const canvas = await html2canvas(qrDiv, {
            width: format.width,
            height: format.height,
            scale: 1,
            useCORS: true,
            backgroundColor: null,
            windowWidth: format.width,
            windowHeight: format.height
          });

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/png');
          });

          formatFolder?.file(`qr-${qr.code}.png`, blob);

          root.unmount();
          container.removeChild(qrDiv);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "qr-codes-all-formats.zip");
    } finally {
      document.body.removeChild(container);
      setIsDownloading(false);
    }
  };




  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4 flex-wrap flex-row">
        <Input
          type="number"
          label="Nombre de QR codes"
          value={quantity.toString()}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min={1}
        />
        <Input
          type="url"
          label="URL de base"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com"
        />
        <Button
          color="primary"
          isLoading={isDownloading}
          onClick={generateAndDownloadQRCodes}
        >
          Générer et Télécharger
        </Button>
      </div>
    </div>
  );
};

