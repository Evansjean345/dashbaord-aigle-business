import { Card, CardBody } from "@heroui/react";
import React from "react";
import { Wallet02Icon } from 'hugeicons-react'
import { useAuth } from "@/hooks/useAuth";
export const CardBalance1 = () => {
  const { profile } = useAuth();

  return (
    <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-none px-3 w-full">
      <CardBody className="py-5 overflow-hidden">
        <div className="flex gap-2.5">
          <Wallet02Icon className="text-primary" />
          <div className="flex flex-col">
            <span className="text-primary">Solde </span>
            {/* <span className="text-white text-xs">1311 Cars</span> */}
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-2xl font-bold">
            {profile?.wallet.balance}{" "}
            <span className=" text-xs font-bold">FCFA</span></span>
        </div>
        {/* <div className="flex items-center gap-6">
          <div>
            <div>
              <span className="font-semibold text-success text-xs">{"↓"}</span>
              <span className="text-xs text-white">100,930</span>
            </div>
          </div>

          <div>
            <div>
              <span className="font-semibold text-danger text-xs">{"↑"}</span>
              <span className="text-xs text-white">54,120</span>
            </div>
          </div>

          <div>
            <div>
              <span className="font-semibold text-danger text-xs">{"⭐"}</span>
              <span className="text-xs text-white">125</span>
            </div>
          </div>
        </div> */}
      </CardBody>
    </Card>
  );
};
