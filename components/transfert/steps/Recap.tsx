import Image from "next/image";
import {ArrowRight02Icon} from "hugeicons-react";

interface Props {
    data: Record<string, any>
}

export const Recap = ({data}: Props) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">
                Recapitulatif de la transaction
            </h3>

            <div className="bg-default-100 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                        <Image
                            src={`/img/aig-b.png`}
                            alt="aigle"
                            className="rounded-full"
                            width={40}
                            height={40}
                        />
                        <span className="text-sm">Wallet</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <ArrowRight02Icon className="w-12 h-12 text-primary"/>
                    </div>

                    <div className="flex flex-col items-center">
                        <Image
                            src={`/img/${data.destinationNetwork}.png`}
                            className="rounded-full"
                            width={40}
                            height={40}
                            alt={data.destinationNetwork}
                        />
                        <span className="text-sm mt-1">{data.destinationNumber}</span>
                    </div>
                </div>
            </div>

            <div className="bg-default-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-sm w-1/2">Type de transaction</span>
                    <span className="font-medium text-end">Transfert</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm w-1/2">Montant</span>
                    <span className="font-medium text-end">{`${data.amount} XOF`}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm w-1/2">Frais </span>
                    <span className="font-medium text-end">{`${data?.fees?.feesAmount || 0} XOF`}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm w-1/2">Montant reçu </span>
                    <span className="font-medium text-end">{`${data.fees?.finalAmount || data.amount} XOF`}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm w-1/2">Numéro du bénéficiaire</span>
                    <span className="font-medium text-end">{data.destinationNumber}</span>
                </div>
                <div className="flex justify-between  items-center mt-2">
                    <span className="text-sm w-1/2">Moyen de paiement</span>
                    <span className="font-medium text-end">Mobile Money</span>
                </div>
            </div>
        </div>
    )
}