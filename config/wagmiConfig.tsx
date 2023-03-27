import { getDefaultProvider } from 'ethers';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';


const { chains, webSocketProvider, provider } = configureChains(
    [goerli, mainnet],
    [
        infuraProvider({ apiKey: 'bce78b4df3774cfeb430963ce0cb9cde' }),
        publicProvider(),
    ]
);



export const rainbowChains = chains;

const { wallets } = getDefaultWallets({
    appName: "PepeDriveII",
    chains,
});
const connectors = connectorsForWallets([...wallets]);



export const client = createClient({
    autoConnect: false,
    connectors,
    provider,
    webSocketProvider,

});



