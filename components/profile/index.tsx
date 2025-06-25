'use client'

import {useAuth} from "@/hooks/useAuth";
import {useUser} from "@/hooks/useUser";
import {useTransaction} from "@/hooks/useTransaction";
import {useForm} from "react-hook-form";
import {Autocomplete, AutocompleteItem, Avatar, Button, Card, CardBody, Divider, Input} from "@heroui/react";
import {Cancel01Icon, CloudUploadIcon, Edit01Icon} from 'hugeicons-react'
import Image from "next/image";
import {useState} from "react";
import {updateUserPayload} from "@/types/user.types";
import {Alert} from "../alert/alert";
import {useCountry} from "@/hooks/useCountry";
import { useOrganisationStore } from "@/stores/organisationStore";
import { useAuthStore } from "@/stores/authStore";

export const Profile = () => {

    const {user} = useAuthStore();
    const activeOrganisation = useOrganisationStore(state => state.organisation)

    const [selectedCountry, setSelectedCountry] = useState(null);
    const {countries} = useCountry();
    const {updateUser, isUpdatingUser} = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const {register, setValue, handleSubmit, formState: {errors}} = useForm<updateUserPayload>();
    const [formData, setFormData] = useState({
        userName: user?.fullname,
        userPhone: user?.phone,
        userEmail: user?.email,
        OrganisationName: activeOrganisation?.name,
        // OrganisationEmail: profile?.organisation.email,
        OrganisationPhone: user.phone,
    });
    const getRelativeDate = (date: string) => {
        const today = new Date();
        const transactionDate = new Date(date);
        const diffDays = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (diffDays) {
            case 1:
                return "Hier";
            case 2:
                return "Avant-hier";
            default:
                return transactionDate.toLocaleDateString();
        }
    };


    const WalletCard = () => (
        <div
            className="relative h-48 w-full rounded-xl bg-gradient-to-r from-primary-400 to-teal-600 backdrop-blur-xl p-4 overflow-hidden">
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <p className="text-white text-xl font-semibold">{activeOrganisation?.name}</p>
                    <Image src="/img/aigle.png" alt="logo" width={70} height={70}/>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-white/80 text-sm">Solde principal</p>
                    </div>
                    <p className="text-white text-5xl font-bold">{activeOrganisation?.wallet?.balance} <span
                        className="text-xs">FCFA</span></p>
                </div>
            </div>
        </div>
    );

    const onSubmit = async (data: updateUserPayload) => {
        try {
            updateUser({
                ...data,
                organisation_id: activeOrganisation?.organisation_id,
                // countryCode: selectedCountry,
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const PersonalInfo = () => {
        const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {

            const value = e.target.value;
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
            setValue(field === 'userName' ? 'fullname' : 'phone', value);
        };

        const handleCountrySelect = (country: any) => {
            setSelectedCountry(country);
            setValue("countryCode", selectedCountry);
        };

        return (
            <Card className="p-4 shadow-xs border">
                <CardBody>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Informations Personnelles</h2>
                        <Button
                            color={isEditing ? "danger" : "primary"}
                            variant="light"
                            onPress={() => setIsEditing(!isEditing)}
                            className={`border-2 ${isEditing ? "border-danger-500" : "border-primary-500"}`}
                        >
                            {isEditing ? (
                                <>
                                    Annuler
                                    <Cancel01Icon/>
                                </>
                            ) : (
                                <>
                                    Modifier
                                    <Edit01Icon/>
                                </>
                            )
                            }
                        </Button>
                    </div>

                    <div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    variant="bordered"
                                    {...register("fullname")}
                                    label="Nom complet"
                                    value={formData.userName}
                                    isDisabled={!isEditing}
                                    onChange={handleInputChange('userName')}
                                />

                                <Input
                                    variant="bordered"
                                    {...register("phone")}
                                    label="Téléphone"
                                    value={formData.userPhone}
                                    isDisabled={!isEditing}
                                    onChange={handleInputChange('userPhone')}
                                />

                                <input
                                    // variant="bordered"
                                    {...register("email")}
                                    // label="Email"
                                    value={formData.userEmail}
                                    // isReadOnly={!isEditing}
                                />

                                <Autocomplete
                                    label="Sélectionner un pays"
                                    value={selectedCountry}
                                    onSelectionChange={handleCountrySelect}
                                    variant="bordered"
                                    // defaultSelectedKey={profile?.user?.country?.id}
                                    defaultSelectedKey={"52"}
                                    isDisabled={!isEditing}
                                >
                                    {countries?.map((country) => (
                                        <AutocompleteItem
                                            key={country.id}
                                            value={country.id}
                                            startContent={
                                                <Avatar
                                                    alt={country.name}
                                                    className="w-6 h-6"
                                                    src={`https://flagcdn.com/${country?.isoTwo?.toLowerCase()}.svg`}
                                                />
                                            }
                                        >
                                            {country.name}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>

                                {/* <Autocomplete
                  label="Pays"
                  value={selectedCountry}
                  // defaultSelectedKey={profile?.user?.country?.iso_two}
                  defaultSelectedKey={"CI"}
                  onSelectionChange={(countryId) => {
                    handleCountrySelect(countryId);
                    setValue("countryCode", countryId);
                  }}
                  variant="bordered"
                  isRequired
                >
                  {countries?.map((country) => (
                    <AutocompleteItem
                      key={country.id}
                      value={country.id}
                      startContent={
                        <Avatar
                          alt={country.name}
                          className="w-6 h-6"
                          src={`https://flagcdn.com/${country?.isoTwo?.toLowerCase()}.svg`}
                        />
                      }
                    >
                      {country.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete> */}

                                {
                                    /**
                                     <Input
                                     variant="bordered"

                                     label="Email"
                                     value={formData.userPhone}
                                     isReadOnly={!isEditing}
                                     />
                                     */
                                }
                            </div>

                            {isEditing && (
                                <div className="flex justify-end mt-4">
                                    <Button
                                        color="primary"
                                        type="submit"
                                        isLoading={isUpdatingUser}
                                        // onClick={handleSubmit(async (data) => {
                                        //   await updateUser(data);
                                        //   setIsEditing(false);
                                        // })}
                                    >
                                        Sauvegarder
                                    </Button>
                                </div>
                            )}
                        </form>

                    </div>


                </CardBody>
            </Card>
        );
    };

    const Documents = () => (
        <Card className="p-4 shadow-xs border">
            <CardBody>
                <h2 className="text-xl font-bold mb-6">Documents</h2>

                <div className="space-y-4">
                    <div className="w-full flex-col justify-start items-start gap-2.5 flex">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center py-6 w-full border border-default-300 border-dashed rounded-2xl cursor-pointer bg-default-50 "
                        >
                            <div className="mb-3 flex items-center justify-center">
                                <CloudUploadIcon className="text-cyan-600 w-10 h-10"/>
                            </div>
                            <span className="text-center text-default-400 text-xs font-normal leading-4 mb-1">
                PNG, JPG ou PDF, inférieur 15MB
              </span>
                            <h6 className="text-center text-default-900 text-sm font-medium leading-5">
                                Veuillez séléctionner votre document
                            </h6>
                            <input id="dropzone-file" type="file" className="hidden"/>
                        </label>
                    </div>


                    <div className="w-full flex-col justify-start items-start gap-2.5 flex">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center py-6 w-full border border-default-300 border-dashed rounded-2xl cursor-pointer bg-default-50 "
                        >
                            <div className="mb-3 flex items-center justify-center">
                                <CloudUploadIcon className="text-cyan-600 w-10 h-10"/>
                            </div>
                            <span className="text-center text-default-400 text-xs font-normal leading-4 mb-1">
                PNG, JPG ou PDF, inférieur 15MB
              </span>
                            <h6 className="text-center text-default-900 text-sm font-medium leading-5">
                                Veuillez séléctionner votre document
                            </h6>
                            <input id="dropzone-file" type="file" className="hidden"/>
                        </label>
                    </div>

                </div>
            </CardBody>
        </Card>
    );
    const OrganizationInfoCard = () => {
        const {profile} = useAuth();

        return (
            <Card className="p-4 shadow-xs border">
                <CardBody className="gap-4">
                    <h3 className="text-xl font-semibold">Informations du compte professionnel</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Image src="/img/aigle.png" alt="Organization Logo" width={60} height={60}/>
                            <div>
                                <p className="font-semibold">{activeOrganisation?.name}</p>
                                <p className="text-sm text-default-500">{activeOrganisation?.account_type}</p>
                            </div>
                        </div>
                        <Divider/>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-default-500">ID du compte professionnel</p>
                                <p className="font-medium">{activeOrganisation?.organisation_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-default-500">Telephone du compte professionnel</p>
                                <p className="font-medium">{profile?.organisation?.phone_number}</p>
                            </div>
                            {/* <div>
                <p className="text-sm text-default-500">E-mail du compte professionnel</p>
                <p className="font-medium">{profile?.organisation.}</p>
              </div> */}
                            {/* <div>
                <p className="text-sm text-default-500">Date de création</p>
                <p className="font-medium">{new Date(profile?.organisation?.createdAt).toLocaleDateString()}</p>
              </div> */}
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    };

    const ActivityCard = () => {
        const {transactions} = useTransaction();

        return (
            <Card className="p-4 shadow-xs border">
                <CardBody className="gap-4">
                    <h3 className="text-xl font-semibold">Activités Récentes</h3>
                    <div className="space-y-4">
                        {transactions?.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="flex  items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* <div className={`p-2 rounded-lg ${transaction.status === 'failed'
                  ? 'bg-danger-100 text-danger-500'
                  : transaction.status === 'success'
                    ? 'bg-success-100 text-success-500'
                    : 'bg-warning-100 text-warning'
                  }`}>
                  {transaction.transactionType === 'payout' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div> */}
                                    <div className="flex items-center gap-2">
                                        {transaction.transactionType === 'airtime' ? (
                                            <Image className="" src={`/img/client.png`} alt="logo" width={45}
                                                   height={45}/>
                                        ) : (
                                            <Image className="rounded-full overflow"
                                                   src={`/img/${transaction.paymentDetails?.provider}.png`} alt="logo"
                                                   width={45} height={45}/>
                                        )
                                        }
                                    </div>
                                    <div>
                                        <div className="flex font-semibold">
                                            {
                                                transaction.transactionType === 'payout' ? (<><p
                                                        className="text-base">Transfert</p> </>)
                                                    : (transaction.transactionType === 'airtime') ? (<><p
                                                            className="text-lg">Crédit airtime</p></>)
                                                        : (<><p className="text-lg">Paiement</p></>)
                                            }
                                        </div>
                                        <p className="font-medium">{transaction.status === 'success' ? 'Succès' : transaction.status === 'pending' ? 'En attente' : 'Echec'}</p>

                                    </div>
                                </div>

                                <div>
                                    <p className={`font-semibold flex justify-end items-center gap-2 ${transaction.status === 'failed'
                                        ? ' text-danger-500'
                                        : transaction.status === 'success'
                                            ? ' text-success-500'
                                            : ' text-warning'
                                    }`}>
                                        {transaction.transactionType === 'payout' ? '-' : '+'}{transaction.amount} FCFA
                                    </p>
                                    <p className="text-sm text-default-500">
                                        {getRelativeDate(transaction.createdAt)}{" à "}
                                        {new Date(transaction.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>

                            </div>
                        ))}
                        <div className="flex justify-end">
                            <Button size="sm" color="primary">
                                Voir plus
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    };
    return (
        <div className="h-[calc(100vh-150px)] lg:px-6">
            <div
                className="flex justify-center gap-4 xl:gap-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-4 max-w-[90rem] mx-auto w-full">
                <div className="gap-6 flex flex-col w-full">
                    {/* Left Section */}
                    <div className="flex flex-col gap-2">
                        <div className=" justify-center w-full">
                            <PersonalInfo/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="  justify-center w-full">
                            <OrganizationInfoCard/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="  justify-center w-full">
                            <ActivityCard/>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="gap-2 flex flex-col xl:max-w-md w-full">
                    <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
                        <WalletCard/>
                        <Documents/>
                    </div>
                </div>
            </div>
            <Alert/>
        </div>
    );
};
