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

export default function StakeDrive() {

    const { address, isConnecting, isDisconnected, isConnected } = useAccount();
    const [driveID, setDriveID] = useState(0);
    const [approval, setApproval] = useState(false);


    const { refetchStake, setRefetchStake } = useActions();


    const { data: isApprovedForAll, isError: isReadOwnerError, error: readOwnerError } = useContractRead({
        address: CONTRACTS.PEPE_DRIVE,
        abi: PEPE_DRIVE_CONTRACT.abi,
        functionName: 'isApprovedForAll',
        args: [address, CONTRACTS.PEPE_STAKING],

    })

    console.log(isApprovedForAll)

    const {
        config: approvalConfig,
        error: prepareApprovalConfig,
        isError: isPrepareApprovalConfigError,
    } = usePrepareContractWrite({
        address: CONTRACTS.PEPE_DRIVE,
        abi: PEPE_DRIVE_CONTRACT.abi,
        functionName: "setApprovalForAll",
        args: [CONTRACTS.PEPE_STAKING, true],

    });
    const { data: approvalData, write: giveApproval } = useContractWrite(approvalConfig);

    const { isLoading: approvalTransactionLoading, isSuccess: approvalTransactionSuccess } =
        useWaitForTransaction({
            hash: approvalData?.hash,

            onSuccess() {
                write?.();
                setApproval(true);
            },
        });



    useEffect(() => {

        console.log("prepareApproval: ", prepareApprovalConfig)
    }, [isPrepareApprovalConfigError])


    useEffect(() => {
        setApproval(Boolean(isApprovedForAll))
    }, [])


    const {
        config,
        error: prepareError,
        isError,
    } = usePrepareContractWrite({
        address: CONTRACTS.PEPE_STAKING,
        abi: PEPE_STAKING_CONTRACT.abi,
        functionName: "stakeDrive",
        args: [driveID],

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

    const handleInputChange = (event) => {
        setDriveID(event.target.value);
    };




    return (

        <div className="flex flex-col items-center">
            <p>STAKE NOW:</p>
            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="number"
                placeholder="Enter a number"
                value={driveID}
                onChange={handleInputChange}
                aria-label="Enter a number"
            />


            {approval.toString()}
            {(isPrepareApprovalConfigError) ? (
                <div className={`${styles.font_style_1}`}>
                    {parseErrorMessage(prepareError)
                        .toUpperCase()
                        .replace(/EXECUTION REVERTED:/g, "")}
                </div>
            ) : (
                !approval ? (
                    <article className={`${styles.font_style_1}`}>
                        <span
                            className={styles.mint_btn}
                            onClick={() => {
                                console.log("write")
                                giveApproval?.();
                            }}
                        >
                            APPROVE FOR STAKE
                        </span>{" "}

                    </article>
                ) :

                    (

                        prepareError ? (
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
                                    STAKE NOW
                                </span>{" "}

                            </article>
                        )
                    )

            )}



        </div>
    )
}