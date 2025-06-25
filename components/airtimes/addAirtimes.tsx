"use client";

import {
    Button,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@heroui/react";
import {useForm} from "react-hook-form";
import {useEffect, useMemo, useState} from "react";
import {Alert} from "@/components/alert/alert";
import Image from "next/image";
import {ArrowRight02Icon, Calling02Icon} from "hugeicons-react";
import "react-phone-number-input/style.css";
import {useAirtimeCountries, useAirtimeCountryOperators, useRechargeAirtimes} from "@/hooks/useAirtimes";
import {recharcheResponse, rechargePayload} from "@/types/airtimes.types";
import {useOrganisationStore} from "@/stores/organisationStore";
import {useTransactionCache} from "@/hooks/useTransaction";
import {AirtimeTransaction, TransactionFees} from "@/types/transaction.types";
import {PurchaseType} from "@/components/airtimes/steps/PurchaseType";
import {CountriesStep} from "@/components/airtimes/steps/CountriesStep";
import {OperatorsStep} from "@/components/airtimes/steps/OperatorsStep";
import {AirtimeAmountStep} from "@/components/airtimes/steps/AirtimeAmountStep";
import {PaymentMethodStep} from "@/components/airtimes/steps/PaymentMethodStep";
import {useTransactionFees} from "@/hooks/useTransactionFees";
import {useTransmit} from "@/providers/transmit-context";
import {Subscription} from "@adonisjs/transmit-client";
import {useAlertStore} from "@/stores/useAlert";

const TRANSACTION_TYPES = [
    {id: "credit", name: "Crédit de communication", icon: <Calling02Icon/>},
    // { id: 'data', name: 'Forfait Internet', icon: <ArrowDataTransferVerticalIcon /> }
];

const OPERATORS = [
    {id: "mtn", name: "MTN", icon: "/img/mtn.png"},
    {id: "orange", name: "Orange", icon: "/img/orange.png"},
    {id: "moov", name: "Moov", icon: "/img/moov.png"},
    {id: "wave", name: "Wave", icon: "/img/wave.png"},
];

const DATA_PACKAGES = {
    mtn: [
        {id: 1, name: "1 Go - 24H", price: 500},
        {id: 2, name: "3 Go - 7 jours", price: 2000},
        {id: 3, name: "10 Go - 30 jours", price: 5000},
    ],
    orange: [
        {id: 1, name: "1.5 Go - 24H", price: 500},
        {id: 2, name: "5 Go - 7 jours", price: 2500},
        {id: 3, name: "15 Go - 30 jours", price: 6000},
    ],
    moov: [
        {id: 1, name: "1 Go - 24H", price: 500},
        {id: 2, name: "4 Go - 7 jours", price: 2000},
        {id: 3, name: "12 Go - 30 jours", price: 5500},
    ],
};

interface AddAirtimeProps {
    isAirtimeOpen: boolean;
    onAirtimeClose: () => void;
}

const initialFormState = {
    transactionType: "",
    country_code: "CI",
    operator: "",
    package: null,
    amount: "",
    paymentMethod: "",
    debited_phone_number: "",
    beneficiary_phone_number: "",
    sender_provider: "",
    sender_operator: "",
    beneficiary_provider: "",
    beneficiary_operator: "",
};

export const AddAirtimes = ({
                                isAirtimeOpen,
                                onAirtimeClose,
                            }: AddAirtimeProps) => {
    const transmit = useTransmit()

    const organisation = useOrganisationStore((state) => state.organisation);
    const showAlert = useAlertStore(state => state.showAlert)
    const closeAlert = useAlertStore(state => state.closeAlert)

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormState);
    const [fees, setFees] = useState<TransactionFees | null>(null);
    const [rechargeCreated, setRechargeCreated] = useState<recharcheResponse | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
        reset,
    } = useForm<rechargePayload>({
        defaultValues: {
            sender: {
                service: "",
                success_url: "https://www.google.com",
                error_url: "https://www.google.com",
                phone_number: "",
                country_code: "CI",
                provider: "",
                otp: "",
            },
            receiver: {
                // operator_id: "",
                country_code: "CI",
                phone_number: "",
            },
            // amount: "",
            organisation_id: organisation?.organisation_id,
        },
    });

    const {onOpen, onOpenChange} = useDisclosure();
    const {updateTransactionFromCache} = useTransactionCache();
    const {countries, isLoadingCountries} = useAirtimeCountries()
    const {operators, isLoadingOperators} = useAirtimeCountryOperators(formData.country_code)

    const {refreshTransactions} = useTransactionCache()
    const {recharge, isRechargePending} = useRechargeAirtimes()
    const {calculateFees, isPending} = useTransactionFees();

    const isButtonDisabled = useMemo(() => {
        switch (step) {
            case 1:
                return !formData.transactionType;
            case 2:
                return !formData.country_code;
            case 3:
                return !formData.operator;
            case 4:
                return !formData.amount || !formData.beneficiary_phone_number;

            case 5:
                if (formData.paymentMethod === "aigle") return false; // Changed to false to allow proceeding
                if (formData.paymentMethod === "mobile-money") {
                    return (
                        !formData.sender_provider ||
                        !formData.debited_phone_number
                    );
                }
                return true;
            default:
                return false;
        }
    }, [
        isRechargePending,
        step,
        formData.transactionType,
        formData.country_code,
        formData.operator,
        formData.amount,
        formData.beneficiary_phone_number,
        formData.paymentMethod,
        formData.sender_provider,
        formData.debited_phone_number,
    ]);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    useEffect(() => {
        let subscription: Subscription | null

        const setupSuscription = async () => {
            try {
                const subscription = transmit.subscription(`/organisation/${organisation.organisation_id}/transaction/webhook`)
                await subscription.create()

                subscription.onMessage(({data}) => {
                    if (!rechargeCreated || !data) {
                        return
                    }

                    const rechargeCreatedId = rechargeCreated?.reference
                    const transactionId = data.reference

                    if (rechargeCreatedId === transactionId) {
                        const status = data.status

                        console.log("cool")


                        switch (status) {
                            case "success":
                                showAlert("Votre achat a été éffectué avec succès", "success")
                                setTimeout(() => handleResetData(data), 1500)
                                break
                            case "failed":
                                showAlert("Echec de l'opération", "error")
                                setTimeout(() => handleResetData(data), 1500)
                                break
                        }
                    }
                })

            } catch (error) {
                console.error('Airtime subscription error:', error);
                showAlert("Erreur lors de l'écoute des transactions d'airtime", "error");
            }
        }

        setupSuscription()

        return () => {
            if (subscription) {
                void subscription.delete()
            }
        }
    }, [transmit, rechargeCreated]);

    /**
     * Updates the selected country and updates the country code in the sender and receiver form fields.
     *
     * @param {any} country - The selected country to set.
     */
    const handleCountrySelect = (country: any) => {
        setValue("receiver.country_code", country?.toLowerCase());
        setFormData((prev) => ({...prev, country_code: country}));
    };

    /**
     * Executes the onSubmit function with the provided data.
     *
     * @param {rechargePayload} data - The data to be submitted.
     * @returns {Promise<void>} - A Promise that resolves once the submission operation is completed.
     */
    const onSubmit = async (data: rechargePayload): Promise<void> => {
        if (step === 6) {
            recharge(
                {
                    ...data,
                    organisation_id: organisation?.organisation_id,
                },
                {
                    onSuccess: (data) => {
                        setRechargeCreated(data);
                        refreshTransactions();
                    },
                }
            );
        }
    };

    const handleSenderProviderChange = (provider: string) => {
        setFormData((prev) => ({...prev, sender_provider: provider}));
        setValue("sender.provider", provider);
    };

    const handleAmountChange = (value: string) => {
        setFormData((prev) => ({...prev, amount: value}))

        // Rénitialiser les modes de paiement en détails de paiements pour faciliter le calcul des frais
        // lorsque l'utilisateur change de montant
        setFormData((prev) => ({...prev, paymentMethod: "",}));
        setFormData((prev) => ({...prev, debited_phone_number: "",}));
        setFormData((prev) => ({...prev, sender_provider: ""}));

        setValue("sender.service", "")
        setValue("sender.provider", "")
        setValue("sender.phone_number", "")
    }

    /**
     * Function to handle resetting data.
     * Resets form, sets initial form state, closes airtime, and refreshes transactions and organisation wallet.
     * @returns {Promise<void>} A promise that resolves when all data is reset.
     */
    const handleResetData = async (
        transaction: AirtimeTransaction
    ): Promise<void> => {
        reset();
        setFormData(initialFormState);
        closeAlert()
        onAirtimeClose();
        await Promise.any([
            await updateTransactionFromCache(transaction)
        ]);
    };

    /**
     * Handle the selection of a payment method to initiate the payment process.
     *
     * @param {string} payment_method - The selected payment method ("aigle" or "mobile-money").
     */
    const handlePaymentMethodSelector = (
        payment_method: "aigle" | "mobile-money"
    ) => {
        if (payment_method === "aigle") {
            setFormData((prev) => ({...prev, paymentMethod: payment_method}));
            setValue("sender.service", "aigle");
            setValue("sender.provider", "");
            setValue("sender.phone_number", "");

            const payload = {
                amount: parseInt(formData.amount),
                payment_method: payment_method,
                account_type: "all",
                transaction_type: "airtime"
            }

            calculateFees(payload, {
                onSuccess: async (data: TransactionFees) => {
                    setFees(data)
                    const adequateFunds = verifyWalletFounds(parseInt(formData.amount), organisation.wallet.balance, data);
                    if (!adequateFunds) return;
                }
            })
        }


        if (payment_method === "mobile-money") {
            setValue("sender.service", "mobile-money");
            setFormData((prev) => ({...prev, paymentMethod: payment_method}));

            const payload = {
                amount: parseInt(formData.amount),
                payment_method: payment_method,
                account_type: "all",
                transaction_type: "airtime"
            }

            calculateFees(payload, {
                onSuccess: async (data: TransactionFees) => {
                    setFees(data)
                }
            })
        }
    };

    /**
     * Verifies if the user has sufficient funds in their wallet to perform a transaction
     *
     * @param {number} amount - The amount to be deducted from the wallet balance
     * @param {number} balance - The current balance in the wallet
     * @param {TransactionFees} fees - The fees associated with the transaction
     * @returns {boolean} - true if the wallet has sufficient funds, false otherwise
     */
    const verifyWalletFounds = (amount: number, balance: number, fees: TransactionFees): boolean => {
        const newSolde = (amount + fees.feesAmount)

        if (newSolde <= balance) return true;

        setValue("sender.service", "");
        setFormData((prev) => ({...prev, paymentMethod: ""}));

        showAlert(
            (
                <>
                    <p>Votre solde est insuffisant.</p>
                    <p>Frais : {fees.feesAmount} XOF</p>
                    <p>Montant à payer : {newSolde} XOF</p>
                    <p>Votre solde : {balance} XOF</p>
                </>
            ),
            "error"
        )

        setStep(4);
        return false;
    };

    const finalAmount = (amount: string, fees: TransactionFees) => {
        if (!amount || !fees) {
            return 0
        }

        return parseInt(amount) + fees.feesAmount;
    }


    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <PurchaseType
                        purchaseTypes={TRANSACTION_TYPES}
                        purchaseType={formData.transactionType}
                        handleSelected={(value) => {
                            setFormData((prev) => ({...prev, transactionType: value}));
                            setValue("transactionType", value);
                        }}
                    />
                );

            case 2:
                return (
                    <CountriesStep
                        selectedCountry={formData.country_code}
                        isLoadingCountries={isLoadingCountries}
                        countries={countries}
                        handleSelectedCountryChange={handleCountrySelect}
                    />
                );

            case 3:
                return (
                    <OperatorsStep
                        isLoadingOperators={isLoadingOperators}
                        operatorSelected={formData.operator}
                        operators={operators}
                        handleOperatorSelected={(operator_id, operator) => {
                            setFormData((prev) => ({...prev, operator: operator}));
                            setValue("receiver.operator_id", operator_id);
                        }}
                    />
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {formData.transactionType === "data"
                                ? "Choix du forfait"
                                : "Montant et numéro du bénéficiaire du crédit"}
                        </h3>
                        {formData.transactionType === "data" ? (
                            <div className="grid grid-cols-1 gap-4">
                                {DATA_PACKAGES[formData.operator]?.map((pkg) => (
                                    <Card
                                        key={pkg.id}
                                        isPressable
                                        onPress={() => {
                                            setFormData((prev) => ({...prev, package: pkg}));
                                        }}
                                        className={`border-2 ${
                                            formData.package?.id === pkg.id
                                                ? "border-primary bg-primary-100"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <CardBody className="flex justify-between items-center p-4">
                                            <span className="font-medium">{pkg.name}</span>
                                            <span className="text-primary">{pkg.price} FCFA</span>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <AirtimeAmountStep
                                register={register}
                                handleAmountChange={handleAmountChange}
                                handleNumberChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        beneficiary_phone_number: value,
                                    }))
                                }
                            />
                        )}
                    </div>
                );

            case 5:
                return (
                    <PaymentMethodStep
                        operators={OPERATORS}
                        selectedPaymentMode={formData.paymentMethod}
                        register={register}
                        watch={watch}
                        handlePaymentModeChange={handlePaymentMethodSelector}
                        handleSenderProviderChange={handleSenderProviderChange}
                        handleMoneyNumberChange={(phone_number) => {
                            setValue("sender.phone_number", phone_number);
                            setFormData((prev) => ({
                                ...prev,
                                debited_phone_number: phone_number,
                            }));
                        }}
                        handleOtpValueChange={(otp) => {
                            setValue("sender.otp", otp);
                            setFormData((prev) => ({...prev, pin: otp}));
                        }}
                    />
                );

            case 6:
                return (
                    <>
                        {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Résumé de l&apos;opération</h3>
            <div className="space-y-2 p-4 bg-default-50 rounded-lg">
              <p><span className="font-semibold">Type:</span> {formData.transactionType === 'data' ? 'Forfait Internet' : 'Crédit de communication'}</p>
              <p><span className="font-semibold">Pays:</span> {countries?.find(op => op.iso_name === formData.country_code.toUpperCase())?.name}</p>
              <p><span className="font-semibold">Opérateur:</span> {formData.operator}</p>
              {formData.transactionType === 'data' ? (
                <p><span className="font-semibold">Forfait:</span> {formData.package?.name} - {formData.package?.price} FCFA</p>
              ) : (
                <p><span className="font-semibold">Montant:</span> {formData.amount} FCFA</p>
              )}
              <p><span className="font-semibold">Paiement:</span> {formData.paymentMethod === 'aigle' ? 'Compte Aigle' : `Mobile Money (${formData.debited_phone_number})`}</p>
              <p><span className="font-semibold">Bénéficiaire:</span> {formData.beneficiary_phone_number} </p>
            </div>
          </div> */}

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Confirmer l&apos;opération
                            </h3>

                            <div className="bg-default-100 p-4 rounded-lg">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={`/img/${
                                                formData.sender_provider === "orange"
                                                    ? "orange"
                                                    : formData.sender_provider === "mtn"
                                                        ? "mtn"
                                                        : formData.sender_provider === "moov"
                                                            ? "moov"
                                                            : formData.sender_provider === "wave"
                                                                ? "wave"
                                                                : "aig-b"
                                            }.png`}
                                            alt={formData.sender_provider}
                                            className="rounded-full w-14 h-14"
                                            width={40}
                                            height={40}
                                        />
                                        <span className="text-sm mt-1">
                                          {watch("sender.phone_number")}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center">
                                        <ArrowRight02Icon className="w-12 h-12 text-primary"/>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={`/img/${
                                                formData.transactionType === "credit"
                                                    ? "client"
                                                    : "reseau"
                                            }.png`}
                                            alt={formData.transactionType}
                                            className=" w-14 h-14"
                                            width={40}
                                            height={40}
                                        />
                                        <span className="text-sm mt-1">
                                          {watch("receiver.phone_number")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-default-100 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm w-1/2">Type de transaction</span>
                                    <span className="font-medium text-end">
                                        {watch("transactionType") === "credit" ? "Crédit de communication" : "Forfait Internet"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm w-1/2">
                                    Opérateur du bénéficiaire
                                  </span>
                                    <span className="font-medium text-end">
                                        {operators.find((o) => o.operator_id === watch("receiver.operator_id"))?.operator}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm w-1/2">Numéro du bénéficiaire</span>
                                    <span className="font-medium text-end">
                                        {watch("receiver.phone_number")}
                                  </span>
                                </div>
                                <div className="flex justify-between  items-center mt-2">
                                    <span className="text-sm w-1/2">Moyen de paiement</span>
                                    <span className="font-medium text-end">
                                        {watch("sender.service") === "aigle" ? "Compte Aigle" : `Mobile Money`}
                                  </span>
                                </div>
                                {watch("sender.phone_number") && (
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm w-1/2">Numéro du prélèvement</span>
                                        <span className="font-medium text-end">
                                          {watch("sender.phone_number")}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-neutral-100/50 border p-4 rounded-lg space-y-2">
                                <div className="text-blue-600 text-sm w-full flex justify-between">
                                    <span className="font-bold">Frais:{' '}</span>
                                    <span className="font-bold">{fees?.feesAmount} FCFA</span>
                                </div>
                                <div className="text-neutral-800 text-sm w-full flex justify-between">
                                    <span className="font-bold">Montant à préveler:{' '}</span>
                                    <span
                                        className="font-bold">{finalAmount(formData.amount, fees)} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div>
            <Modal
                isOpen={isAirtimeOpen}
                onOpenChange={onOpenChange}
                onClose={onAirtimeClose}
                size="sm"
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h2 className="text-xl font-bold">Recharge & Forfaits</h2>
                                    <div className="flex justify-between w-full mt-4">
                                        {Array.from({length: 6}).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-2 flex-1 mx-1 rounded-full ${
                                                    index + 1 <= step ? "bg-primary" : "bg-default-100"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </ModalHeader>
                                <ModalBody>{renderStep()}</ModalBody>
                                <ModalFooter className="flex justify-between">
                                    <Button
                                        variant="light"
                                        onPress={() => step > 1 && handleBack()}
                                        isDisabled={step === 1}
                                    >
                                        Retour
                                    </Button>
                                    <Button
                                        color="primary"
                                        isLoading={isRechargePending}
                                        type="button"
                                        isDisabled={isButtonDisabled}
                                        onPress={() => {
                                            if (step === 6) {
                                                handleSubmit(onSubmit)();
                                            } else {
                                                handleNext();
                                            }
                                        }}
                                    >
                                        {step === 6 ? "Confirmer" : "Suivant"}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Alert/>
        </div>
    );
};
