import React from 'react';
import {Card, CardBody} from "@heroui/react";

interface Props {
    purchaseTypes: any[],
    purchaseType: string,
    handleSelected: (purchaseTypeId: string) => void,
}

export const PurchaseType = ({purchaseTypes, purchaseType, handleSelected}: Props) => {

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Type de transaction</h3>
            <div className="grid grid-cols-2 gap-4">
                {purchaseTypes?.map((type) => (
                    <Card
                        key={type.id}
                        isPressable
                        onPress={() => handleSelected(type.id)}
                        className={`border-2 ${purchaseType === type.id ? 'border-primary bg-primary-100' : 'border-transparent'}`}
                    >
                        <CardBody className="flex text-center flex-col items-center p-4">
                            <span className="text-3xl mb-2">{type.icon}</span>
                            <span className="text-sm font-medium">{type.name}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};