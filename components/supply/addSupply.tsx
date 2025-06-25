import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from "@heroui/react";
import {useState} from "react";
import Image from "next/image";
import {CloudUploadIcon, Delete01Icon} from "hugeicons-react";
import {Alert} from "../alert/alert";
import {useSupply} from "@/hooks/useSupply";
import {useOrganisationStore} from "@/stores/organisationStore";

interface AddSupplyProps {
    isOpen: boolean;
    onClose: () => void;
}

const bankList = [
    {name: "UBA", accountNumber: "CI93 CI93 0100 0100 1234 5678 90"},
    {name: "SGCI", accountNumber: "CI93 CI93 0100 0100 1234 5678 91"}
];

const mobileMoneyList = [
    {provider: "Orange Money", number: "+225 0708090910"},
    {provider: "MTN Money", number: "+225 0506070809"},
    {provider: "Moov Money", number: "+225 0102030405"}
];

export default function AddSupply({isOpen, onClose}: AddSupplyProps) {
    const {organisation} = useOrganisationStore();
    const [paymentMethod, setPaymentMethod] = useState("");
    const {
        providers,
        isLoadingProviders,
        createSupply,
        isCreatingSupply,
    } = useSupply(paymentMethod);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [approvisionType, setApprovisionType] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value);
        setSelectedPaymentMethod('');
    };

    const handleApprovisionTypeChange = (value: string) => {
        setApprovisionType(value);
    };

    // const handleSubmit = () => {
    //   if (!selectedFile) return;

    //   const formData = new FormData();
    //   formData.append('amount', amount);
    //   formData.append('payment_provider', selectedPaymentMethod);
    //   formData.append('type', paymentMethod);
    //   formData.append('document', selectedFile);
    //   formData.append('organisation_id', profile.organisation.organisation_id);
    //   formData.append('approvision_type', approvisionType);

    //   createSupply(formData, {
    //     onSuccess: () => {
    //       onClose();
    //       // setAmount('');
    //       // setSelectedFile(null);
    //       // setPreviewUrl(null);
    //       // setSelectedPaymentMethod('');
    //       // setApprovisionType('');
    //     }
    //   });
    // };

    const handleSubmit = () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('payment_provider', selectedPaymentMethod);
        formData.append('type', paymentMethod);
        formData.append('document', selectedFile);
        formData.append('organisation_id', organisation.organisation_id);
        formData.append('provision_type', "principal");

        createSupply(formData, {
            onSuccess: () => {

                setAmount('');
                setSelectedFile(null);
                setPreviewUrl(null);
                setSelectedPaymentMethod('');
                setApprovisionType('');
                setTimeout(() => onClose(), 3000);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
                <ModalHeader>Nouvelle demande d&apos;approvisionnement</ModalHeader>
                <ModalBody>
                    <div className="flex justify-between flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-[50%] gap-4 flex flex-col">
                            <Input
                                label="Montant"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />

                            {/* <Select
                label="Type d'approvisionnement"
                value={approvisionType}
                onChange={(e) => handleApprovisionTypeChange(e.target.value)}
              >
                <SelectItem key="airtime" value="airtime">Cabine intelligente</SelectItem>
                <SelectItem key="principal" value="principal">Compte principale</SelectItem>
              </Select> */}

                            <Select
                                label="Moyen de paiement"
                                value={paymentMethod}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            >
                                <SelectItem key="bank" value="bank">Banque</SelectItem>
                                <SelectItem key="mobile_money" value="mobile_money">Mobile Money</SelectItem>
                            </Select>

                            {paymentMethod === "bank" && (
                                <Select
                                    label="Sélectionner une banque"
                                    value={selectedPaymentMethod}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    isLoading={isLoadingProviders}
                                >
                                    {providers?.map((provider) => (
                                        <SelectItem textValue={provider.label + " " + provider.number}
                                                    key={provider.reference} value={provider.reference}>
                                            {provider.label} - {`(${provider.number})`}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}

                            {paymentMethod === "mobile_money" && (
                                <Select
                                    label="Sélectionner un numéro"
                                    value={selectedPaymentMethod}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    isLoading={isLoadingProviders}
                                >
                                    {providers?.map((provider) => (
                                        <SelectItem textValue={provider.label + " " + provider.number}
                                                    key={provider.reference} value={provider.reference}>
                                            {provider.label} - {`(${provider.number})`}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        </div>
                        <div>
                            <div className="w-full p-2 flex-col justify-start items-start gap-2.5 flex">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center py-6 w-full border border-default-300 border-dashed rounded-2xl cursor-pointer bg-default-50 "
                                >
                                    <div className="mb-3 flex items-center justify-center">
                                        <CloudUploadIcon className="text-cyan-600 w-10 h-10"/>
                                    </div>
                                    <span className="text-center text-default-400 text-xs font-normal leading-4 mb-1">
                    PNG, JPG ou PDF, inférieur à 15MB
                  </span>
                                    <h6 className="text-center text-default-900 text-sm font-medium leading-5">
                                        Preuve de paiement
                                    </h6>
                                    {/* <input id="dropzone-file" type="file" className="hidden" /> */}
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        // accept=".png,.jpg,.jpeg"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {previewUrl && (
                                <div className="relative mt-4 w-fit">
                                    <Image
                                        src={previewUrl}
                                        alt="Payment proof"
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                    <Button
                                        isIconOnly
                                        color="danger"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                    >
                                        <Delete01Icon/>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Annuler
                    </Button>
                    <Button isLoading={isCreatingSupply} color="primary" onPress={handleSubmit}>
                        Valider
                    </Button>
                </ModalFooter>
            </ModalContent>

            <Alert/>
        </Modal>
    );
}
