
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
    setFreeMintDisc: Dispatch<SetStateAction<number>>;
    setCurrentOwner: Dispatch<SetStateAction<string>>;
    setDriveToQuery: Dispatch<SetStateAction<number>>;
    freeMintDisc: number;
    currentOwner: string;
    driveToQuery: number;


}

const ActionContext = createContext({} as IActionContext);

interface Props {
    children?: ReactNode;
}

export function ActionProvider({ children }: Props) {
    const [freeMintDisc, setFreeMintDisc] = useState(0);
    const [driveToQuery, setDriveToQuery] = useState(0);
    const [currentOwner, setCurrentOwner] = useState(ethers.constants.AddressZero)

    const providerValues: IActionContext = useMemo(
        () => ({
            freeMintDisc,
            driveToQuery,
            currentOwner,
            setDriveToQuery,
            setFreeMintDisc,
            setCurrentOwner

        }),
        [freeMintDisc, currentOwner, driveToQuery]
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