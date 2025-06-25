import Image from "next/image";

interface Props {
    title: string
}

export const AuthHeader = ({title}: Props) => {
    return (
        <div className="font-bold mb-8 flex flex-col items-center justify-center">
            <Image
                className="rounded-full"
                src="/img/aig-b.png"
                alt="logo"
                width={100}
                height={100}
            />
            <h3 className="text-[19px] lg:text-[22px]">{title}</h3>
        </div>
    )
}