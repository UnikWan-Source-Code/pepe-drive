
import { BigNumber, ethers } from "ethers";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";


interface IActionContext {
    setFreeMintDisc: Dispatch<SetStateAction<BigNumber>>;
    setCurrentOwner: Dispatch<SetStateAction<string>>;
    setDriveToQuery: Dispatch<SetStateAction<number>>;
    setBalancePepe: Dispatch<SetStateAction<BigNumber>>;
    setStakingDriveOwner: Dispatch<SetStateAction<string>>;
    setRefetchDisc: Dispatch<SetStateAction<boolean>>;
    setRefetchStake: Dispatch<SetStateAction<boolean>>;
    setRefetchBreeding: Dispatch<SetStateAction<boolean>>;
    refetchBreeding: boolean;
    refetchStake: boolean;
    refetchDisc: boolean;
    stakingDriveOwner: string;
    balancePepe: BigNumber;
    freeMintDisc: BigNumber;
    currentOwner: string;
    driveToQuery: number;


}

const ActionContext = createContext({} as IActionContext);

interface Props {
    children?: ReactNode;
}

export function ActionProvider({ children }: Props) {
    const [freeMintDisc, setFreeMintDisc] = useState(ethers.BigNumber.from(1));
    const [driveToQuery, setDriveToQuery] = useState(0);
    const [currentOwner, setCurrentOwner] = useState(ethers.constants.AddressZero)
    const [stakingDriveOwner, setStakingDriveOwner] = useState(ethers.constants.AddressZero)
    const [balancePepe, setBalancePepe] = useState(ethers.BigNumber.from(0));
    const [refetchDisc, setRefetchDisc] = useState(false);
    const [refetchStake, setRefetchStake] = useState(false);
    const [refetchBreeding, setRefetchBreeding] = useState(false);

    const providerValues: IActionContext = useMemo(
        () => ({
            freeMintDisc,
            driveToQuery,
            currentOwner,
            balancePepe,
            stakingDriveOwner,
            refetchDisc,
            refetchStake,
            refetchBreeding,
            setRefetchBreeding,
            setRefetchStake,
            setRefetchDisc,
            setDriveToQuery,
            setFreeMintDisc,
            setCurrentOwner,
            setBalancePepe,
            setStakingDriveOwner

        }),
        [freeMintDisc, currentOwner, driveToQuery, balancePepe, stakingDriveOwner, refetchDisc, refetchStake, refetchBreeding]
    );

    return (
        <ActionContext.Provider value={providerValues}>
            {children}
        </ActionContext.Provider>
    );
}

export function useActions() {
    return useContext(ActionContext);
}