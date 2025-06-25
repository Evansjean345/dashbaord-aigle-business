import {Organisation} from "@/types/organisation.types";
import {
    useCreditSubOrganisation,
    useDebitSubOrganisation,
} from "@/hooks/useOrganisation";
import {useState} from "react";
import {Button, Card, Input} from "@heroui/react";

interface Props {
    organisation: Organisation;
}

export const BalanceActions = ({organisation}: Props) => {
    const [amount, setAmount] = useState<number>(0);
    const {creditSubOrganisation, isCreditSubOrganisation} = useCreditSubOrganisation();
    const {debitSubOrganisation, isDebitSubOrganisation} = useDebitSubOrganisation();

    return (
        <Card className="p-4 border rounded-md shadow-none">
            <h4 className="font-semibold mb-2">Approvisionner le solde</h4>
            <Input
                type="number"
                label="Montant"
                startContent="FCFA"
                placeholder="Entrez un montant"
                value={amount.toString()}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="flex gap-2 mt-2 justify-end">
                <Button color="success" onPress={() => creditSubOrganisation({
                    sub_organisation_id: organisation.organisationId,
                    amount
                })} isLoading={isCreditSubOrganisation}>
                    Ajouter
                </Button>
                <Button color="danger"
                        onPress={() => debitSubOrganisation({sub_organisation_id: organisation.organisationId, amount})}
                        isLoading={isDebitSubOrganisation}>
                    Retirer
                </Button>
            </div>
        </Card>
    );
};