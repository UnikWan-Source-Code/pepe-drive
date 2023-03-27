import { WagmiConfig } from "wagmi";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { client, rainbowChains } from "../config/wagmiConfig";

export default function App({ Component, pageProps }) {
  return (<WagmiConfig client={client}><RainbowKitProvider modalSize="compact" chains={rainbowChains}><Component {...pageProps} /></RainbowKitProvider></WagmiConfig>
  );
}
