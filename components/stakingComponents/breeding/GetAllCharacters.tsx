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

export default function GetAllCharacters() {

    // const [tokens, setTokens] = useState<Discs[]>([]);



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
        <div>
            {readData !== undefined && (
                <>
                    <h2>YOUR BREEDING PROCESS:</h2>
                    {readData.map((token, index) => (
                        <div key={index}>
                            <div>TokenID: {token[0].toString()}, Rarity:{RARITY[token[1]]}, Ready: {new Date(token[2] * 1000).toLocaleString()}</div>
                        </div>
                    ))}
                </>
            )}
        </div>

    )

}
