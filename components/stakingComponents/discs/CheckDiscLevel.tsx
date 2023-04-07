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
import { readContract } from '@wagmi/core'
import { BigNumber } from "ethers";

export default function CheckDiscLevel() {

    interface TokenObject {
        tokenType: string;
        discLevel: string;
    }

    const { address, connector, isConnected } = useAccount();
    const [tokenmap, setTokenMap] = useState<Map<string, [string, string]>>();

    const [loading, setLoading] = useState(false)
    const { refetchDisc } = useActions();
    const { refetchBreeding } = useActions();
    const RARITY = ["FARMER", "BULL", "BEAR"]


    const {
        data: readData,
        isError: isReadError,
        isLoading: isReadLoading,
        error: readError,
        refetch
    } = useContractRead({
        address: CONTRACTS.PEPE_DISC,
        abi: PEPE_DISC_CONTRACT.abi,
        functionName: 'tokensOfOwner',
        args: [address],


    });


    useEffect(() => {
        refetch?.()
    }, [refetchDisc, refetchBreeding])



    useEffect(() => {
        console.log("isReadError: ", isReadError);
        console.log(readError)
    }, [isReadError]);

    const fetchTokenData = async () => {
        refetch?.()
        setLoading(true);

        console.log("fetch token data:", readData)
        console.log("readData[0]", readData[0])
        console.log("readData[0]", readData[1])

        const arrayLength = (readData as BigNumber[]).length;


        const tokenMap: Map<string, [string, string]> = new Map<string, [string, string]>();


        for (let i = 0; i < arrayLength; i++) {
            const tokenId = readData[i];
            try {
                console.log("here", i)
                console.log("hexNumbers:", readData[i])
                const tokenObject = await readContract({
                    address: CONTRACTS.PEPE_DISC,
                    abi: PEPE_DISC_CONTRACT.abi,
                    functionName: 'discDetails',
                    args: [readData[i]]
                }) as TokenObject;


                tokenMap.set(tokenId.toString(), [tokenObject.tokenType.toString(), tokenObject.discLevel.toString()]);

                console.log(`Token object for tokenId ${tokenId.toString()}:`, tokenObject.tokenType.toString());
            } catch (error) {
                console.error(`Error fetching token object for tokenId ${tokenId.toString()}:`, error);
            }
        }

        setLoading(false);

        setTokenMap(tokenMap);

    };

    // useEffect(() => {
    //     console.log("readData:", readData)
    //     if (typeof readData !== 'undefined' && readData[0] != null) {

    //         fetchTokenData();
    //     }
    // }, [readData]);

    if (typeof tokenmap !== 'undefined') {
        if (tokenmap.size > 0) {
            return (
                <div className="flex flex-col items-center border-2 border-black p-4 w-1/2 m-8">
                    <div className="border-rounded border-2 p-2 border-black cursor-pointer" onClick={fetchTokenData}>YOUR TOKENS: (REFRESH)</div>
                    <ul>
                        {Array.from(tokenmap.entries()).map(([tokenId, [discType, discLevel]]) => (  //([tokenId, [discType, discLevel]])
                            <li key={tokenId}>
                                TOKEN ID: {tokenId} - Rarity: {RARITY[discType]} - Level: {discLevel}
                            </li>
                        ))}
                    </ul>

                </div>
            )
        }
        else {
            return (
                <div className="flex flex-col items-center border-2 border-black p-4 w-1/2 m-8">
                    <div className="border-rounded border-2 p-2 border-black cursor-pointer" onClick={fetchTokenData}>NO TOKENS, YET. (REFRESH?)</div>
                </div>)

        }
    }
    else {
        return (
            <div className="flex flex-col items-center border-2 border-black p-4 w-1/2 m-8">
                <div className="border-rounded border-2 p-2 border-black cursor-pointer" onClick={fetchTokenData}>{loading ? <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6z"></path>
                    </svg>
                    <span>Loading...</span>
                </div> : <div>SHOW MY DISCS</div>}</div>
            </div>)
    }

}
