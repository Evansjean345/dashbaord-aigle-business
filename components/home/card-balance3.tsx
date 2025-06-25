import {Card, CardBody} from "@heroui/react";
import React from "react";
import {MoneySend02Icon} from 'hugeicons-react'
import {useTransaction} from "@/hooks/useTransaction";

export const CardBalance3 = () => {
    const {transactions} = useTransaction();

    const totalTransfers = transactions?.reduce((acc, transaction) => {
        if (transaction.transactionType === "payout" && transaction.status === "success") {
            return acc + transaction.amount;
        }
        return acc;
    }, 0);

    return (
        <Card className="bg-white rounded-xl shadow-sm border px-3 w-full">
            <CardBody className="py-5">
                <div className="flex gap-2.5">
                    <MoneySend02Icon className="text-orange-500 "/>
                    <div className="flex flex-row gap-6">
                        <div>
                            <span className="text-orange-500">Sorties</span>
                        </div>
                        {/* <div>
              <span className=" text-xs p-1 rounded-sm bg-emerald-200 text-emerald-600 flex flex-end">+ 4.5%</span>
            </div> */}
                    </div>
                </div>
                <div className="flex gap-1.5 py-2  items-center">
          <span className="text-default-900 text-2xl font-bold">
            {totalTransfers}{" "}
              <span className=" text-xs font-bold">FCFA</span>
          </span>
                </div>
                {/* <div className="flex items-center gap-6">
          <div>
            <div>
              <span className="font-semibold text-danger text-xs">{"↓"}</span>
              <span className="text-xs">100,930</span>
            </div>
          </div>

          <div>
            <div>
              <span className="font-semibold text-danger text-xs">{"↑"}</span>
              <span className="text-xs">4,120</span>
            </div>
          </div>

          <div>
            <div>
              <span className="font-semibold text-danger text-xs">{"⭐"}</span>
              <span className="text-xs">125</span>
            </div>
          </div>
        </div> */}
            </CardBody>
        </Card>
    );
};
