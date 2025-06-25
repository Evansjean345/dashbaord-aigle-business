import {
  Modal, ModalBody, Button, useDisclosure, ModalContent,
  Card, CardBody, CardHeader, CardFooter
} from "@heroui/react";
import { Supply } from "@/types/supply.types";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  supply: Supply;
}

export const DetailsItems = ({ isOpen, onOpenChange, supply }: Props) => {

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
            Détails de la demande d&apos;approvisionnement
          </CardHeader>

          <CardBody className="gap-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium ">ID</p>
                <p className="text-default-500">{supply?.id}</p>
              </div>
              <div>
                <p className="font-medium ">TYPE D&apos;APPROVISIONNEMENT</p>
                <p className="text-default-500">{supply?.provisionType === "airtime" ? "Cabine intelligente" : "Compte principale"}</p>
              </div>
              <div>
                <p className="font-medium ">MONTANT</p>
                <p className="text-default-500 ">{supply?.amount}</p>
              </div>
              <div>
                <p className="font-medium ">ID DE L&apos;ORGANISATION</p>
                <p className="text-default-500">{supply?.organisationId}</p>
              </div>
              <div>
                <p className="font-medium ">METHODE DE PAIEMENT</p>
                <p className="text-default-500">{supply?.paymentProvider?.type}</p>
              </div>
              <div>
                <p className="font-medium ">OPERATEUR</p>
                <p className="text-default-500">{supply?.paymentProvider?.label}</p>
              </div>
              <div>
                <p className="font-medium ">NUMERO DU COMPTE</p>
                <p className="text-default-500">{supply?.paymentProvider?.number}</p>
              </div>
              <div>
                <p className="font-medium ">STATUT</p>
                <p className="text-default-500">{supply?.status === "success" ? "Succès" : supply?.status === "failed" ? "Echoué" : "En attente"}</p>
              </div>
              <div>
                <p className="font-medium ">PREUVE DE PAIEMENT</p>
                <p className="text-primary-500"><a target="_blank" href={supply?.documentUrl || "/"} >lien vers la preuve de paiement</a></p>
              </div>
              <div>
                <p className="font-medium ">DATE ET HEURE</p>
                <p className="text-default-500">{new Date(supply?.createdAt).toLocaleDateString()} à {new Date(supply?.createdAt).toLocaleTimeString()}</p>
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
