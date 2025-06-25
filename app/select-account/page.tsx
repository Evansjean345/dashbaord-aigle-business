import React from 'react';
import SelectAccount from "@/components/select-account/SelectAccount";

const accounts = [
    {id: 1, name: "account1"},
    {id: 2, name: "account2"},
    {id: 3, name: "account3"},
    {id: 4, name: "account4"},
]

const SelectAccountPage = () => {
    return <SelectAccount/>
};

export default SelectAccountPage;