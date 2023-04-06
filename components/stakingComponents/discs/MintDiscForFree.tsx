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

export default function MintDiscForFree() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [driveID, setDriveID] = useState();


    const [amount, setAmount] = useState(1);
    const { freeMintDisc, setFreeMintDisc } = useActions();
    const { driveToQuery, setDriveToQuery } = useActions();


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



    const {
        config,
        error: prepareError,
        isError,
    } = usePrepareContractWrite({
        address: CONTRACTS.PEPE_DISC,
        abi: PEPE_DISC_CONTRACT.abi,
        functionName: "mintFreeWithDrive",
        args: [amount, driveToQuery],

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
        console.log(prepareError)
    }, [isError])
    // console.log("fkn result: ", data)




    const handleIncrement = () => {
        if (amount < freeMintDisc) {
            setAmount(amount + 1);
        }
    };

    const handleDecrement = () => {
        setAmount(amount > 0 ? amount - 1 : 0);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        write?.();
    };




    return (
        <>
            <div className="flex flex-col items-center">
                <label htmlFor="amount" className="text-lg font-medium mb-2">
                    You can mint {freeMintDisc.toString()} for this drive for free:
                </label>
                <div className="flex items-center mb-4">
                    <button
                        type="button"
                        onClick={handleDecrement}
                        className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={amount}
                        min={0}
                        className="appearance-none bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-none"
                    />
                    <button
                        type="button"
                        onClick={handleIncrement}
                        className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-r"
                    >
                        +
                    </button>
                </div>

                {prepareError ? (
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
                            MINT NOW
                        </span>{" "}

                    </article>
                )}

            </div>

        </>
    )

}