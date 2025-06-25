import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {useEffect, useMemo, useState} from "react";
import {Alert} from "../alert/alert";
import {CountriesOperators} from "@/components/transfert/steps/CountriesOperators";
import {NumberSelectorStep} from "@/components/transfert/steps/NumberSelectorStep";
import {AmountSteps} from "@/components/transfert/steps/AmountStep";
import {Recap} from "@/components/transfert/steps/Recap";
import {CodePin} from "@/components/transfert/steps/CodePin";
import {useTransfertForm} from "@/hooks/useTransfertForm";

interface TransfertFormProps {
    isOpen: boolean;
    handleClose: () => void;
}

export const TransfertForm = ({isOpen, handleClose}: TransfertFormProps) => {
    const {
        formData,
        setFormData,
        countries,
        operators,
        organisation,
        isTransactionCompleted,
        isLoadingOperators,
        isMobileMoneyDepositLoading,
        isWaveDepositLoading,
        authenticationLoading,
        handleSubmit,
        handleCountrySelect,
    } = useTransfertForm("revenue")

    const [step, setStep] = useState(1);

    const isLoading = isMobileMoneyDepositLoading || isWaveDepositLoading || authenticationLoading;

    /**
     * Determines whether the button should be disabled based on specific conditions.
     * Conditions include checking if isLoading is true, or if step is at certain point and certain form data is missing.
     * @returns {boolean} true if the button should be disabled, false otherwise
     */
    const isButtonDisabled = useMemo(() => {
        return isLoading ||
            (step === 1 && (!formData.country || !formData.destinationNetwork)) ||
            (step === 2 && !formData.destinationNumber) ||
            (step === 3 && !formData.amount) ||
            (step === 5 && (!formData.password || formData.password.length !== 6))
    }, [isLoading, step, formData.destinationNumber, formData.amount, formData.country, formData.destinationNetwork, formData.password]);

    useEffect(() => {
        if (isTransactionCompleted && typeof handleClose === 'function') {
            handleClose();
        }
    }, [isTransactionCompleted, handleClose]);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <CountriesOperators
                    countries={countries}
                    isLoadingOperators={isLoadingOperators}
                    operators={operators}
                    operatorValue={formData.destinationNetwork}
                    handleOperatorSelect={(operatorId) => setFormData(prev => ({
                        ...prev,
                        destinationNetwork: operatorId
                    }))}
                    handleCountrySelect={(country_id) => handleCountrySelect(country_id)}
                />

            case 2:
                return (
                    <NumberSelectorStep
                        destinationNumber={formData.destinationNumber}
                        handleDestinationNumberChange={(phoneNumber) => setFormData(prev => ({
                            ...prev,
                            destinationNumber: phoneNumber
                        }))}
                    />
                );

            case 3:
                return (
                    <AmountSteps
                        operator={formData.destinationNetwork}
                        countryId={formData.country}
                        currentAmount={formData.amount}
                        currentFees={formData.fees}
                        organisation={organisation}
                        handleAmountSelected={(amount) => setFormData(prev => ({...prev, amount}))}
                        handleFeesSelected={(fees) => setFormData(prev => ({...prev, fees}))}
                    />
                );
            case 4:
                return <Recap data={formData}/>

            case 5:
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
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose();
                    }
                }}
                onClose={handleClose}
                size="sm"
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold">Transfert mobile money</h2>
                                <div className="flex justify-between w-full mt-4">
                                    {[1, 2, 3, 4, 5].map((stepNumber) => (
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
                                        if (step < 5) {
                                            setStep(step + 1);
                                        } else {
                                            await handleSubmit();
                                        }
                                    }}
                                >
                                    {step === 5 ? "Confirmer" : "Suivant"}
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
