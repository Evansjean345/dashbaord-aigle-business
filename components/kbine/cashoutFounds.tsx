import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,} from "@heroui/react";
import {useEffect, useMemo, useState} from "react";
import {Alert} from "../alert/alert";
import {NumberSelectorStep} from "@/components/transfert/steps/NumberSelectorStep";
import {CashoutTypeStep} from "@/components/kbine/steps/cashoutTypeStep";
import {CashoutType, CashoutTypeValue} from "@/types/transaction.types";
import {CountriesOperators} from "@/components/transfert/steps/CountriesOperators";
import {CashoutAmountSteps} from "@/components/kbine/steps/cashoutAmountStep";
import {Recap} from "@/components/transfert/steps/Recap";
import {CodePin} from "@/components/transfert/steps/CodePin";
import {useTransfertForm} from "@/hooks/useTransfertForm";

interface TransfertFormProps {
    isOpen: boolean;
    handleClose: () => void;
    cashoutTypeList: CashoutType[];
}

export const CashoutFounds = ({isOpen, cashoutTypeList, handleClose}: TransfertFormProps) => {
    const {onOpenChange} = useDisclosure();
    const [step, setStep] = useState(1);

    const {
        formData,
        setFormData,
        countries,
        operators,
        organisation,
        isLoadingOperators,
        isMobileMoneyDepositLoading,
        isWaveDepositLoading,
        authenticationLoading,
        isTransactionCompleted,
        handleSubmit,
        handleCountrySelect,
    } = useTransfertForm("revenue_commission")

    const isLoading = isMobileMoneyDepositLoading || isWaveDepositLoading || authenticationLoading;

    /**
     * Determines whether the button should be disabled based on specific conditions.
     * Conditions include checking if isLoading is true, or if step is at a certain point and certain form data is missing.
     * @returns {boolean} true if the button should be disabled, false otherwise
     */
    const isButtonDisabled = useMemo(() => {
        return isLoading ||
            (step === 1 && !formData.category) ||
            (step === 2 && (!formData.country || !formData.destinationNetwork)) ||
            (step === 3 && !formData.destinationNumber) ||
            (step === 4 && !formData.amount) ||
            (step === 6 && (!formData.password || formData.password.length !== 6))
    }, [isLoading, step, formData.category, formData.country, formData.operator, formData.destinationNumber, formData.amount, formData.country, formData.destinationNetwork, formData.password]);


    useEffect(() => {
        if (isTransactionCompleted && typeof handleClose === 'function') {
            handleClose();
        }
    }, [isTransactionCompleted, handleClose]);


    const renderStep = () => {
        switch (step) {
            case 1:
                return <CashoutTypeStep
                    cashoutTypeList={cashoutTypeList}
                    cashoutTypeSelected={formData.category}
                    handleSelected={(category) => setFormData(prev => ({...prev, category: category}))}
                />

            case 2:
                return <CountriesOperators
                    countries={countries}
                    isLoadingOperators={isLoadingOperators}
                    operators={operators}
                    operatorValue={formData.destinationNetwork}
                    handleCountrySelect={(country_id) => handleCountrySelect(country_id)}
                    handleOperatorSelect={(operatorId) => setFormData(prev => ({
                        ...prev,
                        destinationNetwork: operatorId
                    }))}
                />

            case 3:
                return (
                    <NumberSelectorStep
                        destinationNumber={formData.destinationNumber}
                        label="Numéro sur lequel les fonds seront transférés"
                        handleDestinationNumberChange={(phoneNumber) => setFormData(prev => ({
                            ...prev,
                            destinationNumber: phoneNumber
                        }))}
                    />
                );

            case 4:
                return (
                    <CashoutAmountSteps
                        operator={formData.destinationNetwork}
                        countryId={formData.country}
                        organisation={organisation}
                        handleAmountSelected={(amount) => setFormData(prev => ({
                            ...prev,
                            amount: amount
                        }))}
                        cashoutType={formData.category as CashoutTypeValue}
                    />
                );
            case 5:
                return <Recap data={formData}/>

            case 6:
                return <CodePin
                    password={formData.password}
                    handlePinSelected={(value) => setFormData(prev => ({...prev, password: value}))}
                />
        }
    };

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={handleClose}
                size="sm"
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold">Rétrait des fonds</h2>
                                <div className="flex justify-between w-full mt-4">
                                    {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                                        <div
                                            key={stepNumber}
                                            className={`h-2 flex-1 mx-1 rounded-md ${stepNumber <= step ? 'bg-primary' : 'bg-default-100'}`}
                                        />
                                    ))}
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {renderStep()}
                            </ModalBody>
                            <ModalFooter className="flex justify-between">
                                <Button
                                    variant="light"
                                    onPress={() => step > 1 && setStep(step - 1)}
                                    isDisabled={step === 1}
                                >
                                    Retour
                                </Button>
                                <Button
                                    color="primary"
                                    isDisabled={isButtonDisabled}
                                    isLoading={isLoading}
                                    onPress={async () => {
                                        if (step < 6) {
                                            setStep(step + 1);
                                        } else {
                                            await handleSubmit();
                                        }
                                    }}
                                >
                                    {step === 6 ? "Confirmer" : "Suivant"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Alert/>
        </div>
    );
};
