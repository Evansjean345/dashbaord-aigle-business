import { Card, CardBody, Input, Select, SelectItem } from "@heroui/react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { rechargePayload } from "@/types/airtimes.types";

interface Props {
  operators: any[];
  selectedPaymentMode: string;
  register: UseFormRegister<rechargePayload>;
  watch: UseFormWatch<rechargePayload>;
  handlePaymentModeChange: (payment_mode: string) => void;
  handleSenderProviderChange: (sender_provider: string) => void;
  handleMoneyNumberChange: (phone_number: string) => void;
  handleOtpValueChange: (otp_value: string) => void;
}

export const PaymentMethodStep = ({
  operators,
  register,
  watch,
  selectedPaymentMode,
  handlePaymentModeChange,
  handleSenderProviderChange,
  handleMoneyNumberChange,
  handleOtpValueChange,
}: Props) => {
    
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Mode de paiement</h3>
      <div className="grid grid-cols-1 gap-4">
        <Card
          isPressable
          onPress={() => handlePaymentModeChange("aigle")}
          className={`border-2 ${
            selectedPaymentMode === "aigle"
              ? "border-primary bg-primary-100"
              : "border-transparent"
          }`}
        >
          <CardBody className="p-4">
            <span className="font-medium">Compte Aigle</span>
          </CardBody>
        </Card>
        <Card
          isPressable
          onPress={() => handlePaymentModeChange("mobile-money")}
          className={`border-2 ${
            selectedPaymentMode === "mobile-money"
              ? "border-primary bg-primary-100"
              : "border-transparent"
          }`}
        >
          <CardBody className="p-4">
            <span className="font-medium">Mobile money</span>
          </CardBody>
        </Card>
        {selectedPaymentMode === "mobile-money" && (
          <>
            <Select
              label="Choisir un opérateur"
              placeholder="Choisir un opérateur"
              variant="bordered"
              isRequired
              {...register("sender.provider", { required: true })}
              onChange={(e) => handleSenderProviderChange(e.target.value)}
            >
              {operators?.map((operator) => (
                <SelectItem key={operator.id} value={operator.id}>
                  {operator.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Numéro de téléphone"
              placeholder="Entrez le numéro"
              onChange={(e) => handleMoneyNumberChange(e.target.value)}
            />
            {watch("sender.provider") === "orange" && (
              <Input
                label="Code OTP"
                placeholder="Tapez le #144*82# puis entrez le code reçu"
                onChange={(e) => handleOtpValueChange(e.target.value)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
