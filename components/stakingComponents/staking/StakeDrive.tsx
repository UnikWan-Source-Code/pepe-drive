import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { useState, useEffect } from "react";
import PEPE_DRIVE_CONTRACT from "../../../contract/PepeDrive.json";
import PEPE_STAKING_CONTRACT from "../../../contract/PepeStaking.json";
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


        if (parsed == "execution reverted: you are not the owner") {
            return "YOU NEED TO OWN THE DRIVE.";
        }


        if (parsed == "invalid BigNumber string") {
            return "JUST ENTER A NUMBER.";
        }

        return JSON.parse(JSON.stringify(error)).reason;
    };

    const handleInputChange = (event) => {
        setDriveID(event.target.value);
    };




    return (

        <div className="flex flex-col items-center border-2 border-black p-4 w-1/2">
            <div className="text-gray-400">YOU CAN STAKE YOUR DRIVES HERE.</div>
            <div className="text-gray-400 text-xs">*YOU NEED TO GIVE APPROVAL FIRST.</div>

            <div className="mt-8">STAKE NOW:</div>
            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none text-center"
                type="number"
                placeholder="ENTER YOUR DRIVE NUMBER"
                value={driveID}
                onChange={handleInputChange}
                aria-label="ENTER YOUR DRIVE NUMBER"
            />

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