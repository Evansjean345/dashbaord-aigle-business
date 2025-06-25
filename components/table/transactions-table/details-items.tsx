import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Modal,
    ModalContent,
} from "@heroui/react";
import {CashoutTypeValue, Transaction} from "@/types/transaction.types";
import {useOrganisationStore} from "@/stores/organisationStore";
import React from "react";

interface Props {
    isOpen: boolean;
    onOpenChange: () => void;
    transaction: Transaction;
}

interface DetailItemProps {
    label: string;
    value: React.ReactNode;
}

const DetailItem = ({label, value}: DetailItemProps) => (
    <div>
        <p className="font-medium">{label}</p>
        <p className="text-default-500">{value}</p>
    </div>
);

const getTransactionTypeLabel = (
    transactionType: string,
    category: CashoutTypeValue,
    organisationType: string
): string => {
    if (transactionType === "withdrawal") return "Paiement";

    if (transactionType === "payout") {
        switch (category) {
            case "revenue":
                return organisationType === "marchand" ? "Destockage" : "Transfert";
            case "airtime_commission":
                return "Retrait commission kbine";
            case "airtime_revenue":
                return "Retrait fonds kbine";
            case "revenue_commission":
                return "Retrait commission";
            default:
                return "Transfert";
        }
    }

    return "";
};

export const DetailsItems = ({isOpen, onOpenChange, transaction}: Props) => {
    const activeOrganisation = useOrganisationStore(state => state.organisation)

    return (
        <Modal
            size="2xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            classNames={{
                base: "bg-background/60 backdrop-blur-md",
                wrapper: "pt-10"
            }}
        >
            <ModalContent>
                <Card className="p-6">
                    <CardHeader className="flex justify-between items-center text-xl">
                        Détails de la transaction
                    </CardHeader>

                    <CardBody className="gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="ID"
                                value={transaction.id}
                            />
                            <DetailItem
                                label="TYPE DE TRANSACTION"
                                value={transaction.transactionType === "withdrawal" ? "Paiement" : "Transfert"}
                            />
                            <DetailItem
                                label="MONTANT"
                                value={`${transaction.amount} FCFA`}
                            />
                            <DetailItem
                                label="DEVISE"
                                value={transaction.currency}
                            />
                            <DetailItem
                                label="FRAIS"
                                value={`${parseInt(transaction.transactionFees?.amount || "0", 10)} FCFA`}
                            />
                            <DetailItem
                                label={transaction.transactionType === "withdrawal" ? "MONTANT RECU" : "MONTANT TRANSFERE"}
                                value={`${parseInt(transaction.amount, 10) - parseInt(transaction.transactionFees?.amount || "0", 10)} FCFA`}
                            />
                            <DetailItem
                                label="ID DE L'ORGANISATION"
                                value={transaction.organisationId}
                            />
                            <DetailItem
                                label="METHODE DE PAIEMENT"
                                value={transaction.paymentDetails?.service}
                            />
                            <DetailItem
                                label="OPERATEUR"
                                value={transaction.paymentDetails?.provider}
                            />
                            <DetailItem
                                label="CODE PAYS"
                                value={transaction.paymentDetails?.country_code}
                            />
                            <DetailItem
                                label="NUMERO DE TELEPHONE"
                                value={transaction.paymentDetails?.phone_number}
                            />
                            <DetailItem
                                label="STATUT"
                                value={
                                    transaction.status === "success"
                                        ? "Succès"
                                        : transaction.status === "failed"
                                            ? "Echoué"
                                            : "En attente"
                                }
                            />
                            <DetailItem
                                label="REFERENCE"
                                value={transaction.reference}
                            />
                            <DetailItem
                                label="DESCRIPTION"
                                value={
                                    getTransactionTypeLabel(
                                        transaction.transactionType,
                                        transaction.category,
                                        activeOrganisation.account_type
                                    )
                                }
                            />
                            {transaction.createdAt && (
                                <DetailItem
                                    label="DATE ET HEURE"
                                    value={(() => {
                                        const date = new Date(transaction.createdAt);
                                        return `${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`;
                                    })()}
                                />
                            )}
                        </div>
                    </CardBody>

                    <CardFooter className="justify-end">
                        <Button color="danger" variant="light" onPress={onOpenChange}>
                            Fermer
                        </Button>
                    </CardFooter>
                </Card>
            </ModalContent>
        </Modal>
    );
}
