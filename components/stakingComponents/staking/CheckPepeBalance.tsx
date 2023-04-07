import {
    useAccount,
    useContractRead,
} from "wagmi";
import { useState, useEffect } from "react";
import PEPE_STAKING_CONTRACT from "../../../contract/PepeStaking.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";
import { ethers } from "ethers";

export default function CheckPepeBalance() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const { balancePepe, setBalancePepe } = useActions();

    const { data, isError, error, isLoading, } = useContractRead({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: 'balanceOf',
        args: [address],

    })



    useEffect(() => {
        console.log(error)
    }, [isError])




    useEffect(() => {
        console.log(data)
        if (data != undefined) {
            setBalancePepe(ethers.BigNumber.from(balancePepe));
            console.log("result: ", data)
        }

    }, [data])


    // console.log("fkn result: ", data)


    return (
        <>

            <div className="border-2 border-black w-1/2 p-4">Your Balance: $PEPE: {balancePepe.toString()}</div>


        </>
    )
}