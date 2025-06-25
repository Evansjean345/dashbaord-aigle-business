import {Button, Tooltip} from "@heroui/react";
import {
    MoneySend01Icon,
    MailSend02Icon,
    WalletAdd01Icon,
    AiPhone02Icon
} from 'hugeicons-react';
import Image from "next/image";
import {Swiper, SwiperSlide} from 'swiper/react';
import {EffectCards, Pagination} from 'swiper/modules';
import {useAuth} from '@/hooks/useAuth'
import {useOrganisation} from '@/hooks/useOrganisation'
import ModalSendMessage from "@/components/messages/sendMessage";
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import {useState} from "react";
import {TransfertForm} from "../transfert/transfert";
import AddSupply from "@/components/supply/addSupply";
import {AddAirtimes} from "@/components/airtimes/addAirtimes";
import {useOrganisationStore} from "@/stores/organisationStore";
import {ActiveOrganisation} from "@/types/organisation.types";

const networks = [
    {id: "mtn", name: "MTN Money", icon: "/img/mtn.png"},
    {id: "orange", name: "Orange Money", icon: "/img/orange.png"},
    {id: "moov", name: "Moov Money", icon: "/img/moov.png"},
    {id: "wave", name: "Wave", icon: "/img/wave.png"},
];

export const CardWalletStart = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenTransfert, setIsModalOpenTransfert] = useState(false);
    const [isSupplyOpen, setIsSupplyOpen] = useState(false);
    const [isAirtimeOpen, setIsAirtimeOpen] = useState(false);

    const pagination = {
        clickable: true,
        renderBullet: function ({index, className}: { index: number, className: string }) {
            return ('<span className="' + className + '">' + (index + 1) + '</span>');
        },
    };

    const MainCard = ({organisation}: { organisation: ActiveOrganisation }) => (
        <div
            className="h-48 w-full rounded-xl bg-gradient-to-r from-primary-400 to-teal-600 shadow-2xl p-4 overflow-hidden">
            <div className=" flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <p className="text-white text-xl font-semibold">{organisation?.name}</p>
                    <Image src="/img/aigle.png" alt="logo" width={70} height={70}/>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-white/80 text-sm">Solde principal</p>
                    </div>
                    <p className="text-white text-5xl font-bold">{organisation?.wallet?.balance}<span
                        className="text-xs">FCFA</span></p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="mx-auto w-full p-2">
                <MainCard organisation={activeOrganisation}/>
            </div>

            <div className="flex justify-between w-full mx-auto border-t border-b p-2">
                <div className="flex flex-col items-center">
                    <Tooltip
                        color="primary"
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Envoyé de l&apos;argent</div>
                            </div>
                        }
                    >
                        <Button
                            onPress={() => setIsModalOpenTransfert(true)}
                            isIconOnly
                            size="lg"
                            color="primary"
                            variant="shadow" className="py-2"
                        >
                            <MoneySend01Icon/>
                        </Button>
                    </Tooltip>
                    <p className="text-md font-semibold mt-1">Transfert</p>
                </div>
                <div className="flex flex-col items-center">
                    <Tooltip
                        color="success"
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Airtimes</div>
                            </div>
                        }
                    >
                        <Button onPress={() => setIsAirtimeOpen(true)} size="lg" isIconOnly color="success"
                                variant="shadow" className="py-2">
                            <AiPhone02Icon/>
                        </Button>
                    </Tooltip>
                    <p className="text-md font-semibold mt-1">Airtimes</p>
                </div>
                <div className="flex flex-col items-center">
                    <Tooltip
                        color="secondary"
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Envoyé le lien de paiement</div>
                            </div>
                        }
                    >
                        <Button onPress={() => setIsModalOpen(true)} isIconOnly size="lg" color="secondary"
                                variant="shadow" className=" ">
                            <MailSend02Icon/>
                        </Button>
                    </Tooltip>
                    <p className="text-md font-semibold mt-1">Lien</p>
                </div>
                <div className="flex flex-col items-center">
                    <Tooltip
                        color="warning"
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Demande d&apos;approvisionnement</div>
                            </div>
                        }
                    >
                        <Button onPress={() => setIsOpen(true)} size="lg" isIconOnly color="warning" variant="shadow"
                                className="py-1">
                            <WalletAdd01Icon/>
                        </Button>
                    </Tooltip>
                    <p className="text-md font-semibold mt-1">Demande</p>
                </div>

            </div>

            {isModalOpen && (
                <ModalSendMessage
                    isOpen={isModalOpen}
                    linkPayment={`${process.env.NEXT_PUBLIC_MARCHAND_URL}/${activeOrganisation?.qr_code?.code}`}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isModalOpenTransfert && (
                <TransfertForm
                    isOpen={isModalOpenTransfert}
                    handleClose={() => setIsModalOpenTransfert(false)}
                />
            )}
            {isSupplyOpen && (
                <AddSupply
                    isOpen={isSupplyOpen}
                    onClose={() => setIsSupplyOpen(false)}
                />
            )}
            {isAirtimeOpen && (
                <AddAirtimes
                    isAirtimeOpen={isAirtimeOpen}
                    onAirtimeClose={() => setIsAirtimeOpen(false)}
                />
            )}
        </>
    );
};
