import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Dialog } from '@headlessui/react';
import Link from "next/link";
import styles from "../styles/Home.module.css";
import mintUpimg from "../public/images/mint-up.svg";
import mintDownimg from "../public/images/mint-down.svg";
import ethLogo from "../public/images/eth-logo.svg";
import mainLogo from "../public/images/pdrive-main-logo.png";
import mainLogoM from "../public/images/pdrive-main-logo-m.png";
import soundOn from "../public/images/sound-on.svg";
import soundOff from "../public/images/sound-off.svg";
import twitterLogo from "../public/images/twitter-logo.svg";
import PriceDetails from "../components/PriceDetails";
import { useConnect, useAccount, connectors, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import CmContract from '../contract/PepeDrive.json';
import { CONTRACTS } from '../config/ContractEnum';
import { ethers } from 'ethers';
import ToastMessage from '../components/ErrorAlert';

export default function Dashboard() {
  const [showSound, setSound] = useState(false);
  const [showWallet, setWallet] = useState(false);
  const [showMint, setMint] = useState(false);
  const [showConnection, setConnection] = useState("");
  const [showNum, setNum] = useState(1);
  const [open, setOpen] = useState(false);
  const [saleIsActive, setSaleActive] = useState(false);
  const [listingPrice, setListingPrice] = useState(ethers.BigNumber.from(0));
  const [alreadyMinted, setAlreadyMinted] = useState(0);
  const [connected, setConnected] = useState(false);
  const [proof, setProof] = useState([])



  const router = useRouter();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const cmContract = {
    address: CONTRACTS.GOERLI,
    abi: CmContract.abi,
  };


  const {
    config,
    error: prepareError,
    isError,
  } = usePrepareContractWrite({
    address: CONTRACTS.GOERLI,
    abi: CmContract.abi,

    functionName: 'mint',
    args: [showNum, proof],
    overrides: {
      value: listingPrice.mul(showNum),
    },
  });
  const { data, write, error: writeError } = useContractWrite(config);



  const { isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
    hash: data?.hash,

    onSuccess() {
      console.log("success!")
    },
  });

  const parseErrorMessage = (error) => {
    const parsed = JSON.parse(JSON.stringify(error)).reason;
    console.log(parsed);

    if (parsed === 'execution reverted: token limit per wallet reached') {
      return "Limit for your wallet reached"
    }

    if (parsed === 'insufficient funds for intrinsic transaction cost') {
      return 'You need more ETH to mint';
    }
    if (parsed == "execution reverted: Mint not started, yet") {
      return "Mint not active"
    }
    if (parsed == "execution reverted: Mint is over") {
      return "Mint is over"
    }
    if (parsed == "execution reverted: Invalid proof") {
      return "Not whitelisted. Sad."
    }

    return JSON.parse(JSON.stringify(error)).reason;

  };



  useEffect(() => {
    // console.log(isError);
    if (isError) {
      ToastMessage({ prepareError });
    }
  }, [isError]);


  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/merkle`, {
        method: 'POST',
        body: JSON.stringify({ input: address }),
      });
      const { proof, root } = await response.json();
      console.log('proof: ', proof);
      setProof(proof);
    }
    fetchData();
  }, [address]);





  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    router.push("/dashboard");
  }, []);
  const connectWallet = (e) => {
    e.preventDefault();
    setConnection("connecting");
    setOpen(true)

  };

  useEffect(() => {
    if (isConnected) {
      setWallet(true);
      setConnection("connected");
      setOpen(false);
    }
  }, [isConnected])

  // const mintNow = () => {
  //   if (showNum > 0) {
  //     setConnection("minting");
  //     setTimeout(function () {
  //       setConnection("minted");
  //       setMint(true);
  //     }, 2000);
  //   }
  // };





  const {
    data: readData,
    isError: isReadError,
    isLoading: isReadLoading,
    error: readError,
    refetch,
  } = useContractReads({
    contracts: [
      {
        ...cmContract,
        functionName: 'saleIsActive',
      },

      {
        ...cmContract,
        functionName: 'listingPrice',
      },
      {
        ...cmContract,
        functionName: 'totalSupply',
      },


    ],

  });


  useEffect(() => {
    //console.log("read data: ", readData);
    if (typeof readData !== 'undefined') {
      if (readData[0] != null) {
        console.log(readData);
        setSaleActive(Boolean(readData[0]));
      }
      if (readData[1] != null) {
        setListingPrice(ethers.BigNumber.from(readData[1]));
      }
      if (readData[2] != null) {
        setAlreadyMinted(Number(readData[2]));
      }
      if (readData[3] != null && readData[4] != null) {
        setWalletLimit(Number(readData[3]) - Number(readData[4]));
      }


    }
  }, [readData]);





  const togglePlay = () => {
    var audio = document.getElementById("audio");
    if (audio.paused) {
      setSound(true);
      audio.play();
    } else {
      setSound(false);
      audio.pause();
      // audio.currentTime = 0;
    }
  };

  const incCount = () => {

    setNum(showNum + 1);
  };

  const decCount = () => {
    if (showNum != 0) {
      setNum(showNum - 1);
    }
  };

  return (
    <>
      <main className={styles.pdrive_landing_page}>
        <Dialog
          as="div"
          className=" z-40  fixed inset-0"
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-around p-4">
            <Dialog.Panel className="w-full max-w-sm rounded bg-black text-white text-center border-2 border-black p-8">
              <Dialog.Title className="text-2xl font-bold pb-4">
                CONNECT WALLET
              </Dialog.Title>
              <Dialog.Description>
                Please connect one of your wallets to mint a NFT.
              </Dialog.Description>
              <div className="flex flex-col pt-8">
                {connectors.map((connector) => (
                  <div key={connector.id}>
                    <button
                      className="px-3 py-2 w-3/4 text-white text-lg font-medium hover:text-black hover:bg-amber-400 cursor-pointer text-nav_font_active"
                      key={connector.id}
                      onClick={() => connect({ connector })}
                    >
                      <div className="flex flex-row items-center justify-start">
                        <div className="">
                          <Image
                            src={`/images/${connector.id}.svg`}
                            alt={connector.name}
                            height={32}
                            width={32}
                          />
                        </div>
                        <div className="ml-2">
                          {connector.name}
                          {!connector.ready}
                          {isLoading && connector.id === pendingConnector?.id}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}

              </div>


            </Dialog.Panel>
          </div>
        </Dialog>
        <div className={styles.pdrive_hero_section}>
          <div className={styles.pdrive_page_top}>
            <div className={styles.pdrive_logo_box}>
              <div className={styles.pdrive_logo_img}>
                <div className={styles.pdrive_logo_src}>
                  <Image src={ethLogo} alt="Logo" width={65} height={105} />
                </div>
              </div>
              <div className={styles.cnt_wallet}>
                {!isConnected ? (
                  <a
                    href=""
                    onClick={(e) => {
                      connectWallet(e);
                    }}
                    className={`${styles.cnt_walet_text} ${styles.font_style_1}`}
                  >
                    CONNECT WALLET
                  </a>
                ) : (
                  <>
                    <article
                      className={`${styles.font_style_1} ${styles.cnt_walet_text} `}
                    >
                      WALLET CONNECTED
                    </article>
                    <article
                      className={`${styles.font_style_1} ${styles.cnt_wallet_adr} `}
                    >
                      {isConnected && (address?.slice(0, 6) + '...' + address?.slice(38, 42))}
                    </article>
                    <span className={styles.showinmobile}>
                      <PriceDetails showWallet={showWallet} />
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className={`${styles.eth_details_box}`}>
              <span className={styles.showindesktop}>
                <PriceDetails showWallet={showWallet} />
              </span>
            </div>
          </div>
          <div className={styles.pdrive_page_body}>
            <span className={styles.showindesktop_f}>
              <Image
                className={styles.main_logo_pepe}
                src={mainLogo}
                alt="Logo"
              />
            </span>
            <span className={styles.showinmobile_f}>
              <Image
                className={styles.main_logo_pepe}
                src={mainLogoM}
                alt="Logo"
              />
            </span>

            <div className={styles.pdrive_mint_steps}>
              {transactionSuccess ? (
                <article
                  className={`${styles.font_style_1} ${styles.extra_lh}`}
                >
                  YOU SUCCESSFULLY
                  <br />
                  MINTED {showNum} PEPE DRIVE NFTS
                </article>
              ) : showWallet == true ? (
                <>
                  <div>
                    <div className={`${styles.mb} ${styles.count_flex}`}>
                      <div className={styles.arrow_flex}>
                        <span
                          onClick={() => {
                            incCount();
                          }}
                        >
                          <Image
                            src={mintUpimg}
                            alt="up"
                            width={20}
                            height={20}
                          />
                        </span>
                        <span
                          onClick={() => {
                            decCount();
                          }}
                        >
                          <Image
                            src={mintDownimg}
                            alt="down"
                            width={20}
                            height={20}
                          />
                        </span>
                      </div>
                      {prepareError ? <div className={`${styles.font_style_1}`}> {parseErrorMessage(prepareError)}</div> : (


                        <article className={`${styles.font_style_1}`}>
                          <span id="count">{showNum ? showNum : "0"}</span>{" "}
                          <span
                            className={styles.mint_btn}
                            onClick={() => {
                              write?.();
                            }}
                          >
                            MINT NOW
                          </span>{" "}
                          {(ethers.utils.formatEther(listingPrice) * showNum).toFixed(3)}
                        </article>
                      )}
                    </div>
                    <div>
                      <article className={`${styles.font_style_1}`}>
                        {alreadyMinted} / 3333 AVAILABLE
                      </article>
                    </div>
                  </div>

                </>
              ) : (
                <article className={`${styles.font_style_1}`}>
                  SOON... FEW..
                </article>
              )}
            </div>
          </div>
          <div className={styles.pdrive_page_bottom}>
            <div className={styles.pdrive_page_sound}>
              <audio id="audio" preload="auto" loop>
                <source
                  src="https://www.unikwan.com/projects/2023/pepe-drive/pepe_drip.mp3"
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  togglePlay();
                }}
              >
                <Image
                  src={showSound == true ? soundOn : soundOff}
                  alt="Logo"
                  width={80}
                  height={80}
                />
              </span>
            </div>
            <div className={styles.pdrive_mint_status}>
              {transactionLoading ? (
                <article
                  className={`${styles.mint_status_text} ${styles.font_style_1}`}
                >
                  MINTING...
                </article>
              ) : transactionSuccess ? (
                <article
                  className={`${styles.mint_status_text} ${styles.font_style_1}`}
                >
                  MINTED
                </article>
              ) : showConnection == "connecting" ? (
                <article
                  className={`${styles.mint_status_text} ${styles.font_style_1}`}
                >
                  CONNECTING...
                </article>
              ) : showConnection == "connected" ? (
                <article
                  className={`${styles.mint_status_text} ${styles.font_style_1}`}
                >
                  CONNECTED
                </article>
              ) : (
                <article
                  className={`${styles.mint_status_text} ${styles.font_style_1}`}
                >
                  X DAYS TO MINT
                </article>
              )}
              <ProgressBar
                className={"progressbar_border"}
                barContainerClassName={
                  showConnection == "connected" || showConnection == "minted"
                    ? "progressbar_inner_bg"
                    : "progressbar_width"
                }
                completed={
                  showConnection == "connecting" || showConnection == "minting"
                    ? 100
                    : showConnection == "connected" ||
                      showConnection == "minted"
                      ? 0
                      : 0
                }
                transitionDuration={
                  showConnection == "connected" || showConnection == "minted"
                    ? "0s"
                    : "2s"
                }
                bgColor={"#70B959"}
                borderRadius={"0"}
                isLabelVisible={false}
              />
            </div>
            <div className={styles.pdrive_page_social}>
              <Link target="_blank" href="https://twitter.com/">
                <Image src={twitterLogo} alt="Logo" width={80} height={80} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
