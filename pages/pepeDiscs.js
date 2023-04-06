"use client";

import CheckDiscFreeMintable from "../components/stakingComponents/discs/CheckDiscsFreeMintable"
import MintDiscForFree from "../components/stakingComponents/discs/MintDiscForFree"
import MintDiscPayed from "../components/stakingComponents/discs/MintDiscPayed"
import CheckDiscLevel from "../components/stakingComponents/discs/CheckDiscLevel"
import {
    useAccount
} from "wagmi";
import useIsSSR from "../hooks/SSRHook";
import { useState, useEffect } from "react";
import { useActions } from "../hooks/useActions";



export default function pepeDiscs() {
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

                <div className="text-7xl">DISC CONTRACT INTERACTION</div>

                {isConnected && <div>  {address}
                </div>}
                <CheckDiscFreeMintable />
                {(address == currentOwner) && <MintDiscForFree />}
                <MintDiscPayed />

                <CheckDiscLevel />

            </div>


        </>
    )
}