"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Card,
  CardBody,
} from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight02Icon } from "hugeicons-react"
import {MoneyAdd02Icon,ReverseWithdrawal02Icon,WalletAdd02Icon,CircleArrowDataTransferHorizontalIcon} from "hugeicons-react"
const networks = [
  { id: "mtn", name: "MTN Money", icon: "/img/mtn.png" },
  { id: "orange", name: "Orange Money", icon: "/img/orange.png" },
  { id: "moov", name: "Moov Money", icon: "/img/moov.png" },
  { id: "wave", name: "Wave", icon: "/img/wave.png" },
  // { id: "aigle", name: "Aigle Send", icon: "/img/aigle.png"}
];

const OPERATION_TYPES = [
  { id: 'transfer', name: 'Transfert', icon: <CircleArrowDataTransferHorizontalIcon/> },
  { id: 'deposit', name: 'Dépôt', icon: <WalletAdd02Icon/> },
  { id: 'withdrawal', name: 'Retrait', icon: <ReverseWithdrawal02Icon/> }
];

export const MobileTransfert = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    operationType: "",
    sourceNetwork: "",
    sourceNumber: "",
    destinationNetwork: "",
    destinationNumber: "",
    amount: "",
  });

  const totalSteps = formData.operationType === 'transfer' ? 6 : 4;

  const handleNetworkSelect = (network: string, type: 'source' | 'destination') => {
    setFormData(prev => ({
      ...prev,
      [type === 'source' ? 'sourceNetwork' : 'destinationNetwork']: network
    }));
  };

  const renderOperationTypeStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Type d&apos;opération</h3>
      <div className="grid grid-cols-3 gap-4">
        {OPERATION_TYPES.map((operation) => (
          <Card
            key={operation.id}
            isPressable
            onPress={() => {
              setFormData(prev => ({
                ...prev,
                operationType: operation.id
              }));
            }}
            className={`border-2 ${
              formData.operationType === operation.id ? 'border-emerald-500 bg-emerald-200' : 'border-transparent'
            }`}
          >
            <CardBody className="flex flex-col items-center p-4">
              <span className="text-3xl mb-2">{operation.icon}</span>
              <span className="text-sm font-medium">{operation.name}</span>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderOperationTypeStep();

      case 2:
        if (formData.operationType === 'deposit') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Choisissez le réseau destinataire</h3>
              <div className="grid grid-cols-2 gap-4">
                {networks.map((network) => (
                  <Card
                    key={network.id}
                    isPressable
                    onPress={() => handleNetworkSelect(network.id, 'destination')}
                    className={`border-2 ${
                      formData.destinationNetwork === network.id ? 'border-emerald-500 bg-emerald-200' : 'border-transparent'
                    }`}
                  >
                    <CardBody className="flex flex-col items-center p-4">
                      <Image
                        src={network.icon}
                        alt={network.name}
                        width={40}
                        height={40}
                        className="mb-2"
                      />
                      <span className="text-sm font-medium">{network.name}</span>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          );
        }
        if (formData.operationType === 'withdrawal') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Choisissez le réseau à débiter</h3>
              <div className="grid grid-cols-2 gap-4">
                {networks.map((network) => (
                  <Card
                    key={network.id}
                    isPressable
                    onPress={() => handleNetworkSelect(network.id, 'source')}
                    className={`border-2 ${
                      formData.sourceNetwork === network.id ? 'border-emerald-500 bg-emerald-200' : 'border-transparent'
                    }`}
                  >
                    <CardBody className="flex flex-col items-center p-4">
                      <Image
                        src={network.icon}
                        alt={network.name}
                        width={40}
                        height={40}
                        className="mb-2"
                      />
                      <span className="text-sm font-medium">{network.name}</span>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Choisissez le réseau à débiter</h3>
            <div className="grid grid-cols-2 gap-4">
              {networks.map((network) => (
                <Card
                  key={network.id}
                  isPressable
                  onPress={() => handleNetworkSelect(network.id, 'source')}
                  className={`border-2 ${formData.sourceNetwork === network.id ? 'border-emerald-500 bg-emerald-200' : 'border-transparent'
                    }`}
                >
                  <CardBody className="flex flex-col items-center p-4">
                    <Image
                      src={network.icon}
                      alt={network.name}
                      width={40}
                      height={40}
                      className="mb-2 rounded-md"
                    />
                    <span className="text-sm font-medium">{network.name}</span>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        if (formData.operationType === 'deposit') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Numéro destinataire</h3>
              <Input
                label="Numéro du bénéficiaire"
                placeholder="Ex: 0700000000"
                value={formData.destinationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, destinationNumber: e.target.value }))}
                variant="bordered"
              />
            </div>
          );
        }
        if (formData.operationType === 'withdrawal') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Numéro à débiter</h3>
              <Input
                label="Votre numéro"
                placeholder="Ex: 0700000000"
                value={formData.sourceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceNumber: e.target.value }))}
                variant="bordered"
              />
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Numéro à débiter</h3>
            <Input
              label="Numéro à débiter"
              placeholder="Ex: 0700000000"
              value={formData.sourceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceNumber: e.target.value }))}
              variant="bordered"
            />
          </div>
        );

      case 4:
        if (formData.operationType === 'deposit' || formData.operationType === 'withdrawal') {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">{formData.operationType === 'deposit' ? `Dépot ${formData.destinationNetwork}` : `Retrait ${formData.sourceNetwork}`}</h3>
              
              <div className="bg-default-100 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <Image
                      src={`/img/${formData.operationType === 'deposit' ? formData.destinationNetwork : formData.sourceNetwork}.png`}
                      alt="Network"
                      width={40}
                      height={40}
                    />
                    <span className="text-sm mt-1">
                      {formData.operationType === 'deposit' ? formData.destinationNumber : formData.sourceNumber}
                    </span>
                  </div>
                </div>
              </div>

              <Input
                label="Montant"
                placeholder="Ex: 5000"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                variant="bordered"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">FCFA</span>
                  </div>
                }
              />

              <div className="bg-success-50 p-4 rounded-lg">
                <p className="text-success text-sm">
                  {formData.operationType === 'deposit' ? "Montant à déposer" : "Montant à retirer"}:{' '}
                  <span className="font-bold">{formData.amount} FCFA</span>
                </p>
                <p className="text-tiny text-success-600 mt-1">
                  *Frais de transaction inclus
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Choisissez le réseau destinataire</h3>
            <div className="grid grid-cols-2 gap-4">
              {networks.map((network) => (
                <Card
                  key={network.id}
                  isPressable
                  onPress={() => handleNetworkSelect(network.id, 'destination')}
                  className={`border-2 ${formData.destinationNetwork === network.id ? 'border-emerald-500 bg-emerald-200' : 'border-transparent'
                    }`}
                >
                  <CardBody className="flex flex-col items-center p-4">
                    <Image
                      src={network.icon}
                      alt={network.name}
                      width={40}
                      height={40}
                      className="mb-2"
                    />
                    <span className="text-sm font-medium">{network.name}</span>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Numéro destinataire</h3>
            <Input
              label="Numéro receveur"
              placeholder="Ex: 0700000000"
              value={formData.destinationNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, destinationNumber: e.target.value }))}
              variant="bordered"
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Transfert de {formData.sourceNetwork} vers {formData.destinationNetwork}</h3>

            <div className="bg-default-100 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <Image
                    src={`/img/${formData.sourceNetwork}.png`}
                    alt={formData.sourceNetwork}
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                  <span className="text-sm mt-1">{formData.sourceNumber}</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <ArrowRight02Icon />
                </div>

                <div className="flex flex-col items-center">
                  <Image
                    src={`/img/${formData.destinationNetwork}.png`}
                    alt={formData.destinationNetwork}
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                  <span className="text-sm mt-1">{formData.destinationNumber}</span>
                </div>
              </div>
            </div>


            <Input
              label="Montant à envoyer"
              placeholder="Ex: 5000"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              variant="bordered"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">FCFA</span>
                </div>
              }
            />

            <div className="bg-success-50 p-4 rounded-lg">
              <p className="text-success text-sm">
                Le destinataire recevra: <span className="font-bold">{parseInt(formData.amount) * 0.99} FCFA</span>
              </p>
              <p className="text-tiny text-success-600 mt-1">
                *Frais de transaction de 1% appliqués
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        <MoneyAdd02Icon/>
        Faire une transaction
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Transaction Mobile Money</h2>
                <div className="flex justify-between w-full mt-4">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 mx-1 rounded-full ${
                        index + 1 <= step ? 'bg-primary' : 'bg-default-100'
                      }`}
                    />
                  ))}
                </div>
              </ModalHeader>
              <ModalBody>
                {renderStep()}
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button
                  variant="light"
                  onPress={() => step > 1 && setStep(step - 1)}
                  isDisabled={step === 1}
                >
                  Retour
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (step < totalSteps) {
                      setStep(step + 1);
                    } else {
                      // Handle transaction submission
                      onClose();
                    }
                  }}
                >
                  {step === totalSteps ? "Confirmer" : "Suivant"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
