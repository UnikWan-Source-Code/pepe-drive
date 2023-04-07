import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { useState, useEffect } from "react";
import PEPE_DRIVE_CONTRACT from "../../../contract/PepeDrive.json";
import PEPE_DISC_CONTRACT from "../../../contract/PepeDisc.json";
import PEPE_STAKING_CONTRACT from "../../../contract/PepeStaking.json";
import CHARACTER_CONTRACT from "../../../contract/Character.json";
import { CONTRACTS } from "../../../config/ContractEnum";
import { useActions } from "../../../hooks/useActions";
import styles from "../../../styles/Home.module.css";
import { ethers } from "ethers";

export default function MintCharacter() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [discID, setDiscID] = useState(0);
    const [discType, setType] = useState(ethers.BigNumber.from(0));

    const { refetchBreeding, setRefetchBreeding } = useActions();





    const {
        config,
        error: prepareError,
        isError,
    } = usePrepareContractWrite({
        address: CONTRACTS.CHARACTER,
        abi: CHARACTER_CONTRACT.abi,
        functionName: "mintMyCharacter",
        args: [discID],

    });
    const { data, write, error: writeError } = useContractWrite(config);

    const { isLoading: transactionLoading, isSuccess: transactionSuccess } =
        useWaitForTransaction({
            hash: data?.hash,

            onSuccess() {
                setRefetchBreeding(!refetchBreeding)
            },
        });


    useEffect(() => {
        console.log("prepareError")
        console.log(prepareError)
    }, [isError])



    const parseErrorMessage = (error) => {
        const parsed = JSON.parse(JSON.stringify(error)).reason;
        console.log(parsed);

        if (parsed === "execution reverted: token limit per wallet reached") {
            return "TOKEN LIMIT REACHED";
        }


        return JSON.parse(JSON.stringify(error)).reason;
    };

    const handleInputChange = (event) => {
        setDiscID(event.target.value);

    };




    return (

        <div className="flex flex-col items-center border-2 border-black p-4 w-1/2">
            <div className="text-gray-400">MINT YOUR CHARACTERS!</div>
            <div className="text-gray-400 text-xs">*THEY NEED TO BE FINISHED FIRST...</div>

            <p>SELECT CHARACTER TO BREED:</p>
            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none text-center"
                type="number"
                placeholder="Enter a number"
                value={discID}
                onChange={handleInputChange}
                aria-label="Enter a number"
            />


            {
                (isError) ? (
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
                            MINT NOW!
                        </span>{" "}



                    </article>
                )
            }


        </div>
    )
}