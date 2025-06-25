import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Input,
    Pagination,
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    Checkbox,
    Selection,
    Card,
    Divider,
    Tooltip,
    useDisclosure,
    Spinner
} from "@heroui/react";
import React, {useState, useMemo, Suspense} from "react";
import {columns} from "./data";
import {RenderCell} from "./render-cell";
import {Search} from "lucide-react"
import jsPDF from "jspdf";
import "jspdf-autotable";
import {TableIcon, GridViewIcon, Delete02Icon, PencilEdit02Icon} from "hugeicons-react";
import {useOrganisation} from "@/hooks/useOrganisation";
import {Organisation} from "@/types/organisation.types";
import {OrganisationDetails} from "@/components/organisations/organisation-details";

export const SwitchableTable = () => {
    const {organisations, isLoadingOrganisations} = useOrganisation();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    // const rowsPerPage = 5;
    const handleSelection = (organisation: Organisation) => {
        setSelectedOrganisation(organisation);
        onOpen();
    };

    const filteredItems = useMemo(() => {
        let filteredOrganisations = organisations || [];
        if (!organisations) return [];

        if (searchTerm.trim()) {
            filteredOrganisations = filteredOrganisations.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterValue !== "all") {
            filteredOrganisations = filteredOrganisations.filter((user) =>
                user.accountType === filterValue
            );
        }
        return filteredOrganisations;
    }, [searchTerm, filterValue, organisations]);

    // Add organisations to dependency array
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const memoizedItems = useMemo(() => items, [items]);

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

        const tableColumns = ["Nom", "Numéro", "Type de compte", "Date"];
        const tableRows = Array.from(selectedKeys, id => {
            const organisation = organisations?.find(t => t.id === id);
            if (!organisation) return [];

            return [
                `${organisation.name} FCFA`,
                organisation.phone,
                organisation.accountType,
                new Date(organisation.createdAt).toLocaleDateString()
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
                halign: "center",
            },
            alternateRowStyles: {fillColor: [240, 240, 240]},
            startY: 30
        });

        doc.save("organisations-list.pdf");
    };

    const handleCardSelection = (id: string) => {
        const newSelection = new Set(selectedKeys as Set<string>);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedKeys(newSelection);
    };
    const BottomContent = () => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
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
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        )

    }

    const renderTableView = () => {
        return (
            <Suspense fallback={<Spinner/>}>
                <Table
                    aria-label="Organisations table"
                    isHeaderSticky
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    bottomContent={<BottomContent/>}
                    onSelectionChange={(keys: Selection) => setSelectedKeys(keys)}
                >
                    <TableHeader columns={columns}>
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
                    <TableBody emptyContent={"Aucun compte professionnel trouvés"} items={memoizedItems}>
                        {(item: Organisation) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>
                                        {RenderCell({organisation: item, columnKey: columnKey})}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Suspense>

        );
    };

    const renderCardView = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <Card key={item.organisationId} className="p-4 space-y-3 shadow-none border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    isSelected={selectedKeys.has(item.organisationId)}
                                    onChange={() => handleCardSelection(item.organisationId)}
                                />
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">{item.name}</p>
                                    <p className="text-small text-default-500">{item.phone}</p>
                                </div>
                            </div>
                            <div className="relative flex items-center gap-2">
                                <Tooltip content="Edit user">
                                  <span onClick={() => handleSelection(item)}
                                        className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <PencilEdit02Icon/>
                                  </span>
                                </Tooltip>
                                <Tooltip color="danger" content="Delete user">
                                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                    <Delete02Icon/>
                                  </span>
                                </Tooltip>
                            </div>
                        </div>

                        <Divider/>

                        <div className="grid grid-cols-2 gap-2 px-2">
                            <div>
                                <p className="text-small text-default-500">Numéro</p>
                                <p className="font-medium">{item.phone}</p>
                            </div>
                            <div>
                                <p className="text-small text-default-500">Type de compte</p>
                                <p className="font-medium">{item.accountType}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Rechercher par nom..."
                    startContent={<Search/>}
                    value={searchTerm}
                    onClear={() => setSearchTerm("")}
                    onValueChange={setSearchTerm}
                />
                <div className="flex gap-3">
                    <Button
                        isIconOnly
                        variant={viewMode === 'table' ? 'solid' : 'flat'}
                        onPress={() => setViewMode('table')}
                    >
                        <TableIcon/>
                    </Button>
                    <Button
                        isIconOnly
                        variant={viewMode === 'cards' ? 'solid' : 'flat'}
                        onPress={() => setViewMode('cards')}
                    >
                        <GridViewIcon/>
                    </Button>
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
                            <DropdownItem key="active">Active</DropdownItem>
                            <DropdownItem key="paused">Suspendu</DropdownItem>
                            <DropdownItem key="vacation">Bloquer</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* <Button
            color="primary"
            onClick={exportToPDF}
            disabled={(selectedKeys as Set<string>).size === 0}
          >
            <span className="hidden md:block">Export PDF</span> 
            <Pdf01Icon />
          </Button>
          <Button
            color="success"
            onClick={exportToExcel}
            disabled={(selectedKeys as Set<string>).size === 0}
          >
            <span className="hidden md:block">Export Excel</span> 
            <File01Icon />
          </Button> */}
                </div>
            </div>

            {isLoadingOrganisations ? (
                <div className="flex justify-center items-center h-48">
                    <Spinner size="lg"/>
                </div>
            ) : (
                viewMode === 'table' ? renderTableView() : renderCardView()
            )}


            {isOpen && (
                <OrganisationDetails
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    organisation={selectedOrganisation}
                />
            )}
        </div>
    );
};
