import {
    useAccount,
    useContractRead,
} from "wagmi";
import { useState, useEffect } from "react";
import PEPE_STAKING_CONTRACT from "../../../contract/PepeStaking.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";

export default function CheckStakedDriveOwner() {

    const [driveID, setDriveID] = useState();
    const { driveToQuery, setDriveToQuery } = useActions();
    const { stakingDriveOwner, setStakingDriveOwner } = useActions();

    const { data: owner, isError: isReadOwnerError, error: readOwnerError } = useContractRead({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: 'ownerOfDrive',
        args: [driveToQuery],

    })

    useEffect(() => {
        console.log(readOwnerError)
    }, [isReadOwnerError])


    useEffect(() => {
        if (owner != undefined) {
            setStakingDriveOwner(String(owner));
        }

    }, [owner])

    const handleInputChange = (event) => {
        setDriveID(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("drive ID in handle Submit: ", driveID); // replace with your submit logic
        setDriveToQuery(driveID);
    };


    return (
        <div className="flex flex-col items-center border-2 border-black p-4 w-1/2 m-8">
            <div className="text-gray-400">YOU CAN CHECK THE REAL OWNER OF THE STAKED DRIVES.</div>
            <form onSubmit={handleSubmit} className="w-full  mt-8">
                <div className="flex items-center border-b-2 border-teal-500 py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="number"
                        placeholder="Enter a number"
                        value={driveID}
                        onChange={handleInputChange}
                        aria-label="Enter a number"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {stakingDriveOwner != undefined ? (
                <div>This staked drive is owned by  {stakingDriveOwner.toString()}</div>) : (<div> DRIVE NOT STAKED </div>)}


        </div>
    )
}