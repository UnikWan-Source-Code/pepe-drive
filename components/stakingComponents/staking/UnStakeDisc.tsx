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

export default function UnStakeDisc() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [driveID, setDriveID] = useState(0);

    const [discID, setDiscID] = useState(0);

    const { refetchStake, setRefetchStake } = useActions();

    const { driveToQuery, setDriveToQuery } = useActions();

    const { stakingDriveOwner, setStakingDriveOwner } = useActions();

    const { currentOwner, setCurrentOwner } = useActions();

    const { freeMintDisc, setFreeMintDisc } = useActions();




    const {
        config,
        error: prepareError,
        isError,
    } = usePrepareContractWrite({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: "ejectDisc",
        args: [discID],

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



    const handleDiscChange = (event) => {
        setDiscID(event.target.value);
    };




    return (

        <div className="flex flex-col items-center border-2 border-black p-4 w-1/2">
            <div className="text-gray-400">YOU CAN EJECT YOUR DISCS HERE.</div>
            <div className="text-gray-400 text-xs">*SOMETIMES DISCS BURRRRN...</div>
            <p>UNSTAKE DISC:</p>

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
                        EJECT DISC
                    </span>{" "}

                </article>
            )


            }



        </div>
    )
}