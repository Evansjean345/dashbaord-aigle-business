import {ChipProps} from "@heroui/react";

export const transactionService: Record<string, string> = {
    mobile_money: "Mobile Money",
    "mobile-money": "Mobile Money",
    aigle: 'Aigle'
}

export const statusTranslations: Record<string, string> = {
    success: "Succès",
    pending: "En attente",
    failed: "Échec"
};

export const statusColorMap: Record<string, ChipProps["color"]> = {
    success: "success",
    pending: "warning",
    failed: "danger"
};