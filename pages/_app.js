import { WagmiConfig } from 'wagmi'
import '../styles/globals.css'
import { client, rainbowChains } from "../config/wagmiConfig";
import 'react-toastify/dist/ReactToastify.css';
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ToastContainer } from 'react-toastify';
import "@rainbow-me/rainbowkit/styles.css";

export default function App({ Component, pageProps }) {
  return (<WagmiConfig client={client}><RainbowKitProvider modalSize="compact" chains={rainbowChains}><Component {...pageProps} /></RainbowKitProvider></WagmiConfig>
  )
}