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

export default function PrepareMint() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [discID, setDiscID] = useState(0);
    const [discType, setType] = useState(ethers.BigNumber.from(0));

    const RARITY = ["FARMER", "BULL", "BEAR"];



    const {
        data: readData,
        isError: isReadError,
        isLoading: isReadLoading,
        error: readError,
    } = useContractRead({
        address: CONTRACTS.PEPE_DISC,
        abi: PEPE_DISC_CONTRACT.abi,
        functionName: 'tokensOfOwner',
        args: [discID],


    });


    const {
        data: readPrice,
        isError: isReadPrice,
        isLoading: isReadPriceLoading,
        error: readPriceError,
    } = useContractRead({
        address: CONTRACTS.CHARACTER,
        abi: CHARACTER_CONTRACT.abi,
        functionName: 'calculateTokenPrice',
        args: [discID],


    });


    useEffect(() => {
        if (readData != undefined) {
            setType(readData.tokenType)
            console.log(readData.tokenType)
        }
    })



    const {
        config,
        error: prepareError,
        isError,
    } = usePrepareContractWrite({
        address: CONTRACTS.CHARACTER,
        abi: CHARACTER_CONTRACT.abi,
        functionName: "prepareMint",
        args: [discID, readPrice],

    });
    const { data, write, error: writeError } = useContractWrite(config);

    const { isLoading: transactionLoading, isSuccess: transactionSuccess } =
        useWaitForTransaction({
            hash: data?.hash,

            onSuccess() {
                console.log("success!");
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

        if (parsed === "execution reverted: token limit per wallet reached") {
            return "TOKEN LIMIT REACHED";
        }

        if (parsed === "insufficient funds for intrinsic transaction cost") {
            return "YOU NEED MORE ETH";
        }
        if (parsed == "execution reverted: Mint not started, yet") {
            return "MINT NOT OPEN";
        }
        if (parsed == "execution reverted: Mint is over") {
            return "MINT IS OVER";
        }
        if (parsed == "execution reverted: Invalid proof") {
            return "NOT WHITELISTED. SAD.";
        }

        return JSON.parse(JSON.stringify(error)).reason;
    };

    const handleInputChange = (event) => {
        setDiscID(event.target.value);

    };




    return (

        <div className="flex flex-col items-center">

            <p>SELECT DRIVE:</p>
            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
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
                            START BREEDING
                        </span>{" "}



                    </article>
                )
            }
            <div>{discID}</div>
            <div>DISC: {RARITY[Number(discType)]}</div>
            <div>PRICE: {readPrice}</div>


        </div>
    )
}