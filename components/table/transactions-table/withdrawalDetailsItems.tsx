import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    useDisclosure
} from "@heroui/react";
import {Transaction} from "@/types/transaction.types";
import {useOrganisationStore} from "@/stores/organisationStore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";

interface Props {
    isOpen: boolean;
    onOpenChange: () => void;
    transaction: Transaction;
}

export const WithdrawalDetailsItems = ({isOpen, onOpenChange, transaction}: Props) => {
    const {isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose} = useDisclosure();
    const activeOrganisation = useOrganisationStore(state => state.organisation)

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[650px] h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Détails de la transaction</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[95vh] pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium ">TYPE DE TRANSACTION</p>
                                <p className="text-default-500">{transaction?.transactionType === "withdrawal" ? "Encaissement" : "Transfert"}</p>
                            </div>
                            <div>
                                <p className="font-medium ">REFERENCE</p>
                                <p className="text-default-500">{transaction?.reference}</p>
                            </div>
                            <div>
                                <p className="font-medium ">MONTANT</p>
                                <p className="text-default-500 ">{transaction?.amount + " FCFA"}</p>
                            </div>
                            <div>
                                <p className="font-medium ">DEVISE</p>
                                <p className="text-default-500">{transaction?.currency}</p>
                            </div>
                            <div>
                                <p className="font-medium">FRAIS</p>
                                <p className="text-default-500">{`${Number.parseInt(transaction?.transactionFees?.amount) || 0} FCFA`} </p>
                            </div>
                            <div>
                                <p className="font-medium">
                                    {transaction.transactionType == "withdrawal" ? "MONTANT RECU" : "MONTENT TRANSFERE"}
                                </p>
                                <p className="text-default-500">
                                    {`${transaction?.amount} FCFA`}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium ">METHODE DE PAIEMENT</p>
                                <p className="text-default-500">{transaction?.paymentDetails?.service}</p>
                            </div>
                            <div>
                                <p className="font-medium ">OPERATEUR</p>
                                <p className="text-default-500">{transaction?.paymentDetails?.provider}</p>
                            </div>
                            <div>
                                <p className="font-medium ">CODE PAYS</p>
                                <p className="text-default-500">{transaction?.paymentDetails?.country_code}</p>
                            </div>
                            <div>
                                <p className="font-medium ">NUMERO DE TELEPHONE</p>
                                <p className="text-default-500">{transaction?.paymentDetails?.phone_number}</p>
                            </div>
                            <div>
                                <p className="font-medium ">STATUT</p>
                                <p className="text-default-500">{transaction?.status === "success" ? "Succès" : transaction?.status === "failed" ? "Echoué" : "En attente"}</p>
                            </div>

                            <div>
                                <p className="font-medium ">DESCRIPTION</p>
                                <p className="text-default-500">
                                    {activeOrganisation.account_type === "school" ? "Règlement scolaire" : "Encaissement"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium ">DATE ET HEURE</p>
                                <p className="text-default-500">{new Date(transaction?.createdAt).toLocaleDateString()} à {new Date(transaction?.createdAt).toLocaleTimeString()}</p>
                            </div>

                            {/* School transaction details */}
                            {activeOrganisation.account_type === "school" && transaction?.transactionSchoolDetails && (
                                <>
                                    <div className="col-span-2 mt-4">
                                        <p className="font-medium text-lg">DÉTAILS DE L&apos;ÉlÈVE</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">NOM</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.firstname}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">PRÉNOM</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.lastname}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">NUMERO MATRICULE</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.matricule}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">CLASSE</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.classe}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">VILLE</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.city}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">TÉLÉPHONE</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">MOTIF</p>
                                        <p className="text-default-500">{transaction.transactionSchoolDetails.purpose.libelle}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={isAlertOpen} onOpenChange={onAlertClose}>
                <DialogContent className="sm:max-w-[425px] max-h-[95vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold mb-2">Confirmer la suppression</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="overflow-y-auto">
                        <p className="mb-4">Cette action est irréversible. Voulez-vous vraiment supprimer cette
                            organisation ?</p>
                    </ScrollArea>
                    <DialogFooter className="flex gap-2 justify-end">
                        <Button color="default" variant="light" onPress={onAlertClose}>
                            Annuler
                        </Button>
                        <Button color="danger" onPress={onAlertClose}>
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}