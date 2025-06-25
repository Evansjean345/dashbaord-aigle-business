import {
  Dropdown, Modal, ModalBody, Button, Input, useDisclosure, ModalContent,
  Card, CardBody, CardHeader, CardFooter, Divider
} from "@heroui/react";
import Image from "next/image";
import { PlusSignCircleIcon, MinusSignIcon, SquareLock02Icon, UserAdd01Icon, Delete01Icon } from "hugeicons-react";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  user: {}
}

export const DetailsItems = ({ isOpen, onOpenChange, user }: Props) => {
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const iconClasses = "w-5 h-5 text-white text-default-500 pointer-events-none flex-shrink-0";
  return (
    <Modal
      size="4xl"
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
            <div className="flex items-center gap-4">
              <Image width={16} height={16} src="/img/aig-b.png" alt="Logo" className="w-16 h-16" />
              <div>
                <h2 className="text-2xl font-bold">Nom de l&apos;organisation</h2>
                <p className="text-default-500">ID: #123456</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl">Solde actuel</h3>
              <p className="text-2xl font-bold text-success">4,642 FCFA</p>
            </div>
          </CardHeader>

          <Divider className="my-4" />

          <CardBody className="gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Gestion du solde</h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    label="Montant"
                    placeholder="Entrez le montant"
                    startContent={<span>FCFA</span>}
                  />
                  <Button color="success" >
                    <PlusSignCircleIcon className={iconClasses} />
                    Ajouter
                  </Button>
                  <Button color="danger" >
                    <MinusSignIcon className={iconClasses} />
                    Retirer
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">Actions</h4>
                <div className="flex gap-2">
                  <Button color="warning" >
                    <SquareLock02Icon className={iconClasses} />
                    Bloquer
                  </Button>
                  <Button color="primary" >
                    <UserAdd01Icon className={iconClasses} />
                    Ajouter membre
                  </Button>
                  <Button
                    color="danger"
                    onPress={onAlertOpen}
                  >
                    <Delete01Icon className={iconClasses} />
                    Supprimer
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-4">Informations détaillées</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-default-500">Email</p>
                  <p className="font-medium">organisation@example.com</p>
                </div>
                <div>
                  <p className="text-default-500">Téléphone</p>
                  <p className="font-medium">+225 0123456789</p>
                </div>
                <div>
                  <p className="text-default-500">Statut</p>
                  <p className="font-medium text-success">Actif</p>
                </div>
                <div>
                  <p className="text-default-500">Membres</p>
                  <p className="font-medium">12 personnes</p>
                </div>
              </div>
            </Card>
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
