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
import { BigNumber } from "ethers";
import { readContract } from '@wagmi/core'

export default function ShowAllStakedTokens() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [driveID, setDriveID] = useState();
    const [stringDrives, setStringDrives] = useState([])
    const [stringDiscs, setStringDiscs] = useState([])

    const [driveMap, setDriveMap] = useState<Map<string, [string, string]>>();
    const [loading, setLoading] = useState(false)

    const { driveToQuery, setDriveToQuery } = useActions();

    const { refetchStake } = useActions();


    enum TokenType {
        DISC,
        DRIVE
    }


    const { data: discs, isError: isReadDiscError, error: readDiscError, refetch: refetchDiscs } = useContractRead({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: 'returnTokensOfOwner',
        args: [address, TokenType.DISC],

    })

    const { data: drives, isError: isReadDrivesError, error: readDrivesError, refetch: refetchDrives } = useContractRead({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: 'returnTokensOfOwner',
        args: [address, TokenType.DRIVE],

    })

    useEffect(() => {
        console.log(readDiscError)
        console.log(readDrivesError)
    }, [isReadDiscError, isReadDrivesError])

    useEffect(() => {
        refetchDrives?.()
        refetchDiscs?.()
    }, [refetchStake])


    console.log("DRIVES: ", drives)
    console.log("DISCS: ", discs)


    const handleInputChange = (event) => {
        setDriveID(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("drive ID in handle Submit: ", driveID); // replace with your submit logic
        setDriveToQuery(driveID);
    };



    useEffect(() => {
        if (drives != undefined) {
            setStringDrives(drives.map((number) => number.toString()));
        }
        if (discs != undefined) {
            setStringDiscs(discs.map((number) => number.toString()));
        }

    }, [drives, discs])




    const fetchTokenData = async () => {
        refetchDrives?.()
        setLoading(true);

        // console.log("fetch token data:", readData)
        // console.log("readData[0]", readData[0])
        // console.log("readData[0]", readData[1])

        const arrayLength = (drives as BigNumber[]).length;


        const tokenMap: Map<string, boolean> = new Map<string, boolean>();


        for (let i = 0; i < arrayLength; i++) {
            const tokenId = drives[i];
            try {
                console.log("here", i)
                console.log("hexNumbers:", drives[i])
                const tokenObject = await readContract({
                    address: CONTRACTS.PEPE_STAKING,
                    abi: PEPE_STAKING_CONTRACT.abi,
                    functionName: 'discInDrive',
                    args: [drives[i]]
                });

                tokenMap.set(tokenId.toString(), tokenObject.toString());



                console.log(`Token object for tokenId ${tokenId.toString()}:`, tokenObject.toString());
            } catch (error) {
                console.error(`Error fetching token object for tokenId ${tokenId.toString()}:`, error);
            }

        }

        setLoading(false);

        setDriveMap(tokenMap);

    };


    return (
        <>

            <div>
                YOUR STAKED DRIVES:
                {stringDrives != undefined &&
                    stringDrives.map((number, index) => (
                        <p key={index}>{number}</p>
                    ))}


            </div>

            <div>
                YOUR STAKED DISCS:
                {stringDiscs != undefined &&
                    stringDiscs.map((number, index) => (
                        <p key={index}>{number}</p>
                    ))}


            </div>

            {(typeof driveMap !== 'undefined' && driveMap.size > 0 ? (
                <div>
                    <div onClick={fetchTokenData}>Your Tokens:</div>
                    <ul>
                        {Array.from(driveMap.entries()).map(([tokenId, isEmpty]) => (  //([tokenId, [discType, discLevel]])
                            <li key={tokenId}>
                                DRIVE ID: {tokenId} - FULL: {isEmpty}
                            </li>
                        ))}
                    </ul>
                </div>) : (


                <div className="border-rounded border-2 border-black cursor-pointer" onClick={fetchTokenData}>{loading ? <div class="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6z"></path>
                    </svg>
                    <span>Loading...</span>
                </div> : <div>CHECK MY EMPTY DRIVES</div>}
                </div>

            ))}
        </>
    )

}