"use client";

import CheckDiscFreeMintable from "../components/stakingComponents/discs/CheckDiscsFreeMintable"
import MintDiscForFree from "../components/stakingComponents/discs/MintDiscForFree"
import MintDiscPayed from "../components/stakingComponents/discs/MintDiscPayed"
import CheckDiscLevel from "../components/stakingComponents/discs/CheckDiscLevel"
import CheckPepeBalance from "../components/stakingComponents/staking/CheckPepeBalance"
import CheckStakedDriveOwner from "../components/stakingComponents/staking/CheckStakedDriveOwner"
import StakeDrive from "../components/stakingComponents/staking/StakeDrive"
import StakeDisc from "../components/stakingComponents/staking/StakeDisc"
import UnStakeDisc from "../components/stakingComponents/staking/UnStakeDisc"
import UnStakeDrive from "../components/stakingComponents/staking/UnStakeDrive"
import ShowAllStakedTokens from "../components/stakingComponents/staking/ShowAllStakedTokens"
import PrepareMint from "../components/stakingComponents/breeding/PrepareMint"



import {
    useAccount
} from "wagmi";
import useIsSSR from "../hooks/SSRHook";
import { useState, useEffect } from "react";
import { useActions } from "../hooks/useActions";
import styles from "../styles/Home.module.css";



export default function Staking() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const { currentOwner, setCurrentOwner } = useActions();

    const [connected, setConnected] = useState(false);


    useEffect(() => {
        setConnected(isConnected);
    }, [isConnected]);


    const isSSR = useIsSSR();

    if (isSSR) return null;
    return (
        <>
            <div className="flex flex-col justify-center items-center space-y-16">

                <div className="text-7xl">BREEDING CONTRACT INTERACTION</div>

                {isConnected && <div>  {address}
                </div>}

                <CheckPepeBalance />
                <CheckDiscLevel />
                <PrepareMint />


            </div>


        </>
    )
}