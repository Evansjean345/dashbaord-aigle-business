import {
  Modal, ModalBody, Button, useDisclosure, ModalContent,
  Card, CardBody, CardHeader, CardFooter
} from "@heroui/react";
import { Transaction } from "@/types/airtimes.types";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  transaction: Transaction;
}

export const DetailsItems = ({ isOpen, onOpenChange, transaction }: Props) => {

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      classNames={{
        base: "bg-background/60 backdrop-blur-md",
        wrapper: "p-0"
      }}
    >
      <ModalContent>
        <Card className="p-6">
          <CardHeader className="flex justify-between items-center">
            Détails de la transaction
          </CardHeader>

          <CardBody className="gap-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium ">TYPE DE TRANSACTION</p>
                <p className="text-default-500">{transaction?.transactionDetails?.receiveDetails?.service === "airtime" ? "Achat de credit" : "Achat d'internet"}</p>
              </div>
              <div>
                <p className="font-medium ">MONTANT</p>
                <p className="text-default-500 ">{`${transaction?.amount} FCFA`}</p>
              </div>
              <div>
                <p className="font-medium ">FRAIS</p>
                <p className="text-default-500 ">{`${Number.parseInt(transaction?.transactionFees?.amount)} FCFA`}</p>
              </div>
              <div>
                <p className="font-medium ">DEVISE</p>
                <p className="text-default-500">{transaction?.currency}</p>
              </div>
              <div>
                <p className="font-medium ">ID DE L&apos;ORGANISATION</p>
                <p className="text-default-500">{transaction?.organisationId}</p>
              </div>
              <div>
                <p className="font-medium ">METHODE DE PAIEMENT</p>
                <p className="text-default-500">{transaction?.transactionDetails?.senderDetails?.service === "mobile-money" ? "Mobile money" : " Aigle"}</p>
              </div>
              {
                transaction?.transactionDetails?.senderDetails?.service === "mobile-money" &&
                (
                  <>
                    <div>
                      <p className="font-medium ">OPERATEUR</p>
                      <p className="text-default-500">{transaction?.transactionDetails?.senderDetails?.provider}</p>
                    </div>
                    <div>
                      <p className="font-medium ">TELEPHONE DEBITER</p>
                      <p className="text-default-500">{transaction?.transactionDetails?.senderDetails?.phone_number}</p>
                    </div>
                  </>
                )

              }
              <div>
                <p className="font-medium ">CODE PAYS</p>
                <p className="text-default-500">{transaction?.transactionDetails?.receiveDetails?.country_code}</p>
              </div>
              <div>
                <p className="font-medium ">TELEPHONE DU BENEFICIAIRE</p>
                <p className="text-default-500">{transaction?.transactionDetails?.receiveDetails?.phone_number}</p>
              </div>
              <div>
                <p className="font-medium ">RESEAU</p>
                <p className="text-default-500">{transaction?.transactionDetails?.receiveDetails?.provider}</p>
              </div>
              <div>
                <p className="font-medium ">STATUT</p>
                <p className="text-default-500">{transaction?.status === "success" ? "Succès" : transaction?.status === "failed" ? "Echoué" : "En attente"}</p>
              </div>
              <div>
                <p className="font-medium ">REFERENCE</p>
                <p className="text-default-500">{transaction?.reference}</p>
              </div>
              <div>
                <p className="font-medium ">DESCRIPTION</p>
                <p className="text-default-500">{transaction?.description}</p>
              </div>
              <div>
                <p className="font-medium ">DATE ET HEURE</p>
                <p className="text-default-500">{new Date(transaction?.createdAt).toLocaleDateString()} à  {new Date(transaction?.createdAt).toLocaleTimeString()} </p>
              </div>
            </div>
          </CardBody>

          <CardFooter className="justify-end pt-6">
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Fermer
            </Button>
          </CardFooter>

        </Card>
      </ModalContent>

      <Modal isOpen={isAlertOpen} onOpenChange={onAlertClose} size="sm">
        <ModalContent>
          <ModalBody>
            <h4 className="text-xl font-bold mb-2">Confirmer la suppression</h4>
            <p className="mb-4">Cette action est irréversible. Voulez-vous vraiment supprimer cette organisation ?</p>
            <div className="flex gap-2 justify-end">
              <Button color="default" variant="light" onPress={onAlertClose}>
                Annuler
              </Button>
              <Button color="danger" onPress={onAlertClose}>
                Confirmer
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Modal>
  );
}
