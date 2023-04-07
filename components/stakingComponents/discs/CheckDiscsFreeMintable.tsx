import {
    useAccount,
    useContractRead,
} from "wagmi";
import { useState, useEffect } from "react";
import PEPE_DRIVE_CONTRACT from "../../../contract/PepeDrive.json";
import PEPE_DISC_CONTRACT from "../../../contract/PepeDisc.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";
import { ethers } from "ethers";

export default function CheckDiscsFreeMintable() {

    const { address } = useAccount();
    const [driveID, setDriveID] = useState();
    const { driveToQuery, setDriveToQuery } = useActions();
    const { refetchDisc, setRefetchDisc } = useActions();
    const { currentOwner, setCurrentOwner } = useActions();

    const { freeMintDisc, setFreeMintDisc } = useActions();


    const { data, isError, error, isLoading, refetch } = useContractRead({
        address: CONTRACTS.PEPE_DISC,
        abi: PEPE_DISC_CONTRACT.abi,
        functionName: 'checkFreePerDriveID',
        args: [driveToQuery],

    })

    const { data: owner, isError: isReadOwnerError, error: readOwnerError, refetch: refetchReadOwner } = useContractRead({
        address: CONTRACTS.PEPE_DRIVE,
        abi: PEPE_DRIVE_CONTRACT.abi,
        functionName: 'ownerOf',
        args: [driveToQuery],

    })

    useEffect(() => {
        console.log(error)
    }, [isError])


    useEffect(() => {
        refetch?.()
        refetchReadOwner?.()
    }, [refetchDisc])



    useEffect(() => {
        console.log(data)
        if (data != undefined && owner != undefined) {
            setFreeMintDisc(ethers.BigNumber.from(data));
            console.log("result: ", data)
            console.log("owner: ", owner)
            setCurrentOwner(owner.toString());
        }

    }, [data, owner])

    const handleInputChange = (event) => {
        setDriveID(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("drive ID in handle Submit: ", driveID); // replace with your submit logic
        setDriveToQuery(driveID);
    };

    // console.log("fkn result: ", data)


    return (
        <div className="border-black w-1/2 border-2 p-4">
            <div className="text-2xl my-8 text-gray-400"> This is a component to check if a drive has free mints left.</div>
            <form onSubmit={handleSubmit} className="w-full max-w-md ">
                <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="number"
                        placeholder="ENTER A DRIVE YOU OWN"
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
            <div className="text-2xl text-green-700">This drive has {freeMintDisc != undefined ? freeMintDisc.toString() : "0"} mints left.</div>
            <div>{currentOwner != undefined && currentOwner == address ? (<div>YES. YOU OWN THIS THING.</div>) : (<div>The current owner is {address} </div>)}</div>

        </div>
    )
}