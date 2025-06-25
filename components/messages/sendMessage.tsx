import { useState } from "react";
import { Modal, Button, Textarea, ModalBody, ModalHeader, ModalContent, ModalFooter, Input, Spinner, useDisclosure } from "@heroui/react";
import PhoneInput from 'react-phone-number-input';
import { Toaster, toast } from "sonner";
import "react-phone-number-input/style.css";
import { SMSService } from "../../services/sms.service";

interface Props {
  isOpen: boolean;
  linkPayment: string;
  onClose: () => void;
}

export default function ModalSendMessage({ isOpen, linkPayment, onClose }: Props) {
  const [textAttach, setTextAttach] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendPaymentLink = async () => {
    const result = await SMSService.sendSMS({
      phone: phoneNumber,
      message: `${textAttach}\n${linkPayment}`
    });
    if (result) {
      onClose();
      toast.success(`Message envoyé avec succès`);
    }
  };

  return (
    <>

      <Modal size="sm" isOpen={isOpen} onClose={onClose} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Partager le lien via SMS</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <PhoneInput
                    defaultCountry="CI"
                    placeholder="Entrez le numero receptionniste"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || "")}
                    className="w-full border-2 border-gray-400 rounded-md p-2"
                  />

                  <Textarea
                    minRows={7}
                    placeholder="Configurer le message rattaché à l'envoi du sms"
                    value={textAttach}
                    onChange={(e) => setTextAttach(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  fermer
                </Button>
                <Button
                  color="primary"
                  onClick={sendPaymentLink}
                  isDisabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    'Envoyer SMS'
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </>
  );
}
