import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Image, useDisclosure, cn } from "@heroui/react";
import { PencilEdit02Icon, Delete03Icon, MoreVerticalCircle02Icon } from "hugeicons-react"
import { DetailsItems } from "./details-items";

export const Actions = () => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="light"
            className="bg-transparent text-default-500 data-[hover=true]:bg-transparent"
          >
            <MoreVerticalCircle02Icon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="new"
            startContent={<PencilEdit02Icon className={iconClasses} />}
            onPress={onOpen}
          >
            Modifier
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<Delete03Icon className={cn(iconClasses, "text-danger")} />}
          >
            Supprimer
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <DetailsItems isOpen={isOpen}  onOpenChange={onOpenChange} user={{}} />
    </>

  );

}