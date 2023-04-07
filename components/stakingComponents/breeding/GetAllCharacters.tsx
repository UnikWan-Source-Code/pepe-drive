import {
    useAccount,
    useContractRead,
} from "wagmi";
import { useState, useEffect } from "react";
import CHARACTER_CONTRACT from "../../../contract/Character.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";
import { readContract } from '@wagmi/core'
import { BigNumber } from "ethers";

export default function GetAllCharacters() {

    const { address, connector, isConnected } = useAccount();
    const [tokenmap, setTokenMap] = useState<Map<string, [string, string]>>();

    const [loading, setLoading] = useState(false)
    const { refetchBreeding } = useActions();
    const RARITY = ["FARMER", "BULL", "BEAR"]




    const {
        data: readData,
        isError: isReadError,
        isLoading: isReadLoading,
        error: readError,
        refetch
    } = useContractRead({
        address: CONTRACTS.CHARACTER,
        abi: CHARACTER_CONTRACT.abi,
        functionName: 'getAllMyCharacters',
        args: [address],


    });


    useEffect(() => {
        refetch?.()
    }, [refetchBreeding])


    return (
        <div className="flex flex-col items-center border-2 border-black p-4 w-1/2">
            <div className="text-gray-400">HERE YOU CAN CHECK WHEN YOU CAN MINT YOUR CHARACTERS</div>

            {readData !== undefined && (readData as []).length != 0 ? (
                <>

                    <h2>YOUR BREEDING PROCESS:</h2>
                    {(readData as BigNumber[]).map((token, index) => (
                        <div key={index}>
                            <div>TokenID: {token[0].toString()}, Rarity:{RARITY[token[1]]}, Ready: {new Date(token[2] * 1000).toLocaleString()}</div>
                        </div>
                    ))}
                </>
            ) : (<div>YOU HAVE NO CHARACTERS IN BREEDING</div>)}
        </div>

    )

}
