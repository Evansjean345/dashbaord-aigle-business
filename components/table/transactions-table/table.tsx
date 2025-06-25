import {
    Button,
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
import {columns} from "./data";
import {RenderCell} from "./render-cell";
import {Search} from "lucide-react"
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable'
import * as XLSX from "xlsx";
import {useTransaction} from "@/hooks/useTransaction";
import {Transaction} from "@/types/transaction.types";
import {usePathname} from 'next/navigation';
import {useOrganisationStore} from "@/stores/organisationStore";
import {paginationStyle, tableStyle} from "@/components/table/table-style";

// type User = typeof users[0];
declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable;
    }
}

export const TableWrapper = () => {
    const pathname = usePathname();
    const {transactions, isLoadingTransactions} = useTransaction();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const activeOrganisation = useOrganisationStore(state => state.organisation)

    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const rowsPerPage = 5;

    const filteredItems = useMemo(() => {
        let filteredTransactions = transactions || [];

        // Filter by route
        if (pathname === '/payments') {
            filteredTransactions = filteredTransactions.filter(
                transaction => transaction.transactionType === 'withdrawal'
            );
        } else if (pathname === '/transferts' || pathname === '/mass-payment') {
            filteredTransactions = filteredTransactions.filter(
                transaction => transaction.transactionType === 'payout'
            );
        }

        // Apply search and status filters
        if (searchTerm.trim()) {
            filteredTransactions = filteredTransactions.filter((transaction) =>
                transaction.paymentDetails?.phone_number.includes(searchTerm)
            );
        }
        if (filterValue !== "all") {
            filteredTransactions = filteredTransactions.filter((transaction) =>
                transaction.status === filterValue
            );
        }

        return filteredTransactions;
    }, [pathname, searchTerm, filterValue, transactions]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const classNames = React.useMemo(() => tableStyle, []);

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

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Transactions List", 10, 10);

        doc.setFontSize(12);
        doc.setTextColor(100);
        const currentDate = new Date().toLocaleDateString();
        doc.text(`Generated on: ${currentDate}`, 10, 20);

        const tableColumns = ["Amount", "Provider", "Status", "Phone Number", "Date"];
        const tableRows = Array.from(selectedKeys, id => {
            const transaction = transactions?.find(t => t.id === id);
            if (!transaction) return [];

            return [
                `${transaction.amount} FCFA`,
                transaction.provider,
                transaction.status,
                transaction.phone_number,
                new Date(transaction.createdAt).toLocaleDateString()
            ];
        }).filter(row => row.length > 0);

        (doc as any).autoTable({
            head: [tableColumns],
            body: tableRows,
            theme: "grid",
            headStyles: {fillColor: [41, 128, 185]},
            styles: {
                fontSize: 10,
                cellPadding: 3,
                align: "center",
            },
            alternateRowStyles: {fillColor: [240, 240, 240]},
            startY: 30
        });

        doc.save("transactions-list.pdf");
    };


    const exportToExcel = () => {
        const selectedTransactions = Array.from(selectedKeys || new Set()).map(id =>
            transactions?.find(t => t.id === id)
        ).filter((transaction): transaction is Transaction => transaction !== undefined);

        const ws = XLSX.utils.json_to_sheet(selectedTransactions);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, "transactions-list.xlsx");
    };

    const BottomContent = () => {
        return (
            <div className="py-3 px-4 border-t flex justify-between items-center">
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
                    className="w-full lg:w-auto"
                    placeholder="Téléphone..."
                    startContent={<Search/>}
                    value={searchTerm}
                    onClear={() => setSearchTerm("")}
                    onValueChange={setSearchTerm}
                />
                <div className="flex gap-3">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="flat">
                                Filter: {filterValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Status filter"
                            onAction={(key) => setFilterValue(key.toString())}
                        >
                            <DropdownItem key="all">
                                <div className="w-full flex items-center gap-x-1">
                                    <div className="size-3.5 rounded-full bg-blue-500"></div>
                                    <span>Tous</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="success">Succès</DropdownItem>
                            <DropdownItem key="pending">En attente</DropdownItem>
                            <DropdownItem key="failed">Echoué</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* <Button
            color="primary"
            onClick={exportToPDF}
            disabled={(selectedKeys as Set<string>).size === 0}
          >
            Export PDF
            <Pdf01Icon />
          </Button>
          <Button
            color="success"
            onClick={exportToExcel}
            disabled={(selectedKeys as Set<string>).size === 0}
          >
            Export Excel
            <File01Icon />
          </Button> */}
                </div>
            </div>

            <div className="bg-white dark:bg-background w-full border rounded-lg overflow-x-auto">
                <Table
                    aria-label="Transactions table"
                    isHeaderSticky
                    selectionMode="multiple"
                    layout="auto"
                    radius="none"
                    shadow="none"
                    removeWrapper
                    selectedKeys={selectedKeys}
                    classNames={classNames}
                    bottomContent={<BottomContent/>}
                    onSelectionChange={(keys: Selection) => setSelectedKeys(keys)}
                >
                    <TableHeader columns={columns} className="rounded-none">
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
                        {(item: Transaction) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>
                                        {RenderCell({
                                            transaction: item,
                                            columnKey: columnKey,
                                            organisation: activeOrganisation
                                        })}
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
