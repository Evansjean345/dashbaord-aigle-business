"use client";

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";
import {useState} from "react";
import * as XLSX from 'xlsx';
import {FileSpreadsheet} from 'lucide-react';
import {FileDownloadIcon, FileUploadIcon} from 'hugeicons-react'
import {useMobileMoneyDeposit, useWaveDeposit} from "@/hooks/useTransaction";
import {useAuth} from "@/hooks/useAuth";
import {Alert} from "../alert/alert";
import {useAlertStore} from "@/stores/useAlert";

interface BulkTransferRow {
    Bénéficiaire: string;
    Pays: string;
    devise: string;
    opérateur: string;
    montant: number;
}

export const BulkTransfer = () => {
    const {profile} = useAuth();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [transfers, setTransfers] = useState<BulkTransferRow[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const {mobileMoneyDeposit, isMobileMoneyDepositLoading} = useMobileMoneyDeposit()
    const {waveDeposit, isWaveDepositLoading} = useWaveDeposit()

    const showAlert = useAlertStore(state => state.showAlert)

    const downloadTemplate = () => {
        const template = [
            {
                Bénéficiaire: "'0700000000",
                Pays: "ci",
                devise: "XOF",
                opérateur: "mtn",
                montant: 5000
            }
        ];

        const ws = XLSX.utils.json_to_sheet(template);

        ws['!cols'] = [{wch: 15}];
        ws['A1'] = {t: 's', v: 'Bénéficiaire'};
        ws['A2'] = {t: 's', v: "'0700000000"};

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "transfert_en_masse_template.xlsx");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array', cellText: true});
                const wsname = workbook.SheetNames[0];
                const ws = workbook.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws) as BulkTransferRow[];
                setTransfers(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const processTransfers = async () => {
        try {
            // Process in batches of 5
            const batchSize = 5;
            const batches = [];

            for (let i = 0; i < transfers.length; i += batchSize) {
                batches.push(transfers.slice(i, i + batchSize));
            }

            for (const batch of batches) {
                await Promise.all(
                    batch.map(async (transfer) => {
                        const payload = {
                            operation_type: "mobile_money",
                            amount: transfer.montant,
                            provider: transfer.opérateur,
                            number: transfer.Bénéficiaire,
                            country: transfer.Pays,
                            currency: transfer.devise,
                            organisation_id: profile?.organisation?.organisation_id,
                        };

                        if (transfer.provider === 'wave') {
                            waveDeposit(payload);
                        } else {
                            mobileMoneyDeposit(payload);
                        }
                    })
                );
            }

            showAlert("Tous les transferts ont été effectués avec succès!", "success")
        } catch (error) {
            showAlert("Une erreur est survenue lors des transferts", "error")
        }
    };

    return (
        <>
            <Button
                onPress={onOpen}
                color="primary"
                startContent={<FileSpreadsheet/>}
            >
                Transfert en masse
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="2xl"
                scrollBehavior="inside"
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <h2 className="text-xl font-bold">Transfert en masse</h2>
                            </ModalHeader>

                            <ModalBody>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            startContent={<FileDownloadIcon/>}
                                            onClick={downloadTemplate}
                                        >
                                            Télécharger le modèle
                                        </Button>

                                        <Button
                                            color="primary"
                                            variant="flat"
                                            startContent={<FileUploadIcon/>}
                                        >
                                            <label className="cursor-pointer">
                                                Charger le fichier
                                                <input
                                                    type="file"
                                                    accept=".xlsx,.xls"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        </Button>
                                    </div>

                                    {transfers.length > 0 && (
                                        <div className="space-y-4">
                                            <Table
                                                aria-label="Liste des transferts"
                                                bottomContent={
                                                    <div className="flex w-full justify-center">
                                                        <Pagination
                                                            isCompact
                                                            showControls
                                                            showShadow
                                                            color="primary"
                                                            page={page}
                                                            total={Math.ceil(transfers.length / rowsPerPage)}
                                                            onChange={(page) => setPage(page)}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <TableHeader>
                                                    <TableColumn>NUMÉRO</TableColumn>
                                                    <TableColumn>PAYS</TableColumn>
                                                    <TableColumn>DEVISE</TableColumn>
                                                    <TableColumn>OPÉRATEUR</TableColumn>
                                                    <TableColumn>MONTANT</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {transfers
                                                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                                                        .map((transfer, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{transfer.Bénéficiaire}</TableCell>
                                                                <TableCell>{transfer.Pays?.toUpperCase()}</TableCell>
                                                                <TableCell>{transfer.devise}</TableCell>
                                                                <TableCell
                                                                    className="capitalize">{transfer.opérateur}</TableCell>
                                                                <TableCell>{transfer.montant?.toLocaleString()} FCFA</TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>

                                            <div className="bg-default-50 p-4 rounded-lg">
                                                <p className="text-sm">
                                                    Total des transferts: <span
                                                    className="font-bold">{transfers.length}</span>
                                                </p>
                                                <p className="text-sm">
                                                    Montant total: <span className="font-bold">
                                                    {transfers?.reduce((sum, t) => sum + Number(t.montant), 0)?.toLocaleString()} FCFA
                                                  </span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button
                                    color="primary"
                                    isDisabled={transfers.length === 0}
                                    onPress={processTransfers}
                                >
                                    Lancer les transferts
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Alert/>
        </>
    );
};
