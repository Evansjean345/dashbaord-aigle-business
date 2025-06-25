import {
  Link,
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
  Selection
} from "@heroui/react";
import React, { useState, useMemo } from "react";
import { columns } from "./data";
import { RenderCell } from "./render-cell";
import { Search } from "lucide-react"
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable'
import * as XLSX from "xlsx";
import { File01Icon, Pdf01Icon } from "hugeicons-react";
import { useSupply } from "@/hooks/useSupply";
import { Supply } from "@/types/supply.types";
import { usePathname } from 'next/navigation';

// type User = typeof users[0];
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export const TableWrapper = () => {
  const pathname = usePathname();
  const { supplies, isLoadingSupplies } = useSupply("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const rowsPerPage = 5;

  const filteredItems = useMemo(() => {
    let filteredSupplies = supplies || [];

    // Apply search and status filters
    if (searchTerm.trim()) {
      filteredSupplies = filteredSupplies.filter((supply) =>
        supply.provisionType.includes(searchTerm)
      );
    }
    if (filterValue !== "all") {
      filteredSupplies = filteredSupplies.filter((supply) =>
        supply.status === filterValue
      );
    }
    
    return filteredSupplies;
  }, [searchTerm, filterValue, supplies]);



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
      const supply = supplies?.find(t => t.id === id);
      if (!supply) return [];

      return [
        `${supply.amount} FCFA`,
        supply.provisionType,
        supply.status,
        supply.amount,
        new Date(supply.createdAt).toLocaleDateString()
      ];
    }).filter(row => row.length > 0);

    (doc as any).autoTable({
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      startY: 30
    });

    doc.save("supplies-list.pdf");
  };




  // const exportToExcel = () => {
  //   const selectedTransactions = Array.from(selectedKeys || new Set()).map(id =>
  //     supplies?.find(t => t.id === id)
  //   ).filter((supply): supply is Supply => supply !== undefined);

  //   const ws = XLSX.utils.json_to_sheet(selectedTransactions);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  //   XLSX.writeFile(wb, "supplies-list.xlsx");
  // };


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

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Rechercher par type d'approvisionnement..."
          startContent={<Search />}
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
              <DropdownItem key="all">All</DropdownItem>
              <DropdownItem key="success">succès</DropdownItem>
              <DropdownItem key="pending">en attente</DropdownItem>
              <DropdownItem key="failed">Echec</DropdownItem>
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

      <Table
        aria-label="Transactions table"
        isHeaderSticky
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        bottomContent={<BottomContent />}
        // classNames={{
        //   wrapper: "max-h-[382px]",
        // }}
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
        <TableBody emptyContent={"Aucune demande d'approvisionnement trouvées"} items={items}>
          {(item: Supply) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ supply: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
