import React from 'react';
import {Operators} from "@/types/airtimes.types";
import Image from "next/image";

interface Props {
    operator: Operators
}

const OperatorImage = ({operator}: Props) => {
    const logoUrl = operator?.logo_urls?.[0] || 'https://placehold.co/100x100/000000/FFFFFF/png?text=Logo%20operateur';
    const operatorName = operator?.operator || "Logo operateur"
    return (
        <Image
            src={logoUrl}
            alt={operatorName}
            width={40}
            height={40}
            className="mb-2 rounded"
        />
    );
};

export default OperatorImage;