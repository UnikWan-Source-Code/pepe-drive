import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { useState, useEffect } from "react";

import PEPE_STAKING_CONTRACT from "../../../contract/PepeStaking.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";
import styles from "../../../styles/Home.module.css";

export default function StakeDisc() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [driveID, setDriveID] = useState();

    const [discID, setDiscID] = useState();

    const { refetchStake, setRefetchStake } = useActions();






    const {
        config,
        error: prepareError,
        isError,
    } = usePrepareContractWrite({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: "stakeDisc",
        args: [driveID, discID],

    });
    const { data, write, error: writeError } = useContractWrite(config);

    const { isLoading: transactionLoading, isSuccess: transactionSuccess } =
        useWaitForTransaction({
            hash: data?.hash,

            onSuccess() {
                setRefetchStake(!refetchStake)
            },
        });


    useEffect(() => {
        console.log("prepareError")
        console.log(prepareError)
    }, [isError])
    // console.log("fkn result: ", data)

    const parseErrorMessage = (error) => {
        const parsed = JSON.parse(JSON.stringify(error)).reason;
        console.log(parsed);

        if (parsed == "execution reverted: you are not the owner") {
            return "YOU NEED TO OWN THE ASSETS";
        }


        if (parsed == "invalid BigNumber string") {
            return "JUST ENTER A NUMBER.";
        }



        return JSON.parse(JSON.stringify(error)).reason;
    };

    const handleDriveChange = (event) => {
        setDriveID(event.target.value);
    };

    const handleDiscChange = (event) => {
        setDiscID(event.target.value);
    };




    return (

        <div className="flex flex-col items-center border-2 border-black p-4 w-1/2">
            <div className="text-gray-400">YOU CAN STAKE YOUR DISCS HERE.</div>
            <div className="text-gray-400 text-xs">*YOU NEED TO STAKE A DRIVE FIRST.</div>
            <p>STAKE NOW:</p>
            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none text-center"
                type="number"
                placeholder="ENTER YOUR DRIVE NUMBER"
                value={driveID}
                onChange={handleDriveChange}
                aria-label="Enter a number"
            />

            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none text-center"
                type="number"
                placeholder="ENTER YOUR DISC NUMBER"
                value={discID}
                onChange={handleDiscChange}
                aria-label="Enter a number"
            />



            {(prepareError) ? (
                <div className={`${styles.font_style_1}`}>
                    {parseErrorMessage(prepareError)
                        .toUpperCase()
                        .replace(/EXECUTION REVERTED:/g, "")}
                </div>
            ) : (

                <article className={`${styles.font_style_1}`}>
                    <span
                        className={styles.mint_btn}
                        onClick={() => {
                            console.log("write")
                            write?.();
                        }}
                    >
                        STAKE DISC
                    </span>{" "}

                </article>
            )


            }



        </div>
    )
}