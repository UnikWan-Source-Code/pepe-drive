import {
    useAccount,
    useContractRead,
} from "wagmi";
import { useState, useEffect } from "react";
import PEPE_DRIVE_CONTRACT from "../../../contract/PepeDrive.json";
import PEPE_DISC_CONTRACT from "../../../contract/PepeDisc.json";
import PEPE_STAKING_CONTRACT from "../../../contract/PepeStaking.json";
import CHARACTER_CONTRACT from "../../../contract/Character.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";
import { ethers } from "ethers";

export default function CheckPepeBalance() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const { balancePepe, setBalancePepe } = useActions();

    const { data, isError, error, isLoading, } = useContractRead({
        address: PEPE_STAKING_CONTRACT,
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

            <div>Your Balance: $PEPE: {balancePepe.toString()}</div>


        </>
    )
}