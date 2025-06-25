import React, {ReactElement} from 'react';
import {Card, CardBody} from "@heroui/react";
import {cn} from "@/lib/utils";

interface Props {
    title: string
    amount: number,
    icon: ReactElement,
    textColor: string,
    isAmount?: boolean,
}


const Widget = ({title, amount, icon, textColor, isAmount = true}: Props) => {
    return (
        <Card className="bg-white dark:bg-background rounded-xl shadow-sm border px-3 w-full">
            <CardBody className="py-5">
                <div className="flex gap-2.5">
                    {icon}
                    <div className="flex flex-row gap-6">
                        <div>
                            <span className={cn(textColor)}>{title}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2.5 py-2 items-center">
                  <span className="text-default-900 text-3xl font-bold">
                      {amount}
                      {isAmount && <span className="text-sm font-bold">FCFA</span>}
                  </span>
                </div>
            </CardBody>
        </Card>
    );
};

export default Widget;