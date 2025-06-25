import {Card, CardBody} from "@heroui/react";
import React from "react";
import {MoneyReceive02Icon} from 'hugeicons-react'

export const CardBalance2 = ({value}: { value: number }) => {
    return (
        <Card className="bg-white rounded-xl shadow-sm border px-3 w-full">
            <CardBody className="py-5">
                <div className="flex gap-2.5">
                    <MoneyReceive02Icon className="text-emerald-500 "/>
                    <div className="flex flex-row gap-6">
                        <div>
                            <span className="text-emerald-500">Entrées</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2.5 py-2 items-center">
                  <span className="text-default-900 text-2xl font-bold">
                    {value}{" "}<span className=" text-xs font-bold">FCFA</span>
                  </span>
                </div>
            </CardBody>
        </Card>
    );
};
