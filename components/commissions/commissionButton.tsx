import {DownloadIcon} from "lucide-react";
import {Button} from "@heroui/react";
import React from "react";

interface Props {
    handleClick: () => void;
}

export const CommissionButton = ({handleClick}: Props) => {
    return (
        <Button
            onPress={() => handleClick()}
            className="self-center lg:self-auto"
            startContent={<DownloadIcon/>}
        >
            Retirer les fonds
        </Button>
    )
}