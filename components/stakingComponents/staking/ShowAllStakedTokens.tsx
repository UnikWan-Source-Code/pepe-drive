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

export default function ShowAllStakedTokens() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [driveID, setDriveID] = useState();
    const { driveToQuery, setDriveToQuery } = useActions();

    const { stakingDriveOwner, setStakingDriveOwner } = useActions();

    const { currentOwner, setCurrentOwner } = useActions();

    const { freeMintDisc, setFreeMintDisc } = useActions();


    enum TokenType {
        DISC,
        DRIVE
    }


    const { data: discs, isError: isReadDiscError, error: readDiscError } = useContractRead({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: 'returnTokensOfOwner',
        args: [address, TokenType.DISC],

    })

    const { data: drives, isError: isReadDrivesError, error: readDrivesError } = useContractRead({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: 'returnTokensOfOwner',
        args: [address, TokenType.DRIVE],

    })

    useEffect(() => {
        console.log(readDiscError)
        console.log(readDrivesError)
    }, [isReadDiscError, isReadDrivesError])


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



    const stringDrives = drives.map((number) => number.toString());

    const stringDiscs = discs.map((number) => number.toString());

    return (
        <>
            <div>
                YOUR STAKED DRIVES:
                {stringDrives.map((number, index) => (
                    <p key={index}>{number}</p>
                ))}


            </div>

            <div>
                YOUR STAKED DISCS:
                {stringDiscs.map((number, index) => (
                    <p key={index}>{number}</p>
                ))}


            </div>

        </>
    )
}