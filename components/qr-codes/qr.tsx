import { QRCode } from 'react-qrcode-logo';

interface Props {
  qrId: String;
  refQRCode: React.RefObject<QRCode>;
}
export const QrCode = ({ qrId, refQRCode }: Props) => {
  return (
    <div className="p-4 md:p-8 bg-white w-full transition border border-indigo-300 rounded-2xl flex items-center">
      <QRCode
        ref={refQRCode} 
        logoImage='/img/aig-b.png'
        removeQrCodeBehindLogo={true}
        logoWidth={108}
        logoHeight={108}
        logoPadding={2}
        ecLevel='M'
        style={{ height: "auto", display: "block", maxWidth: "100%", width: "100%" }}
        size={512}
        qrStyle="dots"  
        eyeRadius={2}  
        value={`${process.env.NEXT_PUBLIC_MARCHAND_URL}/${qrId}`}
      />
    </div>

  );
};