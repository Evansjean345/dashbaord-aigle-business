import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Selection,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import React, {useMemo, useState} from "react";
import {Search} from "lucide-react"
import "jspdf-autotable";
import {AirtimeTransaction} from "@/types/transaction.types";
import {getNestedValue} from "@/lib/utils";
import {statusColorMap, statusTranslations, transactionService} from "@/lib/transaction_config";
import Image from "next/image";
import {Actions} from "@/components/table/airtime-table/actions";
import {useSmartkbineTransactions} from "@/hooks/useSmartkbine";
import {paginationStyle, tableStyle} from "@/components/table/table-style";

interface RenderSmartKbineCellProps {
    transaction: AirtimeTransaction;
    columnKey: string | React.Key;
}

const smartKbineColumns = [
    // {name: 'ID', uid: 'transaction_id'},
    {name: 'REFERENCE', uid: 'reference'},
    {name: 'SERVICE', uid: 'transactionDetails.senderDetails.service'},
    {name: 'OPERATEUR', uid: 'transactionDetails.senderDetails.provider'},
    {name: 'NUMERO DESTINATAIRE', uid: 'transactionDetails.receiveDetails.phone_number'},
    {name: 'MONTANT', uid: 'amount'},
    {name: 'DATE ET HEURE', uid: 'createdAt'},
    {name: 'STATUS', uid: 'status'},
    {name: 'ACTIONS', uid: 'actions'},
];

const RenderSmartKbineCell = ({transaction, columnKey}: RenderSmartKbineCellProps) => {
    const cellValue = columnKey.toString().includes('.')
        ? getNestedValue(transaction, columnKey.toString())
        : transaction[columnKey as keyof AirtimeTransaction];

    switch (columnKey) {
        case 'amount':
            return (
                <div className="flex flex-col text-semibold text-base">
                    <span className="">{transaction.amount} FCFA</span>
                </div>
            );
        case "transactionDetails.senderDetails.service":
            return (
                <span
                    className="text-sm">{transactionService[transaction.transactionDetails?.senderDetails?.service]}</span>
            );
        case 'transactionDetails.senderDetails.provider':
            return (
                <div className="flex justify-center">
                    <Image
                        src={`/img/${cellValue ? transaction?.transactionDetails?.senderDetails?.provider : "aig-b"}.png`}
                        alt="provider"
                        className="rounded-full"
                        width={transaction?.transactionDetails?.senderDetails.service === "aigle" ? 50 : 28}
                        height={transaction?.transactionDetails?.senderDetails.service === "aigle" ? 50 : 28}
                    />
                </div>
            );

        case "createdAt":
            return (
                <div className="flex flex-col text-base font-semibold">
                    <p className="text-bold text-small capitalize">
                        {new Date(cellValue as string).toLocaleDateString()}
                    </p>
                    <p className="text-bold text-small capitalize">
                        {new Date(cellValue as string).toLocaleTimeString()}
                    </p>
                </div>
            );

        case "status":
            return (
                <Chip
                    size="sm"
                    variant="solid"
                    color={statusColorMap[cellValue as string] || "default"}
                >
                    <span className="lowercase text-white text-xs">
                        {statusTranslations[cellValue as string] || ""}
                    </span>
                </Chip>
            );

        case "actions":
            return (
                <div className="flex items-center gap-4">
                    <Actions transaction={transaction}/>
                </div>
            );

        default:
            return cellValue;
    }
};

/**
 * SmartKineTransactions function to display a list of transactions with search, filter, and pagination functionalities.
 * @returns JSX element containing the interactive transaction table
 */
export const SmartKineTransactions = () => {
    const {transactions, isLoadingTransactions} = useSmartkbineTransactions();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const rowsPerPage = 5;

    const filteredItems = useMemo(() => {
        let filteredTransactions = transactions || [];

        if (searchTerm.trim()) {
            filteredTransactions = filteredTransactions.filter((transaction) =>
                transaction.phone_number.includes(searchTerm)
            );
        }
        if (filterValue !== "all") {
            filteredTransactions = filteredTransactions.filter((transaction) =>
                transaction.status === filterValue
            );
        }

        return filteredTransactions;
    }, [searchTerm, filterValue, transactions]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const BottomContent = () => {
        return (
            <div className="py-4 px-4 border-t  flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                  {selectedKeys === "all"
                      ? "All items selected"
                      : `${(selectedKeys as Set<string>).size} of ${filteredItems.length} selected`}
                </span>

                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                    classNames={paginationStyle}
                />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center gap-3 flex-wrap">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Rechercher par numéro de téléphone..."
                    startContent={<Search/>}
                    value={searchTerm}
                    onClear={() => setSearchTerm("")}
                    onValueChange={setSearchTerm}
                />
                <div className="flex gap-3">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="flat">
                                Status: {filterValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Status filter"
                            onAction={(key) => setFilterValue(key.toString())}
                        >
                            <DropdownItem key="all">Tous</DropdownItem>
                            <DropdownItem key="success">succès</DropdownItem>
                            <DropdownItem key="pending">en attente</DropdownItem>
                            <DropdownItem key="failed">Echec</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <div className="bg-white dark:bg-background w-full border rounded-lg overflow-x-auto">
                <Table
                    aria-label="Transactions table"
                    isHeaderSticky
                    removeWrapper
                    selectionMode="multiple"
                    classNames={tableStyle}
                    selectedKeys={selectedKeys}
                    bottomContent={<BottomContent/>}
                    onSelectionChange={(keys: Selection) => setSelectedKeys(keys)}
                >
                    <TableHeader columns={smartKbineColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                hideHeader={column.uid === "actions"}
                                align={column.uid === "actions" ? "center" : "start"}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"Aucune transactions trouvées"} items={items}>
                        {(item: AirtimeTransaction) => (
                            <TableRow key={item.reference}>
                                {(columnKey) => (
                                    <TableCell>
                                        {RenderSmartKbineCell({transaction: item, columnKey: columnKey})}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
