import {toast} from "sonner";
import {useEffect, useState} from "react";
import {useTransmit} from "@/providers/transmit-context";
import {useOrganisationWallet} from "@/hooks/useOrganisation";
import {Subscription} from "@adonisjs/transmit-client";
import {AirtimeTransaction, Transaction} from "@/types/transaction.types";
import {useAlertStore} from "@/stores/useAlert";
import {useOrganisationStore} from "@/stores/organisationStore";
import {useTransactionCache} from "@/hooks/useTransaction";

const TOAST_DURATION = 5000

export const TransactionsListener = () => {
    const transmit = useTransmit()
    const {refreshOrganisationWallet} = useOrganisationWallet();
    const {updateTransactionFromCache} = useTransactionCache()
    const {organisation} = useOrganisationStore()
    const {closeAlert} = useAlertStore()

    const [messageData, setMessageData] = useState<Transaction | AirtimeTransaction | null>(null);

    useEffect(() => {
        let subscription: Subscription | null
        const setupSuscription = async () => {
            try {
                subscription = transmit.subscription(`/organisation/${organisation.organisation_id}/transaction/webhook`)
                await subscription.create()

                subscription.onMessage(({data}: { data: Transaction | AirtimeTransaction | null }) => {
                    if (data) {
                        setMessageData(data); // Mettez à jour la variable d'état au lieu d'appeler directement refreshOrganisationWallet
                    }
                })

            } catch (error) {
                console.log(error)
            }
        }

        setupSuscription()

        return () => {
            if (subscription) {
                void subscription.delete()
            }
        };
    }, [transmit]);

    // Ajoutez un nouvel effet pour écouter les changements de messageData et appeler refreshOrganisationWallet
    useEffect(() => {
        if (messageData && messageData.status === "success") {
            refreshOrganisationWallet()


            if (messageData.accountType === "kbine") {
                const transaction = messageData as AirtimeTransaction
                toast.success("Achat des Airtime réussi via Smart kbine", {
                    description: `Un airtime d'une valeur de ${messageData.amount} FCFA a été acheté pour le numéro ${transaction?.transactionDetails?.receiveDetails?.phone_number} via ${transaction?.transactionDetails?.senderDetails?.provider}`,
                    duration: TOAST_DURATION
                });
            }

            if (messageData.transactionType === "payout") {
                toast.success("Rétrait des fonds éffectué avec succès")
                updateTransactionFromCache(messageData)
                closeAlert()
            }

            if (messageData.transactionType === "withdrawal" && messageData.accountType === "main") {
                const transaction = messageData as Transaction
                toast.success("Paiement éffectué avec succès", {
                    description: `Un paiement d'une valeur de ${messageData.amount} FCFA a été effectué par le numéro ${transaction?.paymentDetails?.phone_number} via ${transaction?.paymentDetails?.provider.toUpperCase()}`,
                    duration: TOAST_DURATION
                });
            }
        }

        if (messageData && messageData.status === "failed") {
            if (messageData.transactionType === "withdrawal" && messageData.accountType === "main") {
                const transaction = messageData as Transaction
                toast.error("Echec du paiement", {
                    description: `Le paiement d'une valeur de ${messageData.amount} FCFA par le numéro ${transaction?.paymentDetails?.phone_number} via ${transaction?.paymentDetails?.provider.toUpperCase()} a échoué`,
                    duration: TOAST_DURATION
                });

                updateTransactionFromCache(messageData)
            }

            if (messageData.accountType === "kbine") {
                const transaction = messageData as AirtimeTransaction
                toast.error("Echec de l'achat des Airtime Smart kbine", {
                    description: `L'achat des airtimes d'une valeur de ${messageData.amount} FCFA  pour le numéro ${transaction?.transactionDetails?.receiveDetails?.phone_number} via ${transaction?.transactionDetails?.senderDetails?.provider} a échoué`,
                    duration: TOAST_DURATION
                });
            }

            if (messageData.transactionType === "payout") {
                toast.error("Echec du retrait des fonds")
                updateTransactionFromCache(messageData)
                closeAlert()
            }
        }
    }, [messageData]);

    return null;
};
