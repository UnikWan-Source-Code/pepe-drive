import { getDefaultProvider } from 'ethers';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, webSocketProvider, provider } = configureChains(
    [goerli, mainnet],
    [
        infuraProvider({ apiKey: 'bce78b4df3774cfeb430963ce0cb9cde' }),
        publicProvider(),
    ]
);


export const client = createClient({
    autoConnect: false,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'wagmi',
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: "300097ffe5523ee201b113c1af4c9295",
                showQrModal: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
});