import Image from "next/image";
import {Transaction} from "@/types/transaction.types";
import {useMemo} from "react";
import {Chip} from "@heroui/react";


const TransactionStatus = ({status}: { status: string }) => {
    const color = status === "success" ? "success" : status === "pending" ? "warning" : "danger"
    const label = status === "pending" ? "en attente" : status === "success" ? "success" : "Echec";

    return <Chip color={color} variant="flat" className="p-0 text-[12px]">
        {label}
    </Chip>
}


export const ActivityCard = ({transactions}: { transactions: Transaction[] }) => {
    const getRelativeDate = useMemo(() => (date: string) => {
        const today = new Date();
        const transactionDate = new Date(date);
        const diffDays = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (diffDays) {
            case 0:
                return "Aujourd'hui";
            case 1:
                return "Hier";
            case 2:
                return "Avant-hier";
            default:
                return transactionDate.toLocaleDateString();
        }
    }, []);

    return (
        <div className="px-2 pb-4">
            <h3 className="text-xl font-semibold mb-4">Activités Récentes</h3>
            <div className="w-full mx-auto divide-y-1 divide-neutral-100 dark:divide-neutral-800">
                {transactions.map((transaction) => (
                    <div key={transaction.reference} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 py-4">
                                {transaction.transactionType === 'airtime' ? (
                                    <Image className="" src={`/img/client.png`} alt="logo" width={30} height={30}/>
                                ) : (
                                    <Image
                                        className="rounded-full overflow"
                                        src={`/img/${transaction.paymentDetails?.provider}.png`} alt="logo"
                                        width={30}
                                        height={30}
                                    />
                                )
                                }
                            </div>
                            <div>
                                <div className="flex font-semibold">
                                    {
                                        transaction.transactionType === 'payout' ? (<><p
                                                className="text-sm">Transfert</p> </>)
                                            : (transaction.transactionType === 'airtime') ? (<><p
                                                    className="text-sm">Crédit airtime</p></>)
                                                : (<><p className="text-sm">Paiement</p></>)
                                    }
                                </div>

                                <TransactionStatus status={transaction.status}/>
                            </div>
                        </div>

                        <div>
                            <p className={`font-semibold flex justify-end items-center gap-2 ${transaction.status === 'failed'
                                ? ' text-danger-500'
                                : transaction.status === 'success'
                                    ? ' text-success-500'
                                    : ' text-warning'
                            }`}>
                                {transaction.transactionType === 'payout' ? '-' : '+'}{transaction.amount} FCFA
                            </p>
                            <p className="text-xs text-default-500">
                                {getRelativeDate(transaction.createdAt)}{" à "}
                                {new Date(transaction.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};