import {InputOtp} from "@heroui/input-otp";

interface Props {
    password: string
    handlePinSelected: (pin: string) => void
}

export const CodePin = ({password, handlePinSelected}: Props) => {
    return (
        <div className="w-full overflow-x-hidden">
            <h3 className="font-semibold mb-2">Veuillez entrer votre code PIN pour confirmer la transaction</h3>
            <InputOtp type="password" size="lg" length={6} value={password} onValueChange={handlePinSelected}/>
        </div>
    )
}