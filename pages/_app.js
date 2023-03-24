import { WagmiConfig } from 'wagmi'
import '../styles/globals.css'
import { client } from "../config/wagmiConfig"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }) {
  return (<WagmiConfig client={client}><ToastContainer
    position="top-right"
    autoClose={8000}
    hideProgressBar={false}
    newestOnTop={false}
    draggable={false}
    closeOnClick
    pauseOnHover
  /><Component {...pageProps} /></WagmiConfig>
  )
}