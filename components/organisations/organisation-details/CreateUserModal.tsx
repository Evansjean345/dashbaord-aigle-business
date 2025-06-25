import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Autocomplete,
    AutocompleteItem,
} from "@heroui/react";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {useUser} from "@/hooks/useUser";
import {createUserPayload} from "@/types/user.types";
import {useCountry} from "@/hooks/useCountry";
import {Eye, EyeOff} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    organisationId: string;
}

export const CreateUserModal = ({isOpen, onClose, organisationId}: Props) => {
    const [step, setStep] = useState(1);
    const [otpValue, setOtpValue] = useState("");
    const [canResendOTP, setCanResendOTP] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const {isCreatingUser, createUser, confirmUser, isConfirmingUser} = useUser();
    const {countries} = useCountry();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {errors},
    } = useForm<createUserPayload>({
        defaultValues: {
            organisation_id: organisationId,
            country_id: "52",
            role: "member"
        }
    });

    useEffect(() => {
        setValue("organisation_id", organisationId);
    }, [organisationId, setValue]);

    const onSubmit = (data: createUserPayload) => {
        if (step === 1) {
            createUser(data, {
                onSuccess: () => {
                    setStep(2);
                    setTimeout(() => setCanResendOTP(true), 30000);
                }
            });
        } else if (step === 2) {
            confirmUser({
                phone_number: data.phone,
                otp: otpValue,
                country_id: data.country_id,
            }, {
                onSuccess: () => {
                    onClose();
                    setStep(1);
                    setOtpValue("");
                }
            });
        }
    };

    const [step, setStep] = useState(1);
    const [otpValue, setOtpValue] = useState("");
    const [canResendOTP, setCanResendOTP] = useState(false);

    const handleCountrySelect = (countryId: string) => {
        setValue("country_id", countryId);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="sm" placement="center">
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === 1 ? (
                        <>
                            <ModalBody>
                                <h2 className="text-lg font-semibold mb-4">Créer un nouvel utilisateur</h2>

                                <Input
                                    {...register("fullname", {required: true})}
                                    label="Nom Complet"
                                    isRequired
                                />

                                <Autocomplete
                                    label="Pays"
                                    defaultValue=""
                                    onSelectionChange={(countryId: string) => setValue("country_id", countryId)}
                                >
                                    {countries?.map(country => (
                                        <AutocompleteItem key={country.id} value={country.id}>
                                            {country.name}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>

                                <Input
                                    {...register("phone", {required: true})}
                                    label="Numéro de téléphone"
                                />

                                <Input
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 6,
                                        pattern: /^[0-9]{6}$/
                                    })}
                                    label="Code PIN (6 chiffres)"
                                    type={isVisible ? "text" : "password"}
                                    endContent={
                                        <button type="button" onClick={() => setIsVisible(!isVisible)}>
                                            {isVisible ? <Eye/> : <EyeOff/>}
                                        </button>
                                    }
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>Annuler</Button>
                                <Button isLoading={isCreatingUser} type="submit" color="primary">Créer</Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalBody>
                                <h2 className="text-lg font-semibold mb-4">Vérification OTP</h2>
                                <p className="mb-3">
                                    Entrez l'OTP envoyé au numéro : <strong>{watch("phone")}</strong>
                                </p>
                                <InputOTP value={otpValue} onChange={setOtpValue}>
                                    <InputOTPGroup>
                                        {[...Array(5)].map((_, index) => (
                                            <InputOTPSlot key={index} index={index}/>
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>

                                {canResendOTP && (
                                    <Button variant="light" onPress={() => {
                                        otpResend({phone_number: watch("phone")});
                                        setCanResendOTP(false);
                                        setTimeout(() => setCanResendOTP(true), 30000);
                                    }}>
                                        Renvoyer le code
                                    </Button>
                                )}
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button type="submit" isLoading={isConfirmingUser} color="primary">
                                    Confirmer OTP
                                </Button>
                            </ModalFooter>
                        </>
                    ) : null}
                </form>
            </ModalContent>
        </Modal>
    );
};